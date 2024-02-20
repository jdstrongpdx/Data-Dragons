
// Starter code provided by Dr. Curry and Prof. Safonte at Oregon State University
// at https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addHouseholdForm = document.getElementById('add-person-form-ajax');

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
    let addressValue = String(inputAddress.value);
    let cityValue = String(inputCity.value);
    let stateValue = String(inputState.value);
    let zipCodeValue = parseInt(inputZipCode.value);
    let neighborhoodIdValue = parseInt(inputNeighborhoodId.value);

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