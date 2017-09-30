const UNLOCODE = require('./locodenosql');
const GetLocations = new UNLOCODE();

GetLocations.on('recordFound', (data) => {
  /**
 * A complete country and associated locations have been returned in 
 * a JSON string (data). These can now be added to a NONSQL document 
 */

  console.log(`Received data: "${data}"`);
});
GetLocations.on('done', (data) => {
  /*
All locationes have now been imported
*/
  console.log(`done: "${data}"`);
});

GetLocations.importLocations('./UNLOCODE.csv');
