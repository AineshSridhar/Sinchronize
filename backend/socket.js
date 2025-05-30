import { Server } from "socket.io";
import { saveUserStudySession } from "./controllers/studentController.js";
import UserRoomActivity from "./models/UserRoomActivity.js";

const setupSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  const userTimers = {}; // { roomId: { userId: { start: Date } } }

  io.on("connection", (socket) => {
    console.log("Connected to socket server", socket.id);

    socket.on("joinRoom", async ({ roomId, userId }) => {
      console.log("Joined room", socket.id);
      socket.join(roomId);
      socket.to(roomId).emit("userJoined", userId);

      // Check for ongoing session
      const activity = await UserRoomActivity.findOne({ userId, roomId });
      const today = new Date().toISOString().split("T")[0];

      if (activity?.currentSessionStart) {
        const sessionStartDate = activity.currentSessionStart
          .toISOString()
          .split("T")[0];
        if (sessionStartDate === today) {
          socket.emit("resumeTimer", {
            start: activity.currentSessionStart.toISOString(),
          });
        }
      }
    });

    socket.on("leaveRoom", ({ roomId, userId }) => {
      console.log(`User ${userId} left room ${roomId}`);
      socket.leave(roomId);
      socket.to(roomId).emit("userLeft", userId);
    });

    socket.on("startTimer", async ({ roomId, userId, start }) => {
      userTimers[roomId] = userTimers[roomId] || {};
      userTimers[roomId][userId] = { start: new Date(start) };

      // Update currentSessionStart in the database
      await UserRoomActivity.findOneAndUpdate(
        { userId, roomId },
        { currentSessionStart: new Date(start) }
      );

      // Broadcast to others
      socket.to(roomId).emit("userTimerStarted", { userId, start });
    });

    socket.on("stopTimer", async ({ roomId, userId }) => {
      console.log("Stopping timer for userId:", userId);
      const session = userTimers[roomId]?.[userId];
      const end = new Date();
      const start = session?.start;
      if (!start) return;

      await saveUserStudySession(userId, roomId, start, end);
      delete userTimers[roomId][userId];

      // Clear currentSessionStart in the database
      await UserRoomActivity.findOneAndUpdate(
        { userId, roomId },
        { currentSessionStart: null }
      );

      const updatedStudent = await UserRoomActivity.findOne({
        userId,
        roomId,
      }).populate("userId");
      io.to(roomId).emit("updateStudyTime", updatedStudent);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

export default setupSocket;
