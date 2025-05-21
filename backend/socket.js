const {Server} = require('socket.io');
const {updateUserTime} = require('./controllers/studentController');

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {origin: "*"},
    });

    const roomTimers = {};

    io.on('connection', (socket) => {
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            const state = roomTimers[roomId] || {time: 0, isRunning: false};
            socket.emit ('timerUpdate', state);
        });

        socket.on('toggleTimer', async({roomId, isRunning, time}) => {
            roomTimers[roomId] = {time, isRunning};
            io.to(roomId).emit('timerUpdate', {time, isRunning});

            if(!isRunning){
                const userId = socket.handshake.auth.userId;
                if (userId) await updateUserTime(userId, roomId, time);
            }
        });

        socket.on('disconnect', () => {});
    });
};
module.exports = setupSocket;