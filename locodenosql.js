const fs = require('fs');
const _ = require('lodash');
const readLine = require('readline');
const EventEmitter = require('events');

/**
 * GetLocations in a library to parse the UNLOCODE ("United Nations Code
 * for Trade and Transport Locations") file(s) available for download as
 * a series of CSV files from https://www.unece.org/cefact/locode/welcome.html
 */
class GetLocations extends EventEmitter {
  /**
   * Not sure why I am forced to put this comment here by ESLINT
   */
  constructor() {
    super();
  }
  /**
 * Method to parse CSV file (fileName) and generate a JSON string for each
 * country and all assocaiated UNLOCODEs within the country
 * @param {string} fileName full name and path to .csv file to be parsed
 */
  importLocations(fileName) {
    let columnNames = [
      'change',
      'country',
      'location',
      'name',
      'nameSansDiacritics',
      'subdivision',
      'function',
      'status',
      'date',
      'iata',
      'coordinates',
      'remarks'
    ];
    let _this = this;
    let countriesFound = 0;
    let locationsFound = 0;
    let myObject = {};
    const readline = readLine.createInterface({
      input: fs.createReadStream(fileName)
    });

    /* Read a line from the input stream/file */
    readline.on('line', function(line) {
      let lineRead = [];
      line = _.replace(line, /"/g, '');
      lineRead = _.fromPairs(_.zip(columnNames, _.split(line, ',')));

      // Check to see if we have found a new country
      if (lineRead.country != myObject._id) {
        if (countriesFound) {
          // emit the now complete UNLOCODE country collection
          _this.emit('recordFound', JSON.stringify(myObject, null, 3));
          locationsFound = 0; //  Reset the location index for the new country
        }

        myObject._id = lineRead.country;
        myObject.country = lineRead.name;
        myObject.locations = _.remove(myObject.locations, true);
        countriesFound += 1;
      } else {
        myObject.locations.push({});
        myObject.locations[locationsFound].location = lineRead.location;
        myObject.locations[locationsFound].name = lineRead.name;
        myObject.locations[locationsFound].details = lineRead;
        locationsFound += 1;
      }
    });
    readline.on('close', function() {
      _this.emit('done', countriesFound + ' countries found');
    });
    return;
  }
}
module.exports = GetLocations;
