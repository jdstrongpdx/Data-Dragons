/* Citation for the following function:
   Date: 2/14/24
   Adapted from starter code provided by Dr. Curry and Prof. Safonte at Oregon State University
   Starter code used as a template with variables changed to meet our use case.  Some functions/routes were added/removed for functionality.
   Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/ 

// Get the objects we need to modify
let addPersonForm = document.getElementById('add-person-form-ajax');

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get the values from the form fields
    let inputIdValue = parseInt(document.getElementById("input-id").value);

    // Put our data we want to send in a javascript object
    var xhttp = new XMLHttpRequest();

    noInputID = isNaN(inputIdValue)
    if ( noInputID ) {
        data = {
            name: String(document.getElementById("input-name").value),
            email: String(document.getElementById("input-email").value),
            phoneNumber: String(document.getElementById("input-phone-number").value),
            householdId: parseInt(document.getElementById("input-household-id").value),
            karma: parseInt(document.getElementById("input-karma").value)
        }
        xhttp.open("POST", "/add-person-ajax", true);
    }
    else {
        data = {
            id : inputIdValue,
            name: String(document.getElementById("input-name").value),
            email: String(document.getElementById("input-email").value),
            phoneNumber: String(document.getElementById("input-phone-number").value),
            householdId: parseInt(document.getElementById("input-household-id").value),
            karma: parseInt(document.getElementById("input-karma").value) 
        }
        xhttp.open("POST", "/update-person-ajax", true);
    }

    // Setup our AJAX request
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Reload the table
            reloadPage(inputIdValue)

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


function populateUpdateForm(personID) {
    let table = document.getElementById("people-table");
    let tbody = table.getElementsByTagName("tbody")[0];

    for (var i = 0; i < tbody.rows.length; i++) {
        var row = tbody.rows[i];

        // Find the row we want to modify
        if (row.cells[0].textContent == personID) {
            let inputId = document.getElementById("input-id");
            let inputName = document.getElementById("input-name");
            let inputEmail = document.getElementById("input-email");
            let inputPhoneNumber = document.getElementById("input-phone-number");
            let inputHouseholdId = document.getElementById("input-household-id");
            let inputKarma = document.getElementById("input-karma");

            inputId.value = row.cells[0].innerText;
            inputName.value = row.cells[1].innerText
            inputEmail.value = row.cells[2].innerText
            inputPhoneNumber.value = row.cells[3].innerText

            inputHouseholdId.selectedIndex = 0;
            for (var i = 0; i < inputHouseholdId.options.length; i++) {
                if ( inputHouseholdId.options[i].text == row.cells[4].innerText ) {
                    inputHouseholdId.selectedIndex = i;
                    break;
                }
            }
            inputKarma.value = row.cells[5].innerText
            break;
        }
    }
    window.scrollTo(0, document.getElementById("people-form").offsetTop);
    document.getElementById('people-form').innerText = 'Edit a Person';
    document.getElementById('submit-button').value = 'Edit Person';
    document.getElementById("input-id").classList.remove('hidden');
    document.getElementById("input-id-text").classList.remove('hidden');
}

function resetButton() {
    document.getElementById('people-form').innerText = 'Add a Person';
    document.getElementById('submit-button').value = 'Add Person';
    document.getElementById("input-id-text").classList.add('hidden');
    document.getElementById("input-id").classList.add('hidden');
}

function highlightNew( target ) {
    let currentTable = document.getElementById("people-table");
    let tbody = currentTable.getElementsByTagName("tbody")[0];

    for (var i = 0; i < tbody.rows.length; i++) {
        var row = tbody.rows[i];
        // Find the row we want to modify
        if (row.cells[0].textContent == target) {
            row.classList.add('highlight');
            break;
        }
    };
}

function reloadPage(id) {
    sessionStorage.setItem("reloading", "true");
    sessionStorage.setItem("id", id);
    location.reload();
    window.scrollTo(0, document.getElementById("people-table").offsetTop);
}
            
window.onload = function() {
    var reloading = sessionStorage.getItem("reloading");
    if (reloading) {
        sessionStorage.removeItem("reloading");
        highlightNew(sessionStorage.getItem("id"));
    }
}