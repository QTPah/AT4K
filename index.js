const Kahoot = require("kahoot.js-api");
const fetch = require('node-fetch');
const { CLI, Command, CC } = require('./nodecli');
const keypress = require('keypress');
keypress(process.stdin);

let searchTickInterval;
let targetPin;
let activeBots = [];
const maxThreads = 10;
let threads = 0;
let tested = 0;

console.log(`\u001b[31;1m
             _______  _  _    _  __
         /\\ |__   __|| || |  | |/ /
        /  \\   | |   | || |_ | ' /     ${CC.B_CYAN}1.2.4${CC.RESET}${CC.B_RED}
       / /\\ \\  | |   |__   _||  <  
      / ____ \\ | |      | |  | . \\ 
     /_/    \\_\\|_|      |_|  |_|\\_\\\u001b[0m
    Advanced   Tool     For  Kahoot                 By QTPah

    ${CC.BG_RED}DISCLAIMER: We assume no liability for use of this Tool.${CC.RESET}

    ${CC.B_MAGENTA}Discord${CC.RESET}: @QTPah#0999
    ${CC.B_MAGENTA}Github${CC.RESET}: qtpah\u001b[0m
`);
let cli = new CLI(`${CC.RESET}${CC.B_WHITE}[${CC.B_MAGENTA}A4TK${CC.B_WHITE}]${CC.RESET} > `);

cli.addCommand(new Command('scan', (args, p) => {
    console.log('Search started. Press "e" to exit.');
    searchTickInterval = setInterval(tick, 1);
    let onKey = (ch, key) => {
        if(key.name == "e") {
            clearInterval(searchTickInterval);
            onKey = () => {};
            p();
        } else {
            process.stdin.once('keypress', onKey);
        }
    }
    process.stdin.once('keypress', onKey);
}));

cli.addCommand(new Command('help', (args, p) => {
    console.log(`   Commands:
    help : See this message.
    scan : Scan for random Kahoot pins.
    spawn [NAME] [PIN] : Spawn a Bot into a Kahoot game. If you locked in a pin, you don't need to fill in the second argument and it will automatically use the locked pin.¨
    getbots : List all online bots you spawned.
    kill : Remove a Bot from a Kahoot game.

    `);
    p();
}));

cli.addCommand(new Command('kill', (args, p) => {
    if(!args[0]) {console.log('\u001b[31mNot enough args! (Usage: kill [ID])\u001b[0m'); return p();}
    for(i in activeBots) {
        if(activeBots[i].id == parseInt(args[0], 10)) {
            activeBots[i].session.leave();
            console.log(`${CC.GREEN}Bot killed with id ${activeBots[i].id}. (PIN: ${activeBots[i].pin}, NAME: ${activeBots[i].name})${CC.RESET}`);
        }
    }
    p();
}));

cli.addCommand(new Command('spawn', (args, p) => {
    if(args.length < 2 && !targetPin) return console.log('\u001b[31mNot enough args! (Usage: spawn [name] [?pin])\u001b[0m');
    //if(args.length < 2 && targetPin) return console.log('\u001b[31mNot enough args! (Usage: spawn [name] [?pin])\u001b[0m');
    let pin = targetPin ? targetPin : args[1]
    spawn(pin, args[0]).then(res => {
        activeBots.push({
            name: args[0], 
            pin: pin,
            id: activeBots.length,
            session: res
        });
        console.log(`${CC.GREEN}Bot spawned with name ${args[0]}. (ID: ${activeBots.length-1})${CC.RESET}`);
        p();
    }).catch(err => { console.log(err); p(); });
}));

cli.addCommand(new Command('getbots', (args, p) => {
    console.log('   NAME         PIN            ID\n');
    console.log(activeBots.map(b => `   ${b.name}         ${b.pin}         ${b.id}`).join('\n'));
    p();
}));

const spawn = (pin, name) => { return new Promise((y, n) => {
    let session = new Kahoot();

    session.join(pin, name).catch(err => n('pin invalid'));

    session.on('Finish', e => {
        activeBots.splice(activeBots.filter(bot => bot.name == name)[0].i, 1);
        session.leave();
    });

    session.on('Disconnect', e => {
        activeBots.splice(activeBots.filter(bot => bot.name == name)[0].id, 1);
    });
    
    session.on('Joined', () => {
        y(session);
    });
    session.on("InvalidName", () => {
        n('Username taken.');
    });

    
})};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const genRandomPin = () => {
    let digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    let code = '';
    for(i=0; i<6; i++) code += digits[Math.floor(Math.random()*10)];
    return code;
}

const spawnBot = (code) => {
    const client = new Kahoot();
    client.join(code, "PinLeaker").catch(err=>{
    });
    client.on("Joined", () => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
      console.log(`${code} (\u001b[32;1mVALID\u001b[0m)`);
      client.leave();
    });
  }

const tick = () => {
    if(threads == maxThreads) return;
    let pin = genRandomPin();
    threads++;
    fetch('https://kahoot.it/reserve/session/'+pin).then(res => {
        tested++;threads--;
        if(res.status == 200) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(`${pin} (\u001b[33;1mSEARCHING...\u001b[0m) [${tested}]`);
            spawnBot(pin); 
        }
    });
}