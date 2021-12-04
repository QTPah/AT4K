const rel = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

class CLI {
    constructor(prompt, input, output) {

        let commands = [];

        this.prompt = prompt || ">>> ";

        const p = () => {
            rel.question(this.prompt, msg => {
                onInput(msg.replace(/\r?\n|\r/g, " ").replace(/\0/g, ''));
            });
        }

        this.addCommand = (command) => {
            commands.push(command);
        }

        this.onCommandNotFound = () => {

        }

        const onInput = (message) => {
            let commandName = message.split(' ')[0].toLowerCase();

            let found = false;
            for(let i in commands) {
                if(commands[i].name == commandName) {
                    found = true;
                    commands[i].exec(message.split(' ').slice(1, message.split(' ').length), p);
                }
            }
            if(!found) {
                p()
            };
        }
        p();
    }
}

class Command {
    constructor(name, onCommand) {
        this.exec = onCommand;
        this.name = name;
    }
}

const CC = {
    BLACK: "\u001b[30m",
    RED: "\u001b[31m",
    GREEN: "\u001b[32m",
    YELLOW: "\u001b[33m",
    BLUE: "\u001b[34m",
    MAGENTA: "\u001b[35m",
    CYAN: "\u001b[36m",
    WHITE: "\u001b[37m",
    RESET: "\u001b[0m",
    B_BLACK: "\u001b[30;1m",
    B_RED: "\u001b[31;1m",
    B_GREEN: "\u001b[32;1m",
    B_YELLOW: "\u001b[33;1m",
    B_BLUE: "\u001b[34;1m",
    B_MAGENTA: "\u001b[35;1m",
    B_CYAN: "\u001b[36;1m",
    B_WHITE: "\u001b[37;1m",
    BG_BLACK: "\u001b[40m",
    BG_RED: "\u001b[41m",
    BG_GREEN: "\u001b[42m",
    BG_YELLOW: "\u001b[43m",
    BG_BLUE: "\u001b[44m",
    BG_MAGENTA: "\u001b[45m",
    BG_CYAN: "\u001b[46m",
    BG_WHITE: "\u001b[47m",
    BGB_BLACK: "\u001b[40;1m",
    BGB_RED: "\u001b[41;1m",
    BGB_GREEN: "\u001b[42;1m",
    BGB_YELLOW: "\u001b[43;1m",
    BGB_BLUE: "\u001b[44;1m",
    BGB_MAGENTA: "\u001b[45;1m",
    BGB_CYAN: "\u001b[46;1m",
    BGB_WHITE: "\u001b[47;1m"
}

module.exports = {
    CLI, Command, CC
}