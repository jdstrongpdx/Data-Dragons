
// Starter code provided by Dr. Curry and Prof. Safonte at Oregon State University
// at https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addPersonForm = document.getElementById('add-person-form-ajax');

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");
    let inputEmail = document.getElementById("input-email");
    let inputPhoneNumber = document.getElementById("input-phone-number");
    let inputHouseholdId = document.getElementById("input-household-id");

    // Get the values from the form fields
    let nameValue = String(inputName.value);
    let emailValue = String(inputEmail.value);
    let phoneNumberValue = String(inputPhoneNumber.value);
    let householdIdValue = parseInt(inputHouseholdId.value);

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        email: emailValue,
        phoneNumber: phoneNumberValue,
        householdId: householdIdValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-person-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputEmail.value = '';
            inputPhoneNumber.value = '';
            inputHouseholdId.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from People
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("people-table");
    let tbody = currentTable.getElementsByTagName("tbody")[0];
    let lastRow = tbody.lastElementChild;
    let newRow = lastRow.cloneNode(true);

    // Get the new data
    let parsedData = JSON.parse(data);
    let newRowData = parsedData[parsedData.length - 1]

    // Replace the content of the new row with the data we obtained
    newRow.cells[0].textContent  = newRowData.personId;
    newRow.cells[1].textContent  = newRowData.personName;
    newRow.cells[2].textContent  = newRowData.personEmail;
    newRow.cells[3].textContent  = newRowData.personPhoneNumber;
    newRow.cells[4].textContent  = newRowData.personHouseholdId;
    newRow.cells[5].textContent  = newRowData.personKarma;
    
    // Add the row to the table
    tbody.appendChild(newRow);
}