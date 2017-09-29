const code = require('./locodenosql');
const events = require('events');
const eventEmitter = new events.EventEmitter();
let results='';
results=code.getLocations('./UNLOCODE.csv');
results.on('recordFound', (location) => {
    console.log(location);
}
);
