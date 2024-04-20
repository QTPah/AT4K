const Kahoot = require("kahoot.js-latest");
const logger = require("./utils/logger")({
    applicationName: "AT4K",
    format: "{TIME_HMS} {DIVISION} {LOG}",
    logsPath: "../logs",
    maxLogFiles: 10
});
const cli = require('cli');

function spawnBot(pin, name) {
    return new Promise((y, n) => {
        const client = new Kahoot();

        logger.log(`Spawning bot for pin ${pin}`, "BOT");

        client.join(pin, name);

        client.on('Joined', () => {
            logger.log(`Joined pin ${pin} as ${name}`, "BOT");
            y(client);
        });
    });
}

cli.parse({
    pin: ['p', 'Pin to join', 'bool'],
    name: ['n', 'Name to join as', 'string']
});

console.log(cli.options);