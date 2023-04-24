//get jev modal
var jevModal = document.getElementById("jevModalForm")

// Get the modal
var modal = document.getElementById("modalForm");

// Get the selected modal
var selectedModal = document.getElementById("selectedModalForm");

// Get the button that opens the modal
var btn = document.getElementById("btnNewEntry");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("btnBack")[0];

var jevSpan = document.getElementsByClassName("btnBackJev")[0];

// Get the <span> element that closes the modal
var btnCancel = document.getElementById('formCancel');

var btnCancelSelected = document.getElementById('formCancelSelected');

var addBtn = document.getElementById('addInput');

var inputFieldContainer = document.getElementById('inputFieldContainer');

let isNewEntry = true;

let jevId; 

// When the user clicks on the button, open the modal
btn.onclick = function () {
    jevModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
    modal.reset();
}
//MODAL
jevSpan.onclick = function () {
    jevModal.style.display = "none";
    isNewEntry = true
}

btnCancel.onclick = function (e) {
    var bool = confirm("Are you sure you want to cancel?");
    if (bool == true) {
        modal.style.display = "none";
        selectedModal.style.display = "none";
    } else {
        e.preventDefault();
    }
}

//FUNCTION FOR CREATING JEV 
const formJev = document.getElementById('create-jev');
formJev.addEventListener('submit', async (e) => {
    e.preventDefault();

    const jevInput = document.getElementById('jevInput').value;

    const jevDataForm = {
        jevInput
    };

    const jevResponse = await fetch('/jevHomepage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jevDataForm)
    })
    const jevStatus = await jevResponse.text();

    if (jevStatus == 'Success') {
        formJev.style.display = "none";
        modal.style.display = "block";
        formJev.reset();
    }
})

//COMMA FOR CURRENCY INPUT FIELD
var fnf = document.getElementById("debit");
fnf.addEventListener('keyup', function (evt) {
    var n = parseFloat(this.value.replace(/\D/g, ''), 10);
    if (isNaN(n)) {
        fnf.value = "";
        fnf.placeholder = "Enter Debit";
    } else {
        fnf.value = n.toLocaleString();
    }
}, false);


// FUNCTION FOR ADDING INPUT FIELD DYNAMICALLY
document.getElementById("addInput").addEventListener('click', function (e) {
    e.preventDefault();
    var inputFieldContainer = document.getElementById('inputFieldContainer');

    var newRow = document.createElement('div');
    newRow.className = 'form-row col-lg-12';

    var newUacsInput = document.createElement('div');
    newUacsInput.className = 'form-group col-lg-12 uacs-group';
    newUacsInput.innerHTML = `
    <label for="uacs" class="label">UACS Code</label> 
    <input id="uacs" class="form-control col-lg-8 mb-2 uacs-form dynamic-input" name="uacs" required></input>`;

    var newDescriptionInput = document.createElement('div');
    newDescriptionInput.className = 'form-group col-lg-12 description-group'
    newDescriptionInput.innerHTML = `
    <label for="description" class="label">Account</label> 
    <textarea name="text" id="description" rows="2" cols="65" id="description" class="form-control col-lg-8 mb-2 dynamic-input" name="description"></textarea>`;

    var newDebitInput = document.createElement('div');
    newDebitInput.className = 'form-group col-lg-12 debit-group';
    newDebitInput.innerHTML = `
    <label for="debit" class="label">Debit</label> 
    <input type="text" id="debit" class="form-control col-lg-8 mb-2 debit-form dynamic-input dynamic-input-debit" name="debit" required> 
    <hr>`;

    newDebitInput.querySelector('input').addEventListener('keyup', function (evt) {
        var n = parseFloat(this.value.replace(/\D/g, ''), 10);
        if (isNaN(n)) {
            this.value = "";
            this.placeholder = "Enter Debit";
        } else {
            this.value = n.toLocaleString();
        }
    });

    const divider = document.createElement('hr');


    newRow.appendChild(newUacsInput);
    newRow.appendChild(newDescriptionInput);
    newRow.appendChild(newDebitInput);
    newRow.appendChild(divider);

    inputFieldContainer.appendChild(newRow);
});


//FUNCTION FOR NEW ENTRY OF JEV
const form = document.getElementById('entry-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const text = "Are you sure you want to save?";

    const dateForm = document.getElementById('dateForm').value;
    const uacs = document.getElementById('uacs').value;
    let description = document.getElementById('description').value;
    const debit = document.getElementById('debit').value;

    // THIS DYNAMIC INPUT IS A FUNCTION FOR ADDED INPUT FIELD TO STORE IN DATABASE
    const dynamicInputs = document.querySelectorAll('.dynamic-input');
    const dynamicInputValue = Array.from(dynamicInputs).reduce((acc, input, index) => {
        const row = Math.floor(index / 3);
        if (!acc[row]) {
            acc[row] = ['', '', ''];
        }
        acc[row][index % 3] = input.value;
        return acc;
    }, []);

    let descriptionInput = description;
    let descriptionModified = descriptionInput.replace(/'/g, "''");
    description = descriptionModified;

    const dataForm = {
        dateForm,
        uacs,
        description,
        debit,
        dynamicInputs: dynamicInputValue
    };

    if (confirm(text) == true) {

        let insertUpdate = '/newEntry';

        const response = await fetch(insertUpdate, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataForm)
        })

        const status = await response.text();

        if (status == 'Success') {
            
            form.reset();
            modal.style.display = "none";
            jevModal.style.display = "none";
        }
    }
})

//INITIALIZE SOCKET.IO
const socket = io.connect();

//TO HAVE A CONNECTION TO SERVER
socket.on('connect', () => {
    console.log('Successfully connected');
})

// UPDATE FRONT END TABLE REALTIME WHEN DATA WAS INSERTED
socket.on('insertData', (data) => {

    const tableContent = document.querySelector('#tbody-records');

    if (tableContent) {
        const newTableRow = document.createElement('tr');
        newTableRow.setAttribute('class', 'table-content');
        newTableRow.setAttribute('data-id', `${data.recordset[0].jevNo}`);

        newTableRow.innerHTML = `
        <td id="propertyTag">
            <i class="fa-solid fa-file"></i>&ThickSpace;
            ${data.recordset[0].jevNo.slice(3)}
        </td>
        <td>
            <span> ${data.recordset[0].dateCreated} </span> 
            <span class="byName"> by ${data.recordset[0].createdBy} </span>
        </td>
        <td>
            <span>${data.recordset[0].dateModified} </span> 
            <span class="byName"> by ${data.recordset[0].modifiedBy} </span>
        </td>

        <td id="selected-item"><input type="checkbox" name="chk" id=""></td>
    `;
        tableContent.prepend(newTableRow);
    }

});


//TO RETRIEVE SPECIFIC RECORD WHEN USER CLICKED
const tableContent = document.querySelectorAll('.table-content');
const entryForm = document.getElementById('entry-form');
const table = document.querySelector('#tbody-records');

//INITIALIZE INPUT 
const modalForm = document.querySelector('#selectedModalForm');

const selectedInputFieldContainer = document.getElementById('selectedInputFieldContainer');

// const selectedForm = document.getElementById('entry-selected-form');

//TO DETECT WHICH RECORD IS BEING SELECTED 
table.addEventListener('click', async (e) => {
    e.preventDefault();
    if (e.target && e.target.parentElement.nodeName === 'TR') {
        let row = e.target.parentElement;

        const existingInputFields = document.querySelectorAll('#selectedInputFieldContainer #selectedJev');
        existingInputFields.forEach(inputField => {
            inputField.remove();
        });
        
        //TODO DISPLAY PRINT AND DELETE BUTTON
        
        const response = await fetch(`/selectRecord/${row.dataset.id}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        })
        
        const result = await response.json();
        
        if (result.status === 'data retrieved') {
            jevId = row.dataset.id;
            result.data.recordset.forEach((d) => {
                selectedModal.style.display = 'block';
                const inputDiv = document.createElement('div');
                inputDiv.setAttribute('class', 'form-row');
                inputDiv.setAttribute('id', 'selectedJev');
                inputDiv.setAttribute('data-id', d.ID);

                inputDiv.innerHTML = `
                <!-- Date -->
                <div class="form-group col-lg-12 date-group">
                    <label for="selectedDateForm" class="label">Date mm/dd/yyyy</label>
                    <input type="text" class="form-control col-lg-6 date-form" id="selectedDateForm" name="selectedDateForm"
                        placeholder="Enter a Date" value="${d.date0}" required></input>
                </div>
                    <!-- UACS Code -->
                    <div class="form-group col-lg-6 uacs-group">
                        <label for="uacs" class="label">UACS</label>
                        <input id="selectedUacs" class="form-control col-lg-12 mb-2 uacs-form" name="uacs"
                            placeholder="Enter Uacs Code" value="${d.uacs}" required></input>
                    
                        <!-- Debit and Credit form -->
                        <label for="debit" class="label">Debit</label>
                        <input type="text" id="selectedDebit" class="form-control col-lg-12 debit-form" name="debit"
                        placeholder="Enter Debit" value="${d.debit}" required>
                        
                    </div>
                    <!-- Account -->  
                    <div class="form-group col-lg-6 description-group">
                        <label for="description" class="label">Description</label>
                            <textarea name="text" id="selectedDescription" placeholder="Enter Account" rows="4" cols="90"
                                id="description" class="form-control col-lg-12 description-form" name="description">${d.description}</textarea>
                    </div>
                    <div class="form-group col-lg-12">
                    <hr>
                    </div>
                    `;
                    

        selectedInputFieldContainer.append(inputDiv);
            })
        } else if (result.status === 'unavailable') {
            alert('Someone is interacting with this record');
        }
    }
})


const selectedForm = document.getElementById('entry-selected-form');
selectedForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const text = "Are you sure you want to save it?";
    let confirmed = false; // Initialize confirmation flag to false

    const rows = document.querySelectorAll('#selectedJev');

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row && row.hasAttribute('data-id')) {
            const dateForm = row.querySelector('.date-form').value;
            const uacs = row.querySelector('.uacs-form').value;
            const description = row.querySelector('.description-form').value;
            const debit = row.querySelector('.debit-form').value;
            const inputDivId = row.getAttribute('data-id');

            const data = {
                dateForm,
                uacs,
                description,
                debit
            };
            console.log('ID: ' + inputDivId + '\n' +
                'dateForm:' + dateForm + '\n' +
                'uacs:' + uacs + '\n' +
                'description:' + description + '\n' +
                'debit:' + debit);

            if (!confirmed) { // Check if confirmation is not yet shown
                confirmed = confirm(text); // Show confirmation dialog and set flag to true
            }

            if (confirmed) { // Check if confirmation is true
                let insertUpdate = `/updateRecord/${inputDivId}`;

                const response = await fetch(insertUpdate, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })

                const status = await response.text();

                if (status == 'Success') {
                    
                } else {
                    alert('Error!');
                    console.log(error);
                }
            }
        } else {
            alert("row has no data-id");
        }
    }

    if (confirmed) { // Display success alert after loop completion
        alert('Record updated successfully');
        selectedModal.style.display = "none";
        removeFromMap(jevId);
    }
});

//TO MAKE THE MODAL AVAILABLE AGAIN AFTER USER CLOSE IT
async function removeFromMap(jevId){
    const _jevId = {jevId};
    const response = await fetch('/removeFromMap', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(_jevId)
    });
}

// FUNCTION FOR BUTTON IN CANCEL IF CANCEL BUTTON NOT WORKING
btnCancelSelected.onclick = function (e) {
    var bool = confirm("Are you sure you want to cancel?");
    if (bool == true) {
        modal.style.display = "none";
        selectedModal.style.display = "none";
        removeFromMap(jevId);
    } else {
        e.preventDefault();
    }
}
btnBackSelected = document.getElementById('btnBackSelected');
btnBackSelected.onclick = function (e) {
    selectedModal.style.display = "none";
    removeFromMap(jevId);
}