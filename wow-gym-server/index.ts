import express from 'express';
import {createServer, RequestListener} from 'http';
import {Server, Socket} from 'socket.io';
import DeviceEventListener from './src/device-event-listener';
import {wowLog} from "./src/utils";

const HOST: string = '0.0.0.0';
const PORT: number = 1337;

const app = express();
const server = createServer(app as RequestListener);
const io = new Server(server);

server.listen(PORT, HOST, () => {
    wowLog(`Listening on port ${PORT}.`);
    wowLog('Dark Lady watch over you.');
});

io.on('connection', (socket: Socket) => {
    const deviceListeners: DeviceEventListener = new DeviceEventListener();
    deviceListeners.initListeners(socket);
});