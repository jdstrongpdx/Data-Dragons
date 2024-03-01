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

    // Put our data we want to send in a javascript object
    let data = {
        offerId: document.getElementById("input-transaction-offer-id").value,
        recieverId: document.getElementById("input-reciever-id").value
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-transaction-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            addTransactionForm.reset();
            window.scrollTo(0, document.getElementById("transactions-table").offsetTop);
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

// Creates a single row from an Object representing a single record from Transactions
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("transactions-table");
    let tbody = currentTable.getElementsByTagName("tbody")[0];
 
    // Get the new data
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
 
    // Replace the content of the new row with the data we obtained
    let row = document.createElement("TR");	   
    let idCell = document.createElement("TD");
    let offerIdCell = document.createElement("TD");
    let receieverIdCell = document.createElement("TD");
    let timeStamp = document.createElement("TD");

 
    // Fill the cells with correct data	
    idCell.innerText = newRow.transactionId;	
    offerIdCell.innerText = newRow.item;	
    receieverIdCell.innerText = newRow.receiver;	

    // Format the timestamp correctly
    const dateObject = new Date(newRow.transactionTime);
    const formattedDate = dateObject.toLocaleString();
    timeStamp.innerText = formattedDate

    // Add the cells to the row 	
    row.appendChild(idCell);	
    row.appendChild(offerIdCell);	
    row.appendChild(receieverIdCell);	
    row.appendChild(timeStamp);	
 
    // Unhighlight all rows 
    for (var i = 0; i < currentTable.rows.length; i++) {
        currentTable.rows[i].classList.remove("highlight");
    }
    
    // Highlight the target row
    row.classList.add('highlight');
    tbody.appendChild(row);   
 }