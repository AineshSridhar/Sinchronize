import { Server } from "socket.io";
import { saveUserStudySession } from "./controllers/studentController.js";
import UserRoomActivity from "./models/UserRoomActivity.js";

const setupSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  const userTimers = {}; // { roomId: { userId: { start: Date } } }

  io.on("connection", (socket) => {
    console.log("Connected to socket server", socket.id);

    socket.on("joinRoom", async ({ roomId, userId }) => {
      if (!roomId || !userId) {
        console.warn("joinRoom missing roomId or userId");
        return;
      }

      console.log(`User ${userId} joined room ${roomId} (socket: ${socket.id})`);
      socket.join(roomId);
      socket.to(roomId).emit("userJoined", userId);

      try {
        const activity = await UserRoomActivity.findOne({ userId, roomId });
        if (activity?.currentSessionStart) {
          const sessionStartDate = activity.currentSessionStart.toISOString().split("T")[0];
          const today = new Date().toISOString().split("T")[0];
          if (sessionStartDate === today) {
            socket.emit("resumeTimer", {
              start: activity.currentSessionStart.toISOString(),
            });
          }
        }
      } catch (err) {
        console.error("Error checking current session on joinRoom:", err);
      }
    });

    socket.on("leaveRoom", ({ roomId, userId }) => {
      if (!roomId || !userId) {
        console.warn("leaveRoom missing roomId or userId");
        return;
      }

      console.log(`User ${userId} left room ${roomId}`);
      socket.leave(roomId);
      socket.to(roomId).emit("userLeft", userId);
    });

    socket.on("startTimer", async ({ roomId, userId, start }) => {
      if (!roomId || !userId || !start) {
        console.warn("startTimer missing required data");
        return;
      }

      userTimers[roomId] = userTimers[roomId] || {};
      userTimers[roomId][userId] = { start: new Date(start) };

      try {
        console.log("received");
        await UserRoomActivity.findOneAndUpdate(
          { userId, roomId },
          { currentSessionStart: new Date(start) },
          { new: true, upsert: true }
        );

        // Notify others in room about timer start
        socket.to(roomId).emit("userTimerStarted", { userId, start });
      } catch (err) {
        console.error("Error updating currentSessionStart on startTimer:", err);
      }
    });

    socket.on("stopTimer", async ({ roomId, userId }) => {
      if (!roomId || !userId) {
        console.warn("stopTimer missing roomId or userId");
        return;
      }

      console.log(`Stopping timer for userId: ${userId} in room: ${roomId}`);
      const session = userTimers[roomId]?.[userId];
      if (!session?.start) {
        console.warn(`No start time found for userId ${userId} in room ${roomId}`);
        return;
      }

      const end = new Date();
      const start = session.start;

      try {
        await saveUserStudySession(userId, roomId, start, end);

        delete userTimers[roomId][userId];

        await UserRoomActivity.findOneAndUpdate(
          { userId, roomId },
          { currentSessionStart: null }
        );

        const updatedStudent = await UserRoomActivity.findOne({ userId, roomId })
          .populate("userId", "name")
          .lean();

        if (!updatedStudent) {
          console.warn("UserRoomActivity not found after stopTimer update");
          return;
        }

        const transformed = {
          ...updatedStudent,
          userId: {
            id: updatedStudent.userId._id.toString(),
            name: updatedStudent.userId.name,
          },
        };

        io.to(roomId).emit("updateStudyTime", transformed);
      } catch (err) {
        console.error("Error processing stopTimer event:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

export default setupSocket;
