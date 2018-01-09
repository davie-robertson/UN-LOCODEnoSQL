import { isNull } from 'util';

const fs = require('fs');
const _ = require('lodash');
const readLine = require('readline');
const EventEmitter = require('events');

const functionsList = [
  'Function not known', // 0
  'Port',               // 1
  'Rail Terminal',      // 2
  'Road Terminal',      // 3
  'Airport',            // 4
  'Postal Exchange Office',  // 5
  'Multimodal Function',    // 6
  'Fixed Transport Functions', // 7
  'Inland Port', // 8
  'Border Crossing', // 9
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
      'status', // swapped status in function due to error on expoering csv
      'function',
      'date',
      'iata',
      'coordinates',
      'remarks',
    ];
    let _this = this;
    let countriesFound = 0;
    let locationsFound = 0;
    let currentCountry = {};
    const readline = readLine.createInterface({
      input: fs.createReadStream(fileName, {encoding: 'utf8'}),
    });

    /* Read a line from the input stream/file */
    readline.on('line', function(line) {
      let lineRead = [];
      // remove double quotes for all values in the CSV file
      line = _.replace(line, /"/g, '');
      // transpose all the values in the file input line with the array of columns 
      lineRead = _.fromPairs(_.zip(columnNames, _.split(line, '\t')));


      // Check to see if we have found a new country (the default sort order for the CSV file is Country, Name)
      if (lineRead.country != currentCountry._id) {
        // Check to see if this is a new country and not just
        // the first country found, if that is the case then 
        // send back a complete Object/Array of the country
        if (countriesFound) {
          // emit the now complete UNLOCODE country collection
          _this.emit('recordFound', currentCountry);
          if (currentCountry._id == 'AE') console.log(JSON.stringify(currentCountry, true, 3));
          locationsFound = 0; //  Reset the location index for the new country
        }

        // currentCountry={};
        currentCountry._id = lineRead.country;
        currentCountry.country = lineRead.name.substring(1);
        currentCountry.locations = _.remove(currentCountry.locations, true);
        countriesFound += 1;
      } else {
        // the current input line is not a new country, so we will add
        // a new location to the current country object
        currentCountry.locations.push({});
        currentCountry.locations[locationsFound].location = lineRead.location;
        currentCountry.locations[locationsFound].name = lineRead.name;
        currentCountry.locations[locationsFound].nameSansDiacritics =
          lineRead.nameSansDiacritics;
        // do we want to denormalise the output?
        if (decode) {
          lineRead = deNormalise(lineRead);
        }

        currentCountry.locations[locationsFound].details = _.omit(lineRead, [
          'country',
          'location',
          'name',
          'nameSansDiacritics',
          'change',
          'status',
          'date',
          'remarks',
        ]);

        locationsFound += 1;
      }
    });

    readline.on('close', function() {
      _this.emit('recordFound', currentCountry);
      _this.emit('done', countriesFound + ' countries found');
    });
    return;
  }
}
/**
 * function deNormalise 
 * @param {string} LineRead is an array of named pairs matching the UNLOCODE
 * 'change','country'..coordinate, remarks fields
 * @return {string} that has been denormalised 
 */
function deNormalise(LineRead) {
  // denormalise the location function into descriptive text
  // remove the '-' chars and swap the B (border crossing) designator to an 8
  let locationFunction = _.replace(LineRead.function, /\W/g, '');
  locationFunction = _.replace(locationFunction, /b/g, '9');
  console.log(LineRead)
  
  let normLocationFunction = [];
   // TODO need to change function to OBJECT value pairs and not array
   for (let value of locationFunction) {
    normLocationFunction.push(functionsList[_.toInteger(value)] + ': true');
  }
  LineRead.function = normLocationFunction;



  // now the lat/long coordinate 
  // ddmmN dddmmW, ddmmS dddmmE
  if (LineRead.coordinates != '') {
    let coordinates = {
      lat: 0,
      lon: 0,
    };
    coordinates.lat = _.toNumber(
      LineRead.coordinates.substring(0, 2) +
      '.' +
      LineRead.coordinates.substring(2, 4)
    );

    coordinates.lon = _.toNumber(
      LineRead.coordinates.substring(6, 9) +
      '.' +
      LineRead.coordinates.substring(9, 11)
    );

    if (LineRead.coordinates.includes('S')) {
      coordinates.lat = coordinates.lat * -1;
    }
    if (LineRead.coordinates.includes('W')) {
      coordinates.lon = coordinates.lon * -1;
    }
    LineRead.coordinates = coordinates;
  } else {
    LineRead.coordinates = null;
  }
  // console.log(LineRead.coordinates);
  return LineRead;
}
module.exports = GetLocations;
