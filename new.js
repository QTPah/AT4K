const Kahoot = require("kahoot.js-api");
const fetch = require('node-fetch');
const rl = require('readline').createInterface(process.stdin, process.stdout);
const keypress = require('keypress');
keypress(process.stdin);

let searchTickInterval;

const menu = () => {
    console.clear();
    rl.question('Select: ', res => {
        switch(res) {
            case '0':
                console.clear();
                console.log('Search started. Press "e" to exit.');
                searchTickInterval = setInterval(tick, 1);
                let tmp = (ch, key) => {
                    if(key.name == "e") {
                        clearInterval(searchTickInterval);
                        process.stdout.removeListener('keypress', tmp);
                        menu();
                    }
                }
                process.stdin.addListener('keypress', tmp);
                break;
        }
    });
}

const genRandomPin = () => {
    let digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    let code = '';
    for(i=0; i<6; i++) code += digits[Math.floor(Math.random()*10)];
    return code;
}

spawnBot = (code) => {
    const client = new Kahoot();
    client.join(code, "PinLeaker").catch(err=>{
      threads--;
    });
    client.on("Joined", () => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
      console.log(`${code} (\u001b[32;1mVALID\u001b[0m)`);
      client.leave();
      threads--;
    });
  }

const maxThreads = 10;
let threads = 0;
let tested = 0;

const tick = () => {
    if(threads == maxThreads) return;
    let pin = genRandomPin();
    threads++;
    fetch('https://kahoot.it/reserve/session/'+pin).then(res => {
        tested++;
        if(res.status == 200) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(`${pin} (\u001b[33;1mSEARCHING...\u001b[0m) [${tested}]`);
            spawnBot(pin);
        } else {
            threads--;
        }
    });
}

menu();