import {Socket} from "socket.io";
import {DeviceEvent} from "./models/device-events";
import {wowLog} from "./utils";



const robot = require('kbm-robot');

export default class DeviceEventListener {
    private isMoving: boolean = false;
    private _socket: Socket;
    private stopCallback: () => void;

    public initListeners(socket: Socket, stopCallback?: () => void): void {
        this._socket = socket;

        wowLog(`Connection for ${this._socket.id}`);

        robot.startJar();

        this._socket.on(DeviceEvent.WALKING_START, async (msg) => {
            wowLog(DeviceEvent.WALKING_START);
            this.isMoving = true;
            await robot.press('w')
                .go();
        });

        this._socket.on(DeviceEvent.WALKING_STOP, async (msg) => {
            wowLog(DeviceEvent.WALKING_STOP);
            await robot.release('w')
                .go();
            this.isMoving = false;
        });

        this._socket.on(DeviceEvent.DIRECTION_LEFT, async (msg) => {
            wowLog(DeviceEvent.DIRECTION_LEFT);
            await this.releaseDirection();
            await robot.press('a')
                .go();
        });

        this._socket.on(DeviceEvent.DIRECTION_RIGHT, async (msg) => {
            wowLog(DeviceEvent.DIRECTION_RIGHT);
            await this.releaseDirection();
            await robot.press('d')
                .go();
        });

        this._socket.on(DeviceEvent.DIRECTION_STRAIGHT, async (msg) => {
            wowLog(DeviceEvent.DIRECTION_STRAIGHT);
            await this.releaseDirection();
        });

        this._socket.on(DeviceEvent.TARGET_FRIEND, async (msg) => {
            wowLog(DeviceEvent.TARGET_FRIEND);
            await robot.press('tab')
                .sleep(100)
                .release('tab')
                .go();
        });

        this._socket.on(DeviceEvent.TARGET_ENEMY, async (msg) => {
            wowLog(DeviceEvent.TARGET_ENEMY);
            await robot.press('ctrl')
                .press('shift')
                .press('tab')
                .sleep(100)
                .release('tab')
                .release('ctrl')
                .release('shift')
                .go();
        });

        this._socket.on(DeviceEvent.TARGET_NONE, async (msg) => {
            wowLog(DeviceEvent.TARGET_NONE);
            await robot.press('ESC')
                .sleep(200)
                .release('ESC')
                .go();
        });

        this._socket.on('disconnect', () => {
            try {
                wowLog(`Disconnection for ${this._socket.id}`);
                robot.stopJar();
            } catch (e) {
                wowLog(e);
            }
            if (this.stopCallback) {
                this.stopCallback();
            }
        });
    }

    private async releaseDirection(): Promise<void> {
        await robot.release('a')
            .release('d')
            .go();
    }
}