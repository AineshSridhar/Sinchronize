import { Server } from "socket.io";
import { saveUserStudySession } from "./controllers/studentController.js";

const setupSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  const userTimers = {}; // { roomId: { userId: { start: Date } } }

  io.on("connection", (socket) => {
    console.log("Connected to socket server", socket.id);

    socket.on("joinRoom", ({ roomId, userId }) => {
      console.log("Joined room", socket.id);
      socket.join(roomId);
      socket.to(roomId).emit("userJoined", userId);
    });

    socket.on("leaveRoom", ({ roomId, userId }) => {
      console.log(`User ${userId} left room ${roomId}`);
      socket.leave(roomId);
      socket.to(roomId).emit("userLeft", userId);
    });

    socket.on("startTimer", ({ roomId, userId, start }) => {
      userTimers[roomId] = userTimers[roomId] || {};
      userTimers[roomId][userId] = { start: new Date(start) };

      // Broadcast to others
      socket.to(roomId).emit("userTimerStarted", { userId, start });
    });

    socket.on("stopTimer", async ({ roomId, userId, end }) => {
    console.log("Stopping timer for userId:", userId); // <- Add this line
      console.log("Stopped timer");
      const session = userTimers[roomId]?.[userId];
      if (session && session.start) {
        const start = session.start;
        const duration = Math.floor((new Date(end) - start) / 60000); // mins

        // Clear from memory
        delete userTimers[roomId][userId];

        // Save to DB
        await saveUserStudySession(userId, roomId, start, end, duration);

        // Notify room
        io.to(roomId).emit("userTimerStopped", { userId, end, duration });
      }
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

export default setupSocket;
