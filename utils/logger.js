const fs = require('fs');
const path = require('path');


const VERSION = "1.0.0";
const LOG_FORMAT_ELEMENTS = ['TIME_HMS', 'LOG', 'DIVISION', 'DATE_MDY', 'DATE_DMY'];
class Logger {
    constructor(options) {
        this.options = options;
        this.options.logsPath = path.join(__dirname, this.options.logsPath);
        this.setUpLogs();
    }
    setUpLogs() {
        if (!fs.existsSync(this.options.logsPath))
            fs.mkdirSync(this.options.logsPath);
        if (fs.existsSync(path.join(this.options.logsPath, 'log.log'))) {
            const DATE = new Date();
            fs.renameSync(path.join(this.options.logsPath, 'log.log'), path.join(this.options.logsPath, `${Date.now()}.${DATE.getHours()}-${DATE.getMinutes()}-${DATE.getSeconds()}.${DATE.toISOString().slice(0, 10)}.log`));
            if (fs.readdirSync(this.options.logsPath).length > this.options.maxLogFiles) {
                let files = fs.readdirSync(this.options.logsPath);
                files = files.sort((a, b) => parseInt(b.split('.')[0]) - parseInt(a.split('.')[0]));
                for (let i = this.options.maxLogFiles; i < files.length; i++) {
                    fs.unlinkSync(path.join(this.options.logsPath, files[i]));
                }
            }
        }
        ;
        fs.writeFileSync(path.join(this.options.logsPath, 'log.log'), `Logger v${VERSION} ${this.options.applicationName} ${new Date().toISOString()}\n\n`);
    }
    log(text, division) {
        let log = this.options.format.toString();
        LOG_FORMAT_ELEMENTS.forEach((formatElement) => {
            log = log.replace(`{${formatElement}}`, (() => {
                const DATE = new Date();
                switch (formatElement) {
                    case 'TIME_HMS':
                        return `[${DATE.getHours()}:${DATE.getMinutes()}:${DATE.getSeconds()}]`;
                    case 'LOG':
                        return text;
                    case 'DIVISION':
                        return `[${division}]`;
                    case 'DATE_DMY':
                        return `[${DATE.getDay()}.${DATE.getMonth()}.${DATE.getFullYear()}]`;
                    case 'DATE_MDY':
                        return `[${DATE.getMonth()}.${DATE.getDay()}.${DATE.getFullYear()}]`;
                    default:
                        process.stderr.write(`Logger Log Format Element '${formatElement}' not handled. \n`);
                        return '';
                }
            })());
        });
        log += '\n';
        process.stdout.write(log);
        fs.appendFile(path.join(this.options.logsPath, 'log.log'), log, err => {
            if (err) {
                this.setUpLogs();
            }
        });
    }
}
module.exports = function createLogger(options) {
    return new Logger(options);
}