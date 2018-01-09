const UNLOCODE = require('./locodenosql');
const GetLocations = new UNLOCODE();

const admin = require('firebase-admin');
const serviceAccount = require('./august-win-firebase-adminsdk-xdcnx-0fadd679d4.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://august-win.firebaseio.com',
});
const db = admin.firestore();

GetLocations.on('recordFound', (data) => {
  /**
 * A complete country and associated locations have been returned in 
 * a JSON string (data), which can now be added to a NONSQL document 
 */
//  let jData = data;
//  let docRef = db.collection('loc').doc(jData._id);
//  docRef.set(jData).then(console.info(jData._id + ' uploaded with ' + jData.locations.length + ' locations found'));
});

GetLocations.on('done', (message) => {
  /*
All locationes have now been imported
*/
  console.log(`done: "${message}"`);
});

GetLocations.importLocations('./UN_LOCODE_Subs.txt', true);