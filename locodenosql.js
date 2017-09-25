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



// locodenosql.js
module.exports = function (fileName) {
    var currentCountry = "";
    var countriesFound = 0;    
    const readline = readLine.createInterface({
        input: fs.createReadStream(fileName)
    });

    /* Read a line from the input stream/file */
    readline.on('line', function (line) {
        let lineRead =[];
        // console.log(line);
        // console.log(line.replace(/"/g,""));
        line=_.replace(line,/"/g,"");
        lineRead=_.fromPairs(_.zip(columnNames,_.split(line,',')));
        
        // Check to see if we have found a new country
        if (lineRead.country != currentCountry) {
            If (countriesFound) {

            }
        }
        countriesFound+=1;
        console.log(lineRead.country + ":" + lineRead.location);
        
    });
    readline.on('close', function() {
        console.log('done!');
    })

}