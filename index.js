const Kahoot = require("kahoot.js-api");
const Timer = require('./utils/timer');
let tm = new Timer();
let s = process.stdout;

s.write('Starting');

let digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const fetch = require('node-fetch');

function isValid(code) {
  return fetch('https://kahoot.it/reserve/session/'+code);
}

function spawnBot(code) {
  const client = new Kahoot();
  client.join(code, "PinLeaker").catch(err=>{
    s.clearLine();
    s.cursorTo(0);
      process.stdout.write(code + ` (\u001b[31;1mINVALID\u001b[0m) [${tm.min}:${tm.ms}]\n`);
      tm.reset();
      x();
  });
  client.on("Joined", () => {
    s.clearLine();
    s.cursorTo(0);
    process.stdout.write(code + ` (\u001b[32;1mVALID\u001b[0m) [${tm.min}:${tm.ms}]\n`);
    client.leave();
    tm.reset();
    x();
  });
}

function x() {
  let code = '';
  for(i=0; i<6; i++) {
    code += digits[Math.floor(Math.random()*10)];
  }
  fetch('https://kahoot.it/reserve/session/'+code).then(res => {
    if(res.status == 200) {
      tm.startTimer();
      s.clearLine();
      s.cursorTo(0);
      s.write(code + ' (\u001b[33;1mPENDING...\u001b[0m)');
      spawnBot(code);
    } else {
      s.clearLine();
      s.cursorTo(0);
      s.write(code+'');
      x();
    }
  });
}

x();