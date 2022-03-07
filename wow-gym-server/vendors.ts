module.exports = {
  'switch-mario': {
    'vendorId': 3695,
    'productId': 384,
    'state': {
      'button:X': 0,
      'button:A': 0,
      'button:B': 0,
      'button:Y': 0,
      'button:L': 0,
      'button:R': 0,

      'button:Up': 0,
      'button:Right': 0,
      'button:Down': 0,
      'button:Left': 0,

      'button:Start': 0,
      'button:Select': 0
    },
    'prev': {// Simple copy of state
      'button:X': 0,
      'button:A': 0,
      'button:B': 0,
      'button:Y': 0,
      'button:L': 0,
      'button:R': 0,

      'button:Up': 0,
      'button:Right': 0,
      'button:Down': 0,
      'button:Left': 0,

      'button:Start': 0,
      'button:Select': 0
    },
    'update': function (data) {

      var state = this.state;

      state['button:X'] = data[0] === 8;
      state['button:A'] = data[0] === 4;
      state['button:B'] = data[0] === 2;
      state['button:Y'] = data[0] === 1;
      state['button:L'] = data[0] === 16;
      state['button:R'] = data[0] === 32;

      state['button:Left'] = +(data[3] === 0);
      state['button:Right'] = +(data[3] === 255);
      state['button:Up'] = +(data[4] === 0);
      state['button:Down'] = +(data[4] === 255);

      state['button:Start'] = data[1] === 2;
      state['button:Select'] = data[1] === 1;

      return state;
    },
    'setRumble': function () {

    },
    'setLED': function (led, val) {

    }
  }
}
