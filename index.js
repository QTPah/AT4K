const Kahoot = require("kahoot.js-api");
const Timer = require('./utils/timer');
let tm = new Timer();
let s = process.stdout;

s.write('Starting');

let digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const fetch = require('node-fetch');

let maxThreads = 2;
let threads = 0;

function spawnBot(code) {
  const client = new Kahoot();
  client.join(code, "PinLeaker").catch(err=>{
    console.log(code);
  });
  client.on("Joined", () => {
    console.log(code);
    client.leave();
  });
}

while(true){
  if(threads < maxThreads) {
    let code = '';
    for(i=0; i<6; i++) {
      code += digits[Math.floor(Math.random()*10)];
    }
    threads += 1;
    fetch('https://kahoot.it/reserve/session/'+code).then(res => {
      threads -= 1;
      console.log(threads);
      if(res.status == 200) {
        spawnBot(code);
      } else {
        console.log(threads);
      }
    });
  }
}