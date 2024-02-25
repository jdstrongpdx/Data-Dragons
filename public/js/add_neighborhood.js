
// Starter code provided by Dr. Curry and Prof. Safonte at Oregon State University
// at https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addNeighborhoodForm = document.getElementById('add-neighborhood-form-ajax');

// Modify the objects we need
addNeighborhoodForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");

    // Get the values from the form fields
    let nameValue = inputName.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-neighborhood-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Creates a single row from an Object representing a single record from Neighborhoods
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("neighborhood-table");
    let tbody = currentTable.getElementsByTagName("tbody")[0];
 
    // Get the new data
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
 
    // Replace the content of the new row with the data we obtained
    let row = document.createElement("TR");	   
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");

 
    // Fill the cells with correct data	
    idCell.innerText = newRow.neighborhoodId;	
    nameCell.innerText = newRow.neighborhoodName;	

    // Add the cells to the row 	
    row.appendChild(idCell);	
    row.appendChild(nameCell);	
 
    // Add the row to the table
    tbody.appendChild(row);
 }