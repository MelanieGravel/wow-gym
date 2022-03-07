import {DeviceEvent} from "./src/models/device-events";
import {delay, wowLog} from "./src/utils";

const io = require("socket.io-client");

const socket = io('http://localhost:1337');

socket.on('connect', async () => {
    wowLog(`Connection for ${socket.id}`);
    await delay(2000);

    socket.emit(DeviceEvent.TARGET_FRIEND);
    await delay(1000);
    socket.emit(DeviceEvent.TARGET_ENEMY);
    await delay(1000);
    socket.emit(DeviceEvent.TARGET_NONE);

    await delay(1000);

    socket.emit(DeviceEvent.WALKING_START);
    await delay(1000);
    socket.emit(DeviceEvent.DIRECTION_LEFT);
    await delay(1000);
    socket.emit(DeviceEvent.DIRECTION_RIGHT);
    await delay(1000);
    socket.emit(DeviceEvent.DIRECTION_STRAIGHT);
    await delay(1000);
    socket.emit(DeviceEvent.WALKING_STOP);

    process.exit();
});

socket.on('disconnect', () => {
    wowLog(`Disconnection for ${socket.id}`);
});
