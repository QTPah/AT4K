const Kahoot = require("kahoot.js-api");
let s = process.stdout;

s.write('Starting');

let digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const fetch = require('node-fetch');

async function isValid(code) {
  return await fetch('https://kahoot.it/reserve/session/'+code);  
}

function spawnBot(code) {
  const client = new Kahoot();
  client.join(code, "PinLeaker").catch(err=>{
      process.stdout.write("(\u001b[31;1mInvalid\u001b[0m)");
      process.exit(0)
  });
  client.on("Joined", () => {
    process.stdout.write("(\u001b[32;1mValid\u001b[0m)");
    process.exit(0);
  });
}

while(true) {
  let code = '';
  for(i=0; i<7; i++) {
    code += digits[Math.floor(Math.random()*10)];
  }
  if(isValid(code) == 200) {
    s.write(code+'\n');   
  } else {
    s.clearLine();
    s.cursorTo(0);
    s.write(isValid(code));
  }
}

fetch('https://kahoot.it/reserve/session/284955').then(res => console.log(res.status));