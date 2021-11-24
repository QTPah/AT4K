let tt = require('tiny-timer');

let t = new tt();

t.start(10000);

setTimeout(() => console.log(t.time), 10000);