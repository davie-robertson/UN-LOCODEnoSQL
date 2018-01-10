const UNLOCODE = require('./locodenosql');
const GetLocations = new UNLOCODE();

const mysql = require('mysql');
const con = mysql.createPool({
  host: "localhost",
  user: "developer",
  password: "developer",
  multipleStatements: "true"
});

con.query("CREATE DATABASE unlocode", function (err, result) {
  // if (err) throw err;
  console.log("Database created");
});

var sql = "DROP TABLE IF EXISTS unlocode.countries, unlocode.locations, unlocode.Subdivisions";
con.query(sql, function (err, result) {
  if (err) throw err;
  console.log("Tables dropped");
});

var sql = "CREATE TABLE `unlocode`.`countries` ( `idcountries` CHAR(2) NOT NULL, `country` VARCHAR(77) NOT NULL, PRIMARY KEY (`idcountries`), UNIQUE INDEX `idcountries_UNIQUE` (`idcountries` ASC))";
// ENGINE = InnoDB
// DEFAULT CHARACTER SET = utf8;
con.query(sql, function (err, result) {
  if (err) throw err;
  console.log("Countries Table Created");
});
var sql = "CREATE TABLE `unlocode`.`subdivisions` ( `Country` char(2) NOT NULL, `Subdivision` char(3) NOT NULL, `Name` varchar(100) NOT NULL, `DivisionName` varchar(100) DEFAULT NULL, PRIMARY KEY (`Country`,`Subdivision`)) ENGINE=InnoDB DEFAULT CHARSET=utf8";
con.query(sql, function (err, result) {
  if (err) throw err;
  console.log("Subdivision Table Created");
});
// const admin = require('firebase-admin');
// const serviceAccount = require('./august-win-firebase-adminsdk-xdcnx-0fadd679d4.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://august-win.firebaseio.com',
// });
// const db = admin.firestore();

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