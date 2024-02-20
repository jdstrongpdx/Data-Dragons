
// Starter code provided by Dr. Curry and Prof. Safonte at Oregon State University
// at https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addOfferForm = document.getElementById('add-offer-form-ajax');

// Modify the objects we need
addOfferForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputGiverId = document.getElementById("input-giver-id");
    let inputItem = document.getElementById("input-item");
    let inputDescription = document.getElementById("input-description");
    let inputQuantity = document.getElementById("input-quantity");
    let inputCost = document.getElementById("input-cost");
    let inputTypeId = document.getElementById("input-type-id");

    // Get the values from the form fields
    let giverIdValue = inputGiverId.value;
    let itemValue = inputItem.value;
    let descriptionValue = inputDescription.value;
    let quantityValue = inputQuantity.value;
    let costValue = inputCost.value;
    let typeIdValue = inputTypeId.value;

    // Put our data we want to send in a javascript object
    let data = {
        giverId: giverIdValue,
        item: itemValue,
        description: descriptionValue,
        quantity: quantityValue,
        cost: costValue,
        typeId: typeIdValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-offer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            // addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            giverIdValue.value = '';
            itemValue.value = '';
            descriptionValue.value = '';
            quantityValue.value = '';
            costValue = '';
            typeIdValue = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})