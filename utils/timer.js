class Timer {
    hr = 0; min = 0; sec = 0; ms = 0;
    constructor() {
        let stoptime = true;
        let t;

        this.startTimer = () => {
            if(!stoptime) return;
            stoptime = false;
            t = setInterval(() => {
                this.ms += 1;
                if(this.ms == 1000) this.ms = 0, this.sec += 1;
                if(this.sec == 60) this.sec = 0, this.min += 1;
                if(this.min == 60) this.min = 0, this.hr += 1;
            }, 1);
        }

        this.stopTimer = () => { stoptime = true; clearInterval(t) };
        this.reset = () => { this.stopTimer(), this.ms = 0, this.sec = 0, this.min = 0, this.hr = 0 };
    }
}

module.exports = Timer;