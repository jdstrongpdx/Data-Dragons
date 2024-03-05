/* Citation for the following function:
   Date: 2/14/24
   Adapted from starter code provided by Dr. Curry and Prof. Safonte at Oregon State University
   Starter code used as a template with variables changed to meet our use case.  Some functions/routes were added/removed for functionality.
   Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/ 

// Get the objects we need to modify
let addTransactionForm = document.getElementById('add-transaction-form-ajax');

// Modify the objects we need
addTransactionForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    let inputIdValue = parseInt(document.getElementById("input-id").value);
    noInputID = isNaN(inputIdValue)

    var xhttp = new XMLHttpRequest();


    // Put our data we want to send in a javascript object
    if (noInputID){
        data = {
                offerId: parseInt(document.getElementById("input-transaction-offer-id").value),
                recieverId: parseInt(document.getElementById("input-reciever-id").value)
            }
        xhttp.open("POST", "/add-transaction-ajax", true);
        }
    else {
        data = {
            transactionId: inputIdValue,
            offerId: parseInt(document.getElementById("input-transaction-offer-id").value),
            recieverId: parseInt(document.getElementById("input-reciever-id").value)
        }
        xhttp.open("POST", "/edit-transaction-ajax", true);
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

function deleteTransaction(transactionId) {
    // Put our data we want to send in a javascript object
    let data = {
        id: transactionId
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-transaction-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Reload the table
            location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
            var errorMsg = JSON.parse(xhttp.response);
            alert(errorMsg.sqlMessage)
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function populateUpdateForm(transactionID) {
    let table = document.getElementById("transactions-table");
    let tbody = table.getElementsByTagName("tbody")[0];

    for (var i = 0; i < tbody.rows.length; i++) {
        var row = tbody.rows[i];

        // Find the row we want to modify
        if (row.cells[0].textContent == transactionID) {
            let inputId = document.getElementById("input-id");
            let inputOfferId = document.getElementById("input-transaction-offer-id");
            let inputRecieverId = document.getElementById("input-reciever-id");

            inputId.value = row.cells[0].innerText;

            inputOfferId.selectedIndex = 0;
            for (var i = 0; i < inputOfferId.options.length; i++) {
                if ( inputOfferId.options[i].text == row.cells[1].innerText ) {
                    inputOfferId.selectedIndex = i;
                    break;
                }
            }
            inputRecieverId.selectedIndex = 0;
            for (var i = 0; i < inputRecieverId.options.length; i++) {
                if ( inputRecieverId.options[i].text == row.cells[2].innerText ) {
                    inputRecieverId.selectedIndex = i;
                    break;
                }
            }            
            break;
        }
    }
    window.scrollTo(0, document.getElementById("transaction-form").offsetTop);
    document.getElementById('transaction-form').innerText = 'Edit a Transaction';
    document.getElementById('submit-button').value = 'Edit Transaction';
    document.getElementById("input-id").classList.remove('hidden');
    document.getElementById("input-id-text").classList.remove('hidden');
}

function resetButton() {
    document.getElementById('transaction-form').innerText = 'Add a Transaction';
    document.getElementById('submit-button').value = 'Add Transaction';
    document.getElementById("input-id").classList.add('hidden');
    document.getElementById("input-id-text").classList.add('hidden');
}

function highlightNew( target ) {
    let currentTable = document.getElementById("transactions-table");
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

/* Citation for the following two functions:
   Date: 3/5/24
   Adapted from sample code by user Barmar
   Source URL: https://stackoverflow.com/questions/41904975/refresh-page-and-run-function-after-javascript
*/ 
function reloadPage(id) {
    sessionStorage.setItem("reloading", "true");
    sessionStorage.setItem("id", id);
    location.reload();
    window.scrollTo(0, document.getElementById("transactions-table").offsetTop);
}
            
window.onload = function() {
    var reloading = sessionStorage.getItem("reloading");
    if (reloading) {
        sessionStorage.removeItem("reloading");
        highlightNew(sessionStorage.getItem("id"));
    }
}