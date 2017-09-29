var fs = require('fs');
var _ = require('lodash');
var readLine = require('readline');

var columnNames = [
    "change",
    "country",
    "location",
    "name",
    "nameSansDiacritics",
    "subdivision",
    "function",
    "status",
    "date",
    "iata",
    "coordinates",
    "remarks"
];

function getLocations(fileName) {
    var currentCountry = "";
    var countriesFound = 0;
    var locationsFound = 0;
    var test = [];
    var myObject = {};
    const readline = readLine.createInterface({
        input: fs.createReadStream(fileName)
    });

    /* Read a line from the input stream/file */
    readline.on('line', function (line) {
        let lineRead = [];
        line = _.replace(line, /"/g, "");
        lineRead = _.fromPairs(_.zip(columnNames, _.split(line, ',')));

        // Check to see if we have found a new country
        if (lineRead.country != myObject._id) {
            if (countriesFound) {
                // Do something with the now complete UNLOCODE country collection
                //   console.log(JSON.stringify(myObject,null,3));
                console.log(myObject.country + " had " + myObject.locations.length + " locations");
                locationsFound = 0;
            }

            myObject._id = lineRead.country;
            myObject.country = lineRead.name;
            myObject.locations = _.remove(myObject.locations, true);

            countriesFound += 1;

        }
        else {
            myObject.locations.push({});
            myObject.locations[locationsFound].location = lineRead.location;
            myObject.locations[locationsFound].name = lineRead.name;
            myObject.locations[locationsFound].details = lineRead;
            locationsFound += 1;
        }

    });
    readline.on('close', function () {
        console.log('done!');
        console.log(countriesFound + " countries found");
    });
    return;
}
module.exports = {
getLocations : getLocations
}