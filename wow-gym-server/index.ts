import express from 'express';
import {createServer, RequestListener} from 'http';
import {Server, Socket} from 'socket.io';

const robot = require('kbm-robot');

const HOST: string = '0.0.0.0';
const PORT: number = 1337;

const app = express();
const server = createServer(app as RequestListener);
const io = new Server(server);

server.listen(PORT, HOST, () => {
    console.log(`Listening on port ${PORT}.`);
    console.log('Dark Lady watch over you.');
});

io.on('connection', (socket: Socket) => {
    robot.startJar();
    console.log('connection ', socket.id);
    socket.on('device_walking_start', (msg) => {
        // console.log('device_walking_start');
        robot.press('UP')
            .go();
    });
    socket.on('device_walking_stop', (msg) => {
        // console.log('device_walking_stop');
        robot.release('UP')
            .go();
    });

    socket.on('device_direction_left', (msg) => {
        // console.log('device_walking_start');
        robot.press('LEFT')
            .go();
    });

    socket.on('device_direction_right', (msg) => {
        // console.log('device_walking_start');
        robot.press('RIGHT')
            .go();
    });

    socket.on('device_direction_straight', (msg) => {
        // console.log('device_walking_start');
        robot.release('LEFT')
            .release('RIGHT')
            .go();
    });

    socket.on('device_walking_stop', (msg) => {
        // console.log('device_walking_stop');
        robot.release('UP')
            .go();
    });

    socket.on('disconnect', () => {
        try {
            robot.stopJar();
        } catch (e) {
            console.log(e);
        }
    });
});