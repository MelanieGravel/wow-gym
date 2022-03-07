const HID = require('node-hid');
const robot = require('kbm-robot');
// console.log(HID.devices());

// robot.startJar();

const switchController = new HID.HID(3695, 384);
const buttonsList: ButtonState[] = [
  {
    name: 'Y',
    bufferPosition: 0,
    bufferValue: 1,
    isPressed: false,
    keyboardMap: 'SHIFT',
    onPressed: () => {

    },
    onRelease: () => {

    },
  },
  {
    name: 'B',
    bufferPosition: 0,
    bufferValue: 2,
    isPressed: false,
    keyboardMap: 'Q',
    onPressed: () => {

    },
    onRelease: () => {

    },
  },
  {
    name: 'A',
    bufferPosition: 0,
    bufferValue: 4,
    isPressed: false,
    keyboardMap: 'SPACE',
    onPressed: () => {

    },
    onRelease: () => {

    },
  },
  {
    name: 'X',
    bufferPosition: 0,
    bufferValue: 8,
    isPressed: false,
    keyboardMap: 'C',
    onPressed: () => {

    },
    onRelease: () => {

    },
  },
  {
    name: 'LEFT',
    bufferPosition: 3,
    bufferValue: 0,
    isPressed: false,
    keyboardMap: 'A',
    onPressed: () => {

    },
    onRelease: () => {

    },
  },
  {
    name: 'RIGHT',
    bufferPosition: 3,
    bufferValue: 255,
    isPressed: false,
    keyboardMap: 'D',
    onPressed: () => {

    },
    onRelease: () => {

    },
  },
  {
    name: 'UP',
    bufferPosition: 4,
    bufferValue: 0,
    isPressed: false,
    keyboardMap: 'W',
    onPressed: () => {

    },
    onRelease: () => {

    },
  },
  {
    name: 'DOWN',
    bufferPosition: 4,
    bufferValue: 255,
    isPressed: false,
    keyboardMap: 'S',
    onPressed: () => {

    },
    onRelease: () => {

    },
  },
];
let previousBuffer = null;
let newBuffer = null;

switchController.on('data', function (data) {
  newBuffer = data.toJSON().data;
  // console.log(previousBuffer, newBuffer)

  if(previousBuffer !== null) {
    buttonsList.forEach((btn: ButtonState) => {
      if (newBuffer[btn.bufferPosition] !== previousBuffer[btn.bufferPosition]) {
        if (btn.isPressed) {
          btn.isPressed = false;
          mapButton(btn.keyboardMap, false);
          btn.onRelease();
          console.log(btn.name, ' RELEASE')
        } else {
          if(newBuffer[btn.bufferPosition] === btn.bufferValue){
            console.log(btn.name, ' PRESSED')
            btn.isPressed = true;
            mapButton(btn.keyboardMap, true);
            btn.onPressed();
          };
        }
      }
    });
  }

  previousBuffer = newBuffer;
});

const mapButton = (key: string, isPressed:boolean) => {
  if(isPressed) {
    // robot.press(key)
    //   .go();
    console.log('KEYBOARD PRESS', key)
  } else {
    // robot.release(key)
    //   .go();
    console.log('KEYBOARD RELEASE', key)
  }
}

interface ButtonState {
  name: String;
  bufferPosition: number;
  bufferValue: number;
  isPressed: boolean;
  keyboardMap: string;
  onPressed?: () => void;
  onRelease?: () => void;
}
