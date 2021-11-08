const Kahoot = require("kahoot.js-api");

process.stdout.write("                    (\u001b[0m\u001b[33;1mChecking...\u001b[0m) ");

let digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

async function isValid(code) {
  return await require('node-fetch').call('https://kahoot.it/reserve/session/'+code);  
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

require('node-fetch').call('https://kahoot.it/reserve/session/284955').then(res => console.log(res));