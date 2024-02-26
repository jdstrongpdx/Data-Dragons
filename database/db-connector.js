// ./database/db-connector.js

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

creds = {
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_stronjoe',
    password        : '1599',
    database        : 'cs340_stronjoe'
}

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : creds.host,
    user            : creds.user,
    password        : creds.password,
    database        : creds.database
})

// Create an mysql importer object for importing .SQL files
const Importer = require('mysql-import');
const sqlImporter = new Importer(creds);


// Export for use in our applicaiton
module.exports.sqlImporter = sqlImporter;
module.exports.pool = pool;