/* Citation for the following function:
   Date: 2/14/24
   Adapted from starter code provided by Dr. Curry and Prof. Safonte at Oregon State University
   Starter code used as a template with variables changed to meet our use case.  Some functions/routes were added/removed for functionality.
   Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/ 

// Get the objects we need to modify
let addOfferTypeForm = document.getElementById('add-offer-type-form-ajax');

// Modify the objects we need
addOfferTypeForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOfferType = document.getElementById("input-offer-type");

    // Get the values from the form fields
    let offerTypeValue = inputOfferType.value;

    // Put our data we want to send in a javascript object
    let data = {
        offerType: offerTypeValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-offer-type-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            addOfferTypeForm.reset();
            window.scrollTo(0, document.getElementById("offer-type-table").offsetTop);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
            var errorMsg = JSON.parse(xhttp.response);
            alert(errorMsg.sqlMessage)
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Creates a single row from an Object representing a single record from OfferTypes
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("offer-type-table");
    let tbody = currentTable.getElementsByTagName("tbody")[0];
 
    // Get the new data
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
 
    // Replace the content of the new row with the data we obtained
    let row = document.createElement("TR");	   
    let idCell = document.createElement("TD");
    let typeCell = document.createElement("TD");

 
    // Fill the cells with correct data	
    idCell.innerText = newRow.offerTypeId;	
    typeCell.innerText = newRow.offerType;	

    // Add the cells to the row 	
    row.appendChild(idCell);	
    row.appendChild(typeCell);	
 
    // Add the row to the table
    tbody.appendChild(row);
 }