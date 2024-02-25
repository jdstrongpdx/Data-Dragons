
// Starter code provided by Dr. Curry and Prof. Safonte at Oregon State University
// at https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addHouseholdForm = document.getElementById('add-household-form-ajax');

// Modify the objects we need
addHouseholdForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputAddress = document.getElementById("input-address");
    let inputCity = document.getElementById("input-city");
    let inputState = document.getElementById("input-state");
    let inputZipCode = document.getElementById("input-zipcode");
    let inputNeighborhoodId = document.getElementById("input-neighborhood-id");

    // Get the values from the form fields
    let addressValue = inputAddress.value;
    let cityValue = inputCity.value;
    let stateValue = inputState.value;
    let zipCodeValue = inputZipCode.value;
    let neighborhoodIdValue = inputNeighborhoodId.value;

    // Put our data we want to send in a javascript object
    let data = {
        address: addressValue,
        city: cityValue,
        state: stateValue,
        zipCode: zipCodeValue,
        neighborhoodId: neighborhoodIdValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-household-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputAddress.value = '';
            inputCity.value = '';
            inputState.value = '';
            inputZipCode.value = '';
            inputNeighborhoodId = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Households
addRowToTable = (data) => {

   // Get a reference to the current table on the page and clear it out.
   let currentTable = document.getElementById("household-table");
   let tbody = currentTable.getElementsByTagName("tbody")[0];

   // Get the new data
   let parsedData = JSON.parse(data);
   let newRow = parsedData[parsedData.length - 1]

   // Replace the content of the new row with the data we obtained
   let row = document.createElement("TR");	   
   let idCell = document.createElement("TD");
   let addressCell = document.createElement("TD");
   let cityCell = document.createElement("TD");
   let stateCell = document.createElement("TD");
   let zipCell = document.createElement("TD");
   let neighborhoodIDCell = document.createElement("TD");

   // Fill the cells with correct data	
   idCell.innerText = newRow.householdId;	
   addressCell.innerText = newRow.householdAddress;	
   cityCell.innerText = newRow.householdCity;	
   stateCell.innerText = newRow.householdState;	
   zipCell.innerText = newRow.householdZipcode;	
   neighborhoodIDCell.innerText = newRow.neighborhoodName;
   
   // Add the cells to the row 	
   row.appendChild(idCell);	
   row.appendChild(addressCell);	
   row.appendChild(cityCell);	
   row.appendChild(stateCell);	
   row.appendChild(zipCell);	
   row.appendChild(neighborhoodIDCell);

   // Add the row to the table
   tbody.appendChild(row);
}