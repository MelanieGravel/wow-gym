const io = require("socket.io-client");

const socket = io('http://localhost:1337');

socket.on('connect', () => {
    console.log('connect', socket.id);
    socket.emit('device_walking_start');
    setTimeout(() => {
        socket.emit('device_walking_stop');
        process.exit();
    }, 3000)
});

socket.on('disconnect', () => {
    console.log('disconnect', socket.id);
});
