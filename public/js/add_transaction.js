
// Starter code provided by Dr. Curry and Prof. Safonte at Oregon State University
// at https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addTransactionForm = document.getElementById('add-transaction-form-ajax');

// Modify the objects we need
addTransactionForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOffer = document.getElementById("input-transaction-offer-id");
    let inputReciever = document.getElementById("input-reciever-id");

    // Get the values from the form fields
    let offerValue = inputOffer.value;
    let recieverValue = inputReciever.value;

    // Put our data we want to send in a javascript object
    let data = {
        offerId: offerValue,
        recieverId: recieverValue
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
            inputName.value = '';
            inputReciever.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
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
    offerIdCell.innerText = newRow.transactionOfferId;	
    receieverIdCell.innerText = newRow.transactionReceiverId;	
    timeStamp.innerText = newRow.transactionTime;	

    // Add the cells to the row 	
    row.appendChild(idCell);	
    row.appendChild(offerIdCell);	
    row.appendChild(receieverIdCell);	
    row.appendChild(timeStamp);	
 
    // Add the row to the table
    tbody.appendChild(row);
 }