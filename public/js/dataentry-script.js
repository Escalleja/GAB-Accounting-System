//#region
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
//#endregion
//TO STOP RECORD BEING USED AFTER REFRESHED

isRecordOpen();
async function isRecordOpen(){
    if(sessionStorage.getItem('recordOpen') === 'true' && sessionStorage.getItem('jevId') != null){

        const selectedModal = document.getElementById('selectedModalForm');
        
        const selectedInputFieldContainer = document.getElementById('selectedInputFieldContainer');
        
        const response = await fetch(`/selectRecord/${sessionStorage.getItem('jevId')}`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
        })
        
        const result = await response.json();
        
        if (result.status === 'data retrieved') {
            
            selectedModal.style.display = 'block';
            jevId = sessionStorage.getItem('jevId');
                sessionStorage.setItem('recordOpen', 'true');
                sessionStorage.setItem('jevId', `${jevId}`);

            result.data.recordset.forEach((d) => {

                // selectedModal.style.display = 'block';

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

                var fnf = document.getElementById("selectedDebit");
                fnf.addEventListener('keypress', function (e) {
                    
                    const key = e.key;
                    
                    if(/\d|\.|,/.test(key)) {
                        return true;
                    }
                
                    e.preventDefault();
                });
            })
        } else if (result.status === 'unavailable'){
            alert('Someone is interacting with this record');
        } else{
            alert('Something went wrong.');
            jevModal.style.display = 'none';
        }
            
    }
}

function clearDynamicInput() {
    var dynamicInput = document.querySelectorAll('.dynamic-input-field');

    dynamicInput.forEach(function(input) {
        input.parentNode.removeChild(input);
    });
}

// When the user clicks on the button, open the modal
btn.onclick = function () {
    jevModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.addEventListener('click', async (e) => {
    const text = "Are you sure you want to cancel?";

    if(confirm(text) === true){

        const response = await fetch(`/refJevDelete/${jevId}`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'}
        })

        clearDynamicInput();
        const result = await response.json();

        if(result.status === 'Success'){
            clearDynamicInput();
            formJev.reset();
            jevModal.style.display = "none";
            modal.style.display = "none";
        }
    }
})

//MODAL
jevSpan.onclick = function () {
    jevModal.style.display = "none";
    // isNewEntry = true
}

btnCancel.addEventListener('click', async (e) => {
    const text = "Are you sure you want to cancel?";

    if(confirm(text) === true){

        const response = await fetch(`/refJevDelete/${jevId}`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'}
        })
        clearDynamicInput();
        const result = await response.json();

        if(result.status === 'Success'){
            clearDynamicInput();
            form.reset();
            jevModal.style.display = "none";
            modal.style.display = "none";
        }
    }
})

//#region 
//FUNCTION FOR CREATING JEV NO.
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
    
    if (jevStatus === 'Success') {
        // formJev.style.display = "none";
        formJev.reset();
        jevModal.style.display = "none";
        modal.style.display = "block";
    }
    else if(jevStatus === 'Error'){
        alert('Something went wrong.');
        jevModal.style.display = 'none';
        formJev.style.display = 'none';
        modal.style.display = 'none';
    }
    else if(jevStatus === 'Primary Key already exists'){
        alert('JEV No. already exists');
        formJev.reset();
    }
})

//COMMA FOR CURRENCY INPUT FIELD
var fnf = document.getElementById("debit");
fnf.addEventListener('keypress', function (e) {
    
    const key = e.key;
    
    if(/\d|\.|,/.test(key)) {
        return true;
    }

    e.preventDefault();
});


// FUNCTION FOR ADDING INPUT FIELD DYNAMICALLY
document.getElementById("addInput").addEventListener('click', function (e) {
    e.preventDefault();
    var inputFieldContainer = document.getElementById('inputFieldContainer');

    var newRow = document.createElement('div');
    newRow.className = 'form-row col-lg-12 dynamic-input-field';

    var newDateInput = document.createElement('div');
    newDateInput.className = 'form-group col-lg-12 date-group';
    newDateInput.innerHTML = `
    <label for="dateForm" class="label dynamic-label">Date (mm/dd/yyyy)</label> 
    <input id="dateForm" class="form-control col-lg-6 mb-2 date-form dynamic-input" name="date" required></input>`;

    var newDescriptionInput = document.createElement('div');
    newDescriptionInput.className = 'form-group col-lg-6 description-group'
    newDescriptionInput.innerHTML = `
    <label for="description" class="label dynamic-label">Account</label> 
    <textarea name="text" id="description" rows="4" cols="90" id="description" class="form-control col-lg-12 mb-2 dynamic-input" name="description"></textarea>`;

    var newUacsDebitInput = document.createElement('div');
    newUacsDebitInput.className = 'form-group col-lg-6 debit-group';
    newUacsDebitInput.innerHTML = `
    <label for="uacs" class="label dynamic-label">UACS Code</label>
    <input id="uacs" class="form-control col-lg-12 uacs-form dynamic-input" name="uacs" required></input>


    <label for="debit" class="label dynamic-label">Debit</label> 
    <input type="text" id="debit" class="form-control col-lg-12 mb-2 debit-form dynamic-input dynamic-input-debit" name="debit" required> 
    <hr>`;

    const divider = document.createElement('hr');
    divider.className = 'form-row col-lg-12 dynamic-input-field';


    newRow.appendChild(newDateInput);
    newRow.appendChild(newUacsDebitInput);
    newRow.appendChild(newDescriptionInput);
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
        const row = Math.floor(index / 4);
        if (!acc[row]) {
            acc[row] = ['', '', '', ''];
        }
        acc[row][index % 4] = input.value;
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
            clearDynamicInput();
            form.reset();
            formJev.reset();
            modal.style.display = "none";
            jevModal.style.display = "none";
            
        }
    }
})
/*
//INITIALIZE SOCKET.IO
const socket = io.connect();

//TO HAVE A CONNECTION TO SERVER
socket.on('connect', () => {
    console.log('Successfully connected');
})

*/

//TO RETRIEVE SPECIFIC RECORD WHEN USER CLICKED
const tableContent = document.querySelectorAll('.table-content');
const entryForm = document.getElementById('entry-form');
const table = document.querySelector('#tbody-records');

//INITIALIZE INPUT 
const modalForm = document.querySelector('#selectedModalForm');

const selectedInputFieldContainer = document.getElementById('selectedInputFieldContainer');


//TO DETECT WHICH RECORD IS BEING SELECTED 
table.addEventListener('click', async (e) => {
    e.preventDefault();
    if (e.target && e.target.parentElement.nodeName === 'TR') {
        let row = e.target.parentElement;

        const existingInputFields = document.querySelectorAll('#selectedInputFieldContainer #selectedJev');
        existingInputFields.forEach(inputField => {
            inputField.remove();
        });

        //TODO HIDE ADD BUTTON
        const addBtn = document.getElementById('selectedAdd');

        // addBtn.style.display = "none";

        //TODO DISPLAY PRINT AND DELETE BUTTON

        const response = await fetch(`/selectRecord/${row.dataset.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const result = await response.json();

        if (result.status === 'data retrieved') {
            
            jevId = row.dataset.id;
            sessionStorage.setItem('recordOpen', 'true');
            sessionStorage.setItem('jevId', `${jevId}`);

            result.data.recordset.forEach((d) => {
                selectedModal.style.display = 'block';
                const inputDiv = document.createElement('div');
                inputDiv.setAttribute('class', 'form-row');
                inputDiv.setAttribute('id', 'selectedJev');
                inputDiv.setAttribute('data-id', d.ID);

                inputDiv.innerHTML = `
                <!-- Date -->
                <div class="form-group col-lg-12 date-group">
                    <label for="selectedDateForm" class="label">Date (mm/dd/yyyy)</label>
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

                    var fnf = document.getElementById("selectedDebit");
                    fnf.addEventListener('keypress', function (e) {
                        
                        const key = e.key;
                        
                        if(/\d|\.|,/.test(key)) {
                            return true;
                        }
                    
                        e.preventDefault();
                    });
            })
        } else if (result.status === 'unavailable') {
            alert('Someone is interacting with this record');
        } else{
            alert('Something went wrong.');
            jevModal.style.display = 'none';
        }
        
        const selectedDebit = document.getElementById('selectedDebit');
        selectedDebit.addEventListener('input', function (e) {
          const key = e.data;
          if (!/\d|\./.test(key)) {
            e.target.value = e.target.value.replace(key, '');
          }
        });

    }
})

//DYNAMICALLY ADDED INPUT FIELD IN EXISTING DATA
document.getElementById("selectedAdd").addEventListener('click', function (e) {
    e.preventDefault();
    var inputFieldContainer = document.getElementById('selectedInputFieldContainer');

    var newRow = document.createElement('div');
    newRow.className = 'form-row col-lg-12';

        var newDateInput = document.createElement('div');
        newDateInput.className = 'form-group col-lg-12 date-group';
        newDateInput.innerHTML = `
        <label for="dateForm" class="label">Date (mm/dd/yyyy)</label> 
        <input id="dateForm" class="form-control col-lg-6 mb-2 selected-date-form selected-dynamic-input" name="dateForm" required></input>`;

    
        var newDescriptionInput = document.createElement('div');
        newDescriptionInput.className = 'form-group col-lg-6 description-group'
        newDescriptionInput.innerHTML = `
        <label for="description" class="label">Account</label> 
        <textarea name="text" id="description" rows="4" cols="90" id="description" class="form-control col-lg-12 selected-dynamic-input selected-description-form" name="description"></textarea>`;

        var newUacsDebitInput = document.createElement('div');
        newUacsDebitInput.className = 'form-group col-lg-6 debit-group';
        newUacsDebitInput.innerHTML = `
        <label for="uacs" class="label">UACS Code</label>
        <input id="uacs" class="form-control col-lg-12 selected-uacs-form selected-dynamic-input"  name="uacs" required></input>

        <label for="debit" class="label">Debit</label> 
        <input type="text" id="debit" class="form-control col-lg-12 mb-2 selected-debit-form selected-dynamic-input dynamic-input-debit" name="debit" required> 
        `;


    const divider = document.createElement('hr');


    newRow.appendChild(newDateInput);
    newRow.appendChild(newUacsDebitInput);
    newRow.appendChild(newDescriptionInput);
    newRow.appendChild(divider);

    inputFieldContainer.appendChild(newRow);
});

const selectedForm = document.getElementById('entry-selected-form');
// FOR INSERTING A NEW DATA IN EXISTING JEV
selectedForm.addEventListener('submit', async (e) => {

    e.preventDefault();

   
})


//FOR UPDATING THE DATA IN EXISTING JEV
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
                    selectedModal.style.display = "none";
                    removeFromMap(jevId);
                    sessionStorage.removeItem('jevId');
                    sessionStorage.removeItem('recordOpen');
                } else {
                    alert('Something went wrong.');
                    selectedModal.style.display = "none";
                    removeFromMap(jevId);
                    sessionStorage.removeItem('jevId');
                    sessionStorage.removeItem('recordOpen');
                    console.log(error);
                }
            }
        } else {
            alert("Please try again.");
            selectedModal.style.display = "none";
            removeFromMap(jevId);
            sessionStorage.removeItem('jevId');
            sessionStorage.removeItem('recordOpen');
        }
    }

    if (confirmed) {
        const dateForm = document.querySelector('.selected-date-form').value;
        const uacs = document.querySelector('.selected-uacs-form').value;
        const description = document.querySelector('.selected-description-form').value;
        const debit = document.querySelector('.selected-debit-form').value;
    
        const dynamicInput = document.querySelectorAll('.selected-dynamic-input');
        const dynamicInputValue = Array.from(dynamicInput).reduce((acc, input, index) => {
            const row = Math.floor(index / 4);
            if(!acc[row]) {
                acc[row] = ['', '', '', ''];
            }
            acc[row][index % 4] = input.value;
            return acc;
        }, []);
    
        const data = {dateForm, uacs, description, debit, dynamicInput: dynamicInputValue};
    
        const response = await fetch(`/insertRecord`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        const status = await response.text();
    
        if(status === 'Success') {
            selectedModal.style.display = "none";
            removeFromMap(jevId);
            sessionStorage.removeItem('jevId');
            sessionStorage.removeItem('recordOpen');
        } else if(status === 'Failed') {
            selectedModal.style.display = "none";
            removeFromMap(jevId);
            sessionStorage.removeItem('jevId');
            sessionStorage.removeItem('recordOpen');
        } else{
            selectedModal.style.display = "none";
            removeFromMap(jevId);
            sessionStorage.removeItem('jevId');
            sessionStorage.removeItem('recordOpen');
            alert('Something went wrong.');
        }
        selectedModal.style.display = "none";
        removeFromMap(jevId);
        sessionStorage.removeItem('jevId');
        sessionStorage.removeItem('recordOpen');
    }
});

//TO MAKE THE MODAL AVAILABLE AGAIN AFTER USER CLOSE IT
async function removeFromMap(jevId) {
    const _jevId = {
        jevId
    };
    const response = await fetch('/removeFromMap', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(_jevId)
    });
}

window.addEventListener('beforeunload', async (e) => {
    const myJevId = jevId;
    console.log("myJevId: ", myJevId);
    const _jevId = {jevId: myJevId};
    
    const response = await fetch('/removeFromMap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(_jevId)
    })
})

// FUNCTION FOR SELECTED MODAL BUTTONS
btnCancelSelected.onclick = function (e) {
    var bool = confirm("Are you sure you want to cancel?");
    if (bool == true) {
        modal.style.display = "none";
        selectedModal.style.display = "none";
        removeFromMap(jevId);
        sessionStorage.removeItem('jevId');
        sessionStorage.removeItem('recordOpen');
    } else {
        e.preventDefault();
    }
}
btnBackSelected = document.getElementById('btnBackSelected');
btnBackSelected.onclick = function (e) {
    selectedModal.style.display = "none";
    removeFromMap(jevId);
    sessionStorage.removeItem('jevId');
    sessionStorage.removeItem('recordOpen');
}
//#endregion
btnDelBtn = document.getElementById('del-btn');
btnDelBtn.addEventListener('click', async () => {
    
    const response = await fetch(`/authDelete`, {
        method: 'GET',
        headers: {'Content-Type' : 'application/json'}
    })

    const result = await response.json();

    if(result.status === 'authorized'){
        let message = "Are you sure you want to delete this record?";
        
        if(confirm(message) === true) {
            const response = await fetch(`/jevDelete/${jevId}`, {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json'}
            })

            const result = await response.json();
            if(result.status === 'Success'){
                alert('Record Deleted');
                removeFromMap(jevId);
                sessionStorage.removeItem('jevId');
                sessionStorage.removeItem('recordOpen');
                selectedModal.style.display = "none";
            } else{
                removeFromMap(jevId);
                alert('Deletion Failed');
                sessionStorage.removeItem('jevId');
                sessionStorage.removeItem('recordOpen');
                selectedModal.style.display = "none";
            }
        }
    }
    else {
        alert("You are not authorized to make this action.");
        selectedModal.style.display = "block";
    }
})