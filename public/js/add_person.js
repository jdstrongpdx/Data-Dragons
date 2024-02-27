
// Starter code provided by Dr. Curry and Prof. Safonte at Oregon State University
// at https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addPersonForm = document.getElementById('add-person-form-ajax');

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputId = document.getElementById("input-id");
    let inputName = document.getElementById("input-name");
    let inputEmail = document.getElementById("input-email");
    let inputPhoneNumber = document.getElementById("input-phone-number");
    let inputHouseholdId = document.getElementById("input-household-id");
    let inputKarma = document.getElementById("input-karma");

    // Get the values from the form fields
    let inputIdValue = parseInt(inputId.value);
    let nameValue = String(inputName.value);
    let emailValue = String(inputEmail.value);
    let phoneNumberValue = String(inputPhoneNumber.value);
    let householdIdValue = parseInt(inputHouseholdId.value);
    let karmaValue = parseInt(inputKarma.value);

    // Put our data we want to send in a javascript object
    var xhttp = new XMLHttpRequest();

    if ( isNaN(inputIdValue) ) {
        data = {
            name: nameValue,
            email: emailValue,
            phoneNumber: phoneNumberValue,
            householdId: householdIdValue,
            karma: karmaValue
        }
        xhttp.open("POST", "/add-person-ajax", true);
    }
    else {
        data = {
            id : inputIdValue,
            name: nameValue,
            email: emailValue,
            phoneNumber: phoneNumberValue,
            householdId: householdIdValue,
            karma: karmaValue 
        }
        xhttp.open("POST", "/update-person-ajax", true);
    }

    // Setup our AJAX request
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            if ( isNaN(inputIdValue) ){
                addRowToTable(xhttp.response);
            }
            else {
                updateRowInTable(xhttp.response);
            }

            // Clear the input fields for another transaction
            inputId.value = '';
            inputName.value = '';
            inputEmail.value = '';
            inputPhoneNumber.value = '';
            inputHouseholdId.value = '';
            inputKarma.value = '';

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

    // Get the new data
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Replace the content of the new row with the data we obtained
    let row = document.createElement("TR");
    
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let phoneNumberCell = document.createElement("TD");
    let householdIdCell = document.createElement("TD");
    let karmaIdCell = document.createElement("TD");
    let editButton = document.createElement("TD");

    // Fill the cells with correct data	
    idCell.innerText = newRow.personId;	
    nameCell.innerText = newRow.personName;	
    emailCell.innerText = newRow.personEmail;	
    phoneNumberCell.innerText = newRow.personPhoneNumber;	
    householdIdCell.innerText = newRow.fullAddress;	
    karmaIdCell.innerText = newRow.personKarma;
    editButton.innerHTML = `<button onclick="updatePerson(${newRow.personId})">Update</button>`;  
    
    // Add the cells to the row 	
    row.appendChild(idCell);	
    row.appendChild(nameCell);	
    row.appendChild(emailCell);	
    row.appendChild(phoneNumberCell);	
    row.appendChild(householdIdCell);	
    row.appendChild(karmaIdCell);
    row.appendChild(editButton);

    // Add the row to the table
    tbody.appendChild(row);
}

updateRowInTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("people-table");
    let tbody = currentTable.getElementsByTagName("tbody")[0];

    // Get the new data
    let updateData = JSON.parse(data);
    updateRow = updateData[0]

    for (var i = 0; i < tbody.rows.length; i++) {
        var row = tbody.rows[i];
        // Find the row we want to modify
        if (row.cells[0].textContent == updateRow.personId) {
            row.cells[1].innerText = updateRow.personName;
            row.cells[2].innerText = updateRow.personEmail;
            row.cells[3].innerText = updateRow.personPhoneNumber;
            row.cells[4].innerText = updateRow.fullAddress;
            row.cells[5].innerText = updateRow.personKarma;
            break;
        }
    };
}