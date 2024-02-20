
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
            // addRowToTable(xhttp.response);

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