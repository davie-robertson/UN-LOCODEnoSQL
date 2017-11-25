const fs = require('fs');
const _ = require('lodash');
const readLine = require('readline');
const EventEmitter = require('events');

const functionsList = [
  'Function not known',
  'Port',
  'Rail Terminal',
  'Road Terminal',
  'Airport',
  'Postal Exchange Office',
  'Multimodal Function',
  'Fixed Transport Functions (e.g. Oil platform)',
  'Inland Port',
  'Border Crossing',
];

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
 * @param {boolean} decode the amount of normaisation/decoding on fields,
 *  i.e. fucnitons & coordinates
 */
  importLocations(fileName, decode = false) {
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
      'remarks',
    ];
    let _this = this;
    let countriesFound = 0;
    let locationsFound = 0;
    let myObject = {};
    const readline = readLine.createInterface({
      input: fs.createReadStream(fileName, {encoding: 'UTF8'} ),
    });

    /* Read a line from the input stream/file */
    readline.on('line', function(line) {
      if ((_.trim(line).length)>12) {
        let lineRead = [];
        line = _.replace(line, /"/g, '');
        lineRead = _.fromPairs(_.zip(columnNames, _.split(line, ',')));
        // Check to see if we have found a new country
        if (lineRead.country != myObject._id) {
          if (countriesFound) {
            // emit the now complete UNLOCODE country collection
            _this.emit('recordFound', myObject);
            if (myObject._id=='AE') console.log(JSON.stringify(myObject, true, 3));
            locationsFound = 0; //  Reset the location index for the new country
          }

          // myObject={};
          myObject._id = lineRead.country;
          myObject.country = lineRead.name.substring(1);
          myObject.locations = _.remove(myObject.locations, true);
          countriesFound += 1;
        } else {
          myObject.locations.push({});
          myObject.locations[locationsFound].location = lineRead.location;
          myObject.locations[locationsFound].name = lineRead.name;
          myObject.locations[locationsFound].nameSansDiacritics =
            lineRead.nameSansDiacritics;

          myObject.locations[locationsFound].details = _.omit(lineRead, [
            'country',
            'location',
            'name',
            'nameSansDiacritics',
          ]);
          locationsFound += 1;

          // do we want to denormalise the output?
          if (decode) {
            lineRead = deNormalise(lineRead);
          }
        }
      }
    });
    readline.on('close', function() {
      _this.emit('recordFound', myObject);
      _this.emit('done', countriesFound + ' countries found');
    });
    return;
  }
}
/**
 * function deNormalise 
 * @param {string} LineRead is an array of named pairs matcing the UNLOCODE
 * 'change','country'..coordinate, remarks fields
 * @return {string} that has been denormalised 
 */
function deNormalise(LineRead) {
  // denormalise the location function into descriptive text
  // remove the '-' chars and swap the B (border crossing) designator to an 8
  let locationFunction = _.replace(LineRead.function, /\W/g, '');
  locationFunction = _.replace(locationFunction, /b/g, '9');
  let normLocationFunction = [];
  for (let value of locationFunction) {
    normLocationFunction.push(functionsList[_.toInteger(value) + 1]+ ': true');
  }
  LineRead.function = normLocationFunction;
  // now the lat/long coordinate -------------------------------------
  // ddmmN dddmmW, ddmmS dddmmE
  if (LineRead.coordinates != '') {
    let coordinates = {
      latitude: 0,
      longitude: 0,
    };
    coordinates.latitude = _.toNumber(
      LineRead.coordinates.substring(0, 2) +
      '.' +
      LineRead.coordinates.substring(2, 4)
    );

    coordinates.longitude = _.toNumber(
      LineRead.coordinates.substring(6, 9) +
      '.' +
      LineRead.coordinates.substring(9, 11)
    );

    if (LineRead.coordinates.includes('S')) {
      coordinates.latitude = coordinates.latitude * -1;
    }
    if (LineRead.coordinates.includes('W')) {
      coordinates.longitude = coordinates.longitude * -1;
    }
    LineRead.coordinates = coordinates;
  } else {
    LineRead.coordinates = null;
  }
  // console.log(LineRead.coordinates);
  return LineRead;
}
module.exports = GetLocations;
