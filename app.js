/* Citation for the following function:
   Date: 2/14/24
   Adapted from starter code provided by Dr. Curry and Prof. Safonte at Oregon State University
   Starter code used as a template with variables changed to meet our use case.  Some functions/routes were added/removed for functionality.
   Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/ 

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
    QUERIES
*/

// Queries for joining tables and replacing FK references with meaningful values
show_people_table = `
SELECT personId, personName, personEmail, personPhoneNumber, CONCAT(householdAddress, ', ', householdCity, ' ', householdState, ', ', householdZipCode) AS fullAddress, personKarma 
FROM People
LEFT JOIN Households ON personHouseholdID = householdID
ORDER BY personID;
`;


show_household_table = `
SELECT householdId, householdAddress, householdCity, householdState, householdZipcode, neighborhoodName 
FROM Households
INNER JOIN Neighborhoods ON neighborhoodID = householdNeighborhoodId
ORDER BY householdId;
`;

show_offers_table = `
SELECT offerId, personEmail as giverEmail, offerItem, offerDescription, offerQuantity, offerCost, offerTime, offerType
FROM Offers
INNER JOIN People ON offerGiverId = personId
INNER JOIN OfferTypes ON Offers.offerTypeId = OfferTypes.offerTypeId
ORDER BY offerId;
`;

show_transactions_table = `
SELECT transactionId, offerItem as item, g.personEmail as giver, r.personEmail as receiver, transactionTime 
FROM Transactions
INNER JOIN Offers ON transactionOfferId = offerId
INNER JOIN People AS g ON g.personId = offerGiverId
INNER JOIN People AS r ON r.personId = transactionReceiverId
ORDER BY transactionId;
`;

// Queries for populating dropdowns or displays with no FK references
get_people = "SELECT * FROM People;";

get_households = "SELECT householdId, CONCAT(householdAddress, ', ', householdCity, ' ', householdState, ', ', householdZipCode) AS fullAddress FROM Households;";

get_neighborhoods = "SELECT * FROM Neighborhoods;";

get_offer_types = "SELECT * FROM OfferTypes;";

get_offers = "SELECT * FROM Offers;";


/*
    ROUTES -- GET
*/

app.get('/', function(req, res)
    {  
        res.render('index');
    }
);

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

    // If theres no query string, show the full table; otherwise this is a search
    if (req.query.qname === undefined)
    {
        people_query = show_people_table
    }
    else
    {
        people_query = `SELECT * FROM People WHERE personName LIKE "${req.query.qname}%"`
    }

    // Run the main query
    db.pool.query(people_query, function(error, rows, fields){
        let people = rows;
        
        // Run the second query for a dropdown
        db.pool.query(get_households, (error, rows, fields) => {
            let households = rows;

            return res.render('people', {data: people, households: households});
        })
    })
});

app.get('/households', function(req, res)
{  
    // Run the main query
    db.pool.query(show_household_table, function(error, rows, fields){
        
        let households = rows;
        
        // Run the second query for a dropdown
        db.pool.query(get_neighborhoods, (error, rows, fields) => {
            
            let neighborhoods = rows;
            return res.render('households', {data: households, neighborhoods: neighborhoods});
        })
    })
});

app.get('/neighborhoods', function(req, res)
{  
    db.pool.query(get_neighborhoods, function(error, rows, fields){
    res.render('neighborhoods', {data: rows});
    })
});

app.get('/offers', function(req, res)
{  
    // Run the main query
    db.pool.query(show_offers_table, function(error, rows, fields){
        let offers = rows;
        
        // Run the second query for a dropdown
        db.pool.query(get_offer_types, (error, rows, fields) => {
            let offerTypes = rows;

            // Run the third query for a dropdown
            db.pool.query(get_people, (error, rows, fields) => {
                let people = rows;
                
                return res.render('offers', {data: offers, offerTypes: offerTypes, people, people});
        })
    })
})
});

app.get('/offerTypes', function(req, res)
{  
    db.pool.query(get_offer_types, function(error, rows, fields){
    res.render('offerTypes', {data: rows});
    })
});

app.get('/transactions', function(req, res)
{  
    // Run the main query
    db.pool.query(show_transactions_table, function(error, rows, fields){
        let transactions = rows;
        
        // Run the second query for a dropdown
        db.pool.query(get_offers, (error, rows, fields) => {
            let offers = rows;

            // Run the second query for a dropdown
            db.pool.query(get_people, (error, rows, fields) => {
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

    // Run the INSERT query
    add_person = `INSERT INTO People (personName, personEmail, personPhoneNumber, personHouseholdId, personKarma) VALUES (?, ?, ?, ?, ?)`;
    db.pool.query(add_person, [data.name, data.email, data.phoneNumber, data.householdId, data.karma], function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.status(400).send(error);
        }
        else
        {
            // If there was no error, retrieve the new table state
            db.pool.query(show_people_table, function(error, rows, fields){

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

    // Run the UPDATE query
    update_person = `
    UPDATE People 
    SET 
        personName = ?, 
        personEmail = ?, 
        personPhoneNumber = ?, 
        personHouseholdId = ?, 
        personKarma = ? 
    WHERE 
        personId = ?;`;
    
    db.pool.query(update_person, [data.name, data.email, data.phoneNumber, data.householdId, data.karma, data.id], function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.status(400).send(error);
        }
        else
        {
            // If there was no error, send the row to update
            find_updated_person = `
            SELECT personId, personName, personEmail, personPhoneNumber, CONCAT(householdAddress, ', ', householdCity, ' ', householdState, ', ', householdZipCode) AS fullAddress, personKarma 
            FROM People
            LEFT JOIN Households ON personHouseholdID = householdID
            WHERE personID = ?;
            `;
            db.pool.query(find_updated_person, [data.id], function(error, rows, fields){

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

    // Run the INSERT query
    add_household = `INSERT INTO Households (householdAddress, householdCity, householdState, householdZipcode, householdNeighborhoodId) VALUES (?, ?, ?, ?, ?)`;
    db.pool.query(add_household, [data.address, data.city, data.state, data.zipCode, data.neighborhoodId], function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.status(400).send(error);
        }
        else
        {
            // If there was no error, retrieve the new table state
            db.pool.query(show_household_table, function(error, rows, fields){

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

app.post('/add-neighborhood-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Run the INSERT query
    add_neighborhood = `INSERT INTO Neighborhoods (neighborhoodName) VALUES (?)`;
    db.pool.query(add_neighborhood, [data.name], function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.status(400).send(error);
        }
        else
        {
            // If there was no error, retrieve the new table state
            db.pool.query(get_neighborhoods, function(error, rows, fields){

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

app.post('/add-offer-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Run the INSERT query
    add_offer = `INSERT INTO Offers (offerGiverId, offerItem, offerDescription, offerQuantity, offerCost, offerTypeId) VALUES (?, ?, ?, ?, ?, ?)`;
    db.pool.query(add_offer, [data.giverId, data.item, data.description, data.quantity, data.cost, data.typeId], function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.status(400).send(error);
        }
        else
        {
            // If there was no error, retrieve the new table state
            db.pool.query(show_offers_table, function(error, rows, fields){

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

app.post('/add-offer-type-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Run the INSERT query
    add_offer_type = `INSERT INTO OfferTypes (offerType) VALUES (?)`;
    db.pool.query(add_offer_type, [data.offerType], function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.status(400).send(error);
        }
        {
            // If there was no error, retrieve the new table state
            db.pool.query(get_offer_types, function(error, rows, fields){

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

    // Run the INSERT query
    add_transaction = `INSERT INTO Transactions (transactionOfferID, transactionReceiverID) VALUES (?, ?)`;
    db.pool.query(add_transaction, [data.offerId, data.recieverId], function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.status(400).send(error);
        }
        {
            // If there was no error, retrieve the new table state
            db.pool.query(show_transactions_table, function(error, rows, fields){

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

app.delete('/delete-offer-ajax/', function(req, res, next){
    let data = req.body;
    let offerId = parseInt(data.id);

    // Run the delete query
    let deleteOffer = `DELETE FROM Offers WHERE offerId = ?`;
    db.pool.query(deleteOffer, [offerId], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.status(400).send(error);
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