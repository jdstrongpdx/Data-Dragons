/* Citation for the following function:
   Date: 2/14/24
   Adapted from starter code provided by Dr. Curry and Prof. Safonte at Oregon State University
   Starter code used as a template with variables changed to meet our use case.  Some functions/routes were added/removed for functionality.
   Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/ 

// Get the objects we need to modify
let addNeighborhoodForm = document.getElementById('add-neighborhood-form-ajax');

// Modify the objects we need
addNeighborhoodForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Put our data we want to send in a javascript object
    let data = {
        name: document.getElementById("input-name").value
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-neighborhood-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Reload the table
            location.reload()
            window.scrollTo(0, document.getElementById("neighborhood-table").offsetTop);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
            var errorMsg = JSON.parse(xhttp.response);
            alert(errorMsg.sqlMessage)
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})
