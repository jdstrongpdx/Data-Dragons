// App.js

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
PORT        = 39745;                 // Set a port number at the top so it's easy to change in the future
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))


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

app.get('/people', function(req, res)
    {  

    // If there is no query string, we just perform a basic SELECT
    if (req.query.qname === undefined)
    {
        query1 = "SELECT * FROM People;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM People WHERE personName LIKE "${req.query.qname}%"`
    }

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM Households;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let people = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the planets
            let households = rows;
            return res.render('people', {data: people, households: households});
        })
    })
    });

app.get('/households', function(req, res)
{  
    let query1 = "SELECT * FROM Households;";
    db.pool.query(query1, function(error, rows, fields){
    res.render('households', {data: rows});
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
    let query1 = "SELECT * FROM Offers;";
    db.pool.query(query1, function(error, rows, fields){
    res.render('offers', {data: rows});
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
    let query1 = "SELECT * FROM Transactions;";
    db.pool.query(query1, function(error, rows, fields){
    res.render('transactions', {data: rows});
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
        query1 = `INSERT INTO People (personName, personEmail, personPhoneNumber, personHouseholdId) VALUES ('${data.name}', '${data.email}', '${data.phoneNumber}', '${data.householdId}')`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on People
                query2 = `SELECT * FROM People;`;
                db.pool.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        app.get('/people');
                        //res.send(rows);
                    }
                })
            }
        })
    });

/*
    LISTENER
*/
app.listen(PORT, function(){           
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});