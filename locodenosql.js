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
]
var myObject = {};
<<<<<<< HEAD
// myObject["_id"] = "AE"
// myObject.change = "";
// myObject.country = "United Arab Emirates";
// myObject.locations = [];
// myObject.locations.push({});
// myObject.locations[0]["location"] = "DXB";
// myObject.locations[0]["name"] = "Dubai";
// myObject.locations[0].details = [];
// myObject.locations[0].details.push({});
// myObject.locations[0].details[0].change = "";
// myObject.locations[0].details[0].country = "AE";
// myObject.locations[0].details[0]["location"] = "DXB";
// myObject.locations[0].details[0]["name"] = "Dubai";
// myObject.locations[0].details[0].nameSansDiacritics = "Dubia";
// myObject.locations[0].details[0].subdivision = "AD";
// myObject.locations[0].details[0].function = "1--45-7-";
// myObject.locations[0].details[0]["status"] = "";
// myObject.locations[0].details[0].date = "1709";
// myObject.locations[0].details[0].iata = "DXB";
// myObject.locations[0].details[0].coordinates = "5400N 2400E";
// myObject.locations[0].details[0].remarks = "Here's looking at you kid";

=======
myObject["_id"]="AE"
myObject.change = "";
myObject.country = "United Arab Emirates";
myObject.locations = [];
myObject.locations.push({});
myObject.locations[0]["location"] = "DXB";
myObject.locations[0].details = [];
myObject.locations[0].details.push({});
myObject.locations[0].details[0].change = "";
myObject.locations[0].details[0].country = "AE";
myObject.locations[0].details[0]["location"] = "DXB";
myObject.locations[0].details[0]["name"] = "Dubai";
myObject.locations[0].details[0].nameSansDiacritics = "Dubia";
myObject.locations[0].details[0].subdivision = "AD";
myObject.locations[0].details[0].function = "1--45-7-";
myObject.locations[0].details[0]["status"] = "";
myObject.locations[0].details[0].date = "1709";
myObject.locations[0].details[0].iata = "DXB";
myObject.locations[0].details[0].coordinates = "5400N 2400E";
myObject.locations[0].details[0].remarks = "Here's looking at you kid";
console.log(myObject);
console.log(JSON.stringify(myObject,null,3));

var countryNode = [
    ["_id", ""],
    ["name", ""],
    ["locations", [
        ["location", ""]
        ["details", [
            ["change", ""],
            ["country", ""],
            ["location", ""],
            ["name", ""],
            ["nameSansDiacritics", ""],
            ["subdivision", ""],
            ["function", ""],
            ["status", ""],
            ["date", ""],
            ["iata", ""],
            ["coordinates", ""],
            ["remarks", ""]
        ]
        ]
    ]
    ]
]
// locodenosql.js
>>>>>>> 9e33f31baac7cc1b8d580f9bf1c394498e2d51b5
module.exports = function (fileName) {
    var currentCountry = "";
    var countriesFound = 0;
    var locationsFound = 0;
    var test = [];

    const readline = readLine.createInterface({
        input: fs.createReadStream(fileName)
    });

    /* Read a line from the input stream/file */
    readline.on('line', function (line) {
        let lineRead = [];
        line = _.replace(line, /"/g, "");
        lineRead = _.fromPairs(_.zip(columnNames, _.split(line, ',')));

        // Check to see if we have found a new country
        if (lineRead.country != myObject["_id"]) {
            if (countriesFound) {
                // Do something with the now complete UNLOCODE country collection
             //   console.log(JSON.stringify(myObject,null,3));
                console.log(myObject.country + " had " + myObject.locations.length + " locations");               
                locationsFound = 0;
            }

            myObject["_id"] = lineRead.country;
            myObject["country"] = lineRead.name;
            myObject.locations = _.remove(myObject.locations, true);

            countriesFound += 1;

        }
        else {
            myObject.locations.push({});
            myObject.locations[locationsFound]['location'] = lineRead.location
            myObject.locations[locationsFound]['name'] = lineRead.name
            myObject.locations[locationsFound]['details'] = lineRead
            locationsFound += 1;
        }

    });
    readline.on('close', function () {
        console.log('done!');
        console.log(countriesFound + " countries found");
    })
return;
}
