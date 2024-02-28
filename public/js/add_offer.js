/* Citation for the following function:
   Date: 2/14/24
   Adapted from starter code provided by Dr. Curry and Prof. Safonte at Oregon State University
   Starter code used as a template with variables changed to meet our use case.  Some functions/routes were added/removed for functionality.
   Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/ 

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
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            addOfferForm.reset();
            window.scrollTo(0, document.getElementById("offer-table").offsetTop);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Offers
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("offer-table");
    let tbody = currentTable.getElementsByTagName("tbody")[0];

    // Get the new data
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Replace the content of the new row with the data we obtained
    let row = document.createElement("TR");	   
    let idCell = document.createElement("TD");
    let giverIdcell = document.createElement("TD");
    let itemCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");
    let quantityCell = document.createElement("TD");
    let costCell = document.createElement("TD");
    let timestampCell = document.createElement("TD");
    let offerTypeCell = document.createElement("TD");
    let deleteButton = document.createElement("TD");


    // Fill the cells with correct data	
    idCell.innerText = newRow.offerId;	
    giverIdcell.innerText = newRow.giverEmail;	
    itemCell.innerText = newRow.offerItem;	
    descriptionCell.innerText = newRow.offerDescription;	
    quantityCell.innerText = newRow.offerQuantity;	
    costCell.innerText = newRow.offerCost;

    // Format the timestamp
    const dateObject = new Date(newRow.offerTime);
    const formattedDate = dateObject.toLocaleString();
    timestampCell.innerText =formattedDate;
    offerTypeCell.innerText = newRow.offerType;
    deleteButton.innerHTML = `<button onclick="deleteOffer(${newRow.offerId})">Delete</button>`;  
    
    // Add the cells to the row 	
    row.appendChild(idCell);	
    row.appendChild(giverIdcell);	
    row.appendChild(itemCell);	
    row.appendChild(descriptionCell);	
    row.appendChild(quantityCell);	
    row.appendChild(costCell);	
    row.appendChild(timestampCell);
    row.appendChild(offerTypeCell);
    row.appendChild(deleteButton);

    // Add the row to the table
    tbody.appendChild(row);
    // tbody.lastChild.className('data-value');
}