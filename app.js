// Starter code provided by Dr. Curry and Prof. Safonte at Oregon State University
// https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Starter code provided by Dr. Curry and Prof. Safonte at Oregon State University
// at https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Database
var db = require('./database/db-connector')
/*
    SETUP
*/

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars

var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 39746;                 // Set a port number at the top so it's easy to change in the future
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

// Declare handlerbars helpers 
var hbs = exphbs.create({});
hbs.handlebars.registerHelper('formatDate', function(date) {
    return date.toLocaleString();
  })

/*
    ROUTES -- GET
*/
app.get('/', function(req, res)
    {  
        let query1 = "SELECT * FROM People;";
        db.pool.query(query1, function(error, rows, fields){
        res.render('index', {data: rows});
        })
    });

/* Citation for the code for the reset route:
   Date: 2/28/24
   Based on mysql-import documentation:
   Source URL: https://github.com/Pamblam/mysql-import/
*/ 
app.get('/reset', function(req, res) 
    {
        db.sqlImporter.import('database/DDL.sql').then(()=>{
            var files_imported = db.sqlImporter.getImported();
            console.log(`${files_imported.length} SQL file(s) imported.`);
        }).catch(err=>{
            console.error(err);
        });
        res.render('index');
    });

app.get('/people', function(req, res)
    {  

    // If there is no query string, we just perform a basic SELECT
    let query1 = "";

    if (req.query.qname === undefined)
    {
        query1 = `
        SELECT personId, personName, personEmail, personPhoneNumber, CONCAT(householdAddress, ', ', householdCity, ' ', householdState, ', ', householdZipCode) AS fullAddress, personKarma 
        FROM People
        LEFT JOIN Households ON personHouseholdID = householdID
        ORDER BY personID;
        `;
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM People WHERE personName LIKE "${req.query.qname}%"`
    }

    // Query 2 is the same in both cases
    let query2 = "SELECT householdId, CONCAT(householdAddress, ', ', householdCity, ' ', householdState, ', ', householdZipCode) AS fullAddress FROM Households;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        let people = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            let households = rows;

            return res.render('people', {data: people, households: households});
        })
    })
});

app.get('/households', function(req, res)
{  
    let query1 = `
    SELECT householdId, householdAddress, householdCity, householdState, householdZipcode, neighborhoodName 
    FROM Households
    INNER JOIN Neighborhoods ON neighborhoodID = householdNeighborhoodId
    ORDER BY householdId;
    `;

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM Neighborhoods;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        let households = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            let neighborhoods = rows;
            return res.render('households', {data: households, neighborhoods: neighborhoods});
        })
    })
});

app.get('/neighborhoods', function(req, res)
{  
    let query1 = "SELECT * FROM Neighborhoods;";
    db.pool.query(query1, function(error, rows, fields){
    res.render('neighborhoods', {data: rows});
    })
});

app.get('/offers', function(req, res)
{  
    let query1 = `
    SELECT offerId, personEmail as giverEmail, offerItem, offerDescription, offerQuantity, offerCost, offerTime, offerType
    FROM Offers
    INNER JOIN People ON offerGiverId = personId
    INNER JOIN OfferTypes ON Offers.offerTypeId = OfferTypes.offerTypeId
    ORDER BY offerId;
    `;

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM OfferTypes;";

    let query3 = "SELECT * FROM People;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        let offers = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            let offerTypes = rows;

            db.pool.query(query3, (error, rows, fields) => {
                let people = rows;
                
                return res.render('offers', {data: offers, offerTypes: offerTypes, people, people});
        })
    })
})
});

app.get('/offerTypes', function(req, res)
{  
    let query1 = "SELECT * FROM OfferTypes;";
    db.pool.query(query1, function(error, rows, fields){
    res.render('offerTypes', {data: rows});
    })
});

app.get('/transactions', function(req, res)
{  
    let query1 = `
    SELECT transactionId, offerItem as item, g.personName as giver, r.personName as receiver, transactionTime 
    FROM Transactions
    INNER JOIN Offers ON transactionOfferId = offerId
    INNER JOIN People AS g ON g.personId = offerGiverId
    INNER JOIN People AS r ON r.personId = transactionReceiverId
    ORDER BY transactionId;
    `;

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM Offers;";

    let query3 = "SELECT * FROM People;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        let transactions = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            let offers = rows;

            db.pool.query(query3, (error, rows, fields) => {
                let people = rows;
                
                return res.render('transactions', {data: transactions, offers: offers, people, people});
        })
    })
})
});

    /*
    ROUTES -- POST
*/

app.post('/add-person-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    // Capture NULL values
    let householdId = data.householdId;
    if (isNaN(householdId))
    {
        householdId = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO People (personName, personEmail, personPhoneNumber, personHouseholdId, personKarma) VALUES ('${data.name}', '${data.email}', '${data.phoneNumber}', ${data.householdId}, ${data.karma})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.status(400).send(error);
        }
        else
        {
            // If there was no error, retrieve the new table state
            query2 = 
            `
            SELECT personId, personName, personEmail, personPhoneNumber, CONCAT(householdAddress, ', ', householdCity, ' ', householdState, ', ', householdZipCode) AS fullAddress, personKarma 
            FROM People
            LEFT JOIN Households ON personHouseholdID = householdID
            ORDER BY personID;
            `;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.status(400).send(error);
                }
                // If all went well, send the results of the query back.
                else
                {
                    // app.get('/people');
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/update-person-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let householdId = data.householdId;
    if (isNaN(householdId))
    {
        householdId = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `
    UPDATE People 
    SET 
        personName = '${data.name}', 
        personEmail = '${data.email}', 
        personPhoneNumber = '${data.phoneNumber}', 
        personHouseholdId = ${data.householdId}, 
        personKarma = ${data.karma} 
    WHERE 
        personId = ${data.id};`;
    
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.status(400).send(error);;
        }
        else
        {
            // If there was no error, retrieve the new table state
            query2 = 
            `
            SELECT personId, personName, personEmail, personPhoneNumber, CONCAT(householdAddress, ', ', householdCity, ' ', householdState, ', ', householdZipCode) AS fullAddress, personKarma 
            FROM People
            LEFT JOIN Households ON personHouseholdID = householdID
            WHERE personID = ${data.id};
            `;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.status(400).send(error);;
                }
                // If all went well, send the results of the query back.
                else
                {
                    // app.get('/people');
                    res.send(rows);
                }
            })
        }
    })
});


app.post('/add-household-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let householdId = data.householdId;
    if (isNaN(householdId))
    {
        householdId = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Households (householdAddress, householdCity, householdState, householdZipcode, householdNeighborhoodId) VALUES ('${data.address}', '${data.city}', '${data.state}', '${data.zipCode}', '${data.neighborhoodId}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.status(400).send(error);;
        }
        else
        {
            // If there was no error, retrieve the new table state
            query2 = `
            SELECT householdId, householdAddress, householdCity, householdState, householdZipcode, neighborhoodName 
            FROM Households
            INNER JOIN Neighborhoods ON neighborhoodID = householdNeighborhoodId
            ORDER BY householdId;
            `;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.status(400).send(error);;
                }
                // If all went well, send the results of the query back.
                else
                {
                    // app.get('/people');
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-neighborhood-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Neighborhoods (neighborhoodName) VALUES ('${data.name}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.status(400).send(error);;
        }
        else
        {
            // If there was no error, retrieve the new table state
            query2 = `SELECT * FROM Neighborhoods;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.status(400).send(error);;
                }
                // If all went well, send the results of the query back.
                else
                {
                    // app.get('/people');
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-offer-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Offers (offerGiverId, offerItem, offerDescription, offerQuantity, offerCost, offerTypeId) VALUES ('${data.giverId}', '${data.item}', '${data.description}', '${data.quantity}', '${data.cost}', '${data.typeId}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.status(400).send(error);;
        }
        else
        {
            // If there was no error, retrieve the new table state
            query2 = `
            SELECT offerId, personEmail as giverEmail, offerItem, offerDescription, offerQuantity, offerCost, offerTime, offerType
            FROM Offers
            INNER JOIN People ON offerGiverId = personId
            INNER JOIN OfferTypes ON Offers.offerTypeId = OfferTypes.offerTypeId
            ORDER BY offerId;
            `;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.status(400).send(error);;
                }
                // If all went well, send the results of the query back.
                else
                {
                    // app.get('/people');
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-offer-type-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO OfferTypes (offerType) VALUES ('${data.offerType}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.status(400).send(error);;
        }
        {
            // If there was no error, retrieve the new table state
            query2 = `SELECT * FROM OfferTypes;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.status(400).send(error);;
                }
                // If all went well, send the results of the query back.
                else
                {
                    // app.get('/people');
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-transaction-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let offerId = data.offerId;
    let recieverId = data.recieverId;

    // Create the query and run it on the database
    query1 = `INSERT INTO Transactions (transactionOfferID, transactionReceiverID) VALUES ('${data.offerId}', '${data.recieverId}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.status(400).send(error);;
        }
        {
            // If there was no error, retrieve the new table state
            query2 = `
            SELECT transactionId, offerItem as item, g.personName as giver, r.personName as receiver, transactionTime 
            FROM Transactions
            INNER JOIN Offers ON transactionOfferId = offerId
            INNER JOIN People AS g ON g.personId = offerGiverId
            INNER JOIN People AS r ON r.personId = transactionReceiverId
            ORDER BY transactionId;
            `;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.status(400).send(error);;
                }
                // If all went well, send the results of the query back.
                else
                {
                    // app.get('/people');
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-offer-ajax/', function(req,res,next){
    let data = req.body;
    let offerId = parseInt(data.id);
    let deleteOffer = `DELETE FROM Offers WHERE offerId = ?`;
    // Run the 1st query
    db.pool.query(deleteOffer, [offerId], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.status(400).send(error);;
        }

        else
        {
        res.sendStatus(204);
        }
  })
});

/*
    LISTENER
*/
app.listen(PORT, function(){           
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});