/* Citation for the following function:
   Date: 2/14/24
   Adapted from starter code provided by Dr. Curry and Prof. Safonte at Oregon State University
   Starter code used as a template with variables changed to meet our use case.  Some functions/routes were added/removed for functionality.
   Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/ 

function updatePerson(personID) {
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
}