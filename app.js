// App.js

// Database
var db = require('./database/db-connector')
/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 39743;                 // Set a port number at the top so it's easy to change in the future

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
app.use(express.json())
app.use(express.urlencoded({extended: true}))

/*
    ROUTES
*/
app.get('/', function(req, res)
    {  
        let query1 = "SELECT * FROM People;";               // Define our query
        db.pool.query(query1, function(error, rows, fields){    // Execute the query
        res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query

app.get('/people', function(req, res)
    {  
        let query1 = "SELECT * FROM People;";               // Define our query
        db.pool.query(query1, function(error, rows, fields){    // Execute the query
        res.render('people', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });

    app.get('/households', function(req, res)
    {  
        let query1 = "SELECT * FROM Households;";
        db.pool.query(query1, function(error, rows, fields){
        res.render('households', {data: rows});
        })
    });



/*
    LISTENER
*/
app.listen(PORT, function(){           
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});