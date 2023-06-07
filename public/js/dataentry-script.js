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

let jevId;
//#endregion

//#region TO STOP RECORD BEING USED AFTER REFRESHED
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
            clearDynamicInput();
            jevId = sessionStorage.getItem('jevId');
            sessionStorage.setItem('recordOpen', 'true');
            sessionStorage.setItem('jevId', `${jevId}`);

            result.data.recordset.forEach((d) => {
                selectedModal.style.display = 'block';
                const inputDiv = document.createElement('div');
                inputDiv.setAttribute('class', 'form-row');
                inputDiv.setAttribute('id', 'selectedJev');
                inputDiv.setAttribute('data-id', d.ID);

                inputDiv.innerHTML = `
                <!-- Date and UACS -->
                <div class="form-group col-lg-6 date-group">
                    <label for="selectedDateForm" class="label mb-0">Date (mm/dd/yyyy)</label>

                    <input type="text" class="form-control col-lg-12 mb-2 date-form" id="selectedDateForm" name="selectedDateForm"
                    value="${d.date0}" required></input>

                    <label for="uacs" class="label">UACS</label>
                    <input type="text" id="selectedUacs" class="form-control col-lg-12 mb-0 uacs-form" name="uacs"
                    value="${d.uacs}" required></input>
                </div>

                <!-- Account -->  
                <div class="form-group col-lg-6 description-group">
                    <label for="description" class="label">Account</label>

                    <textarea name="text" rows="4" cols="90" id="selectedDescription" class="form-control col-lg-12 description-form" name="description">${d.description}</textarea>
                </div>
                
                <!-- Debit -->
                <div class="form-group col-lg-6 debit-group mb-0 mt-0">
                    <label for="debit" class="label">Debit</label>
                    
                    <input id="selectedDebit" class="form-control col-lg-12 debit-form" name="debit" value="${d.debit}"></input>
                </div>

                <!-- Credit -->
                <div class="form-group col-lg-6 credit-data">
                    <label for="credit" class="label">Credit</label>
                    
                    <input id="selectedCredit" class="form-control col-lg-12 credit-form" name="credit"
                    value="${d.credit}"></input>
                </div>

                <!-- Delete Button -->
                <div class="form-group col-lg-12 delete-btn" style="padding: 0 25px">
                    <button id="deleteBtn" class="delete-button">Delete</button>
                </div>

                    <div class="form-group col-lg-12">
                    <hr>
                    </div>
                    `;
                
                    selectedInputFieldContainer.append(inputDiv);

            })
        } else if (result.status === 'unavailable') {
            alert('Someone is interacting with this record');
        } else{
            alert('Something went wrong.');
            jevModal.style.display = 'none';
        }
            
    }
}
//#endregion

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

//#region THIS IS FOR DEBIT CREDIT INPUT ACCEPTED VALUES 
//COMMA FOR CURRENCY INPUT FIELD
var fnf = document.getElementById("debit");
var credit = document.getElementById("credit");
fnf.addEventListener('keypress', function (e) {
    const key = e.key;
    if(/\d|\.|,/.test(key)) {
        return true;
    }
    e.preventDefault();
});
credit.addEventListener('keypress', function (e) {
    const key = e.key;
    if(/\d|\.|,/.test(key)) {
        return true;
    }
    e.preventDefault();
})
//#endregion

//#region FUNCTION FOR ADDING INPUT FIELD DYNAMICALLY
document.getElementById("addInput").addEventListener('click', function (e) {
    e.preventDefault();
    var inputFieldContainer = document.getElementById('inputFieldContainer');

    var newRow = document.createElement('div');
    newRow.className = 'form-row col-lg-12 dynamic-input-field';

    var newDateUacsInput = document.createElement('div');
    newDateUacsInput.className = 'form-group col-lg-6 date-group';
    newDateUacsInput.innerHTML = `
    <label for="dateForm" class="label dynamic-label">Date (mm/dd/yyyy)</label> 
    <input id="dateForm" class="form-control col-lg-12 mb-0 date-form dynamic-input" name="date" required></input>
    
    <label for="uacs" class="label dynamic-label">UACS Code</label>
    <input id="uacs" class="form-control col-lg-12 uacs-form mb-2 dynamic-input" name="uacs" required></input>`;

    var newDescriptionInput = document.createElement('div');
    newDescriptionInput.className = 'form-group col-lg-6 description-group'
    newDescriptionInput.innerHTML = `
    <label for="description" class="label dynamic-label">Account</label> 
    <textarea name="text" id="description" rows="4" cols="90" id="description" class="form-control col-lg-12 mb-2 dynamic-input" name="description"></textarea>`;

    var newDebitInput = document.createElement('div');
    newDebitInput.className = 'form-group col-lg-6 debit-group';
    newDebitInput.innerHTML = `
    <label for="debit" class="label dynamic-label">Debit</label> 
    <input type="text" id="debit" class="form-control ol-lg-12 debit-form dynamic-input dynamic-input-debit" name="debit"></input>`;

    var newCreditInput = document.createElement('div');
    newCreditInput.className = 'form group col-lg-6 credit-group'
    newCreditInput.innerHTML = `
    <label for="credit" class="label dynamic-label">Credit</label>
    <input type="text" id="credit" class="form-control col-lg-12 credit-form dynamic-input dynamic-input-credit" name="credit"></input>
    `

    const divider = document.createElement('hr');
    divider.className = 'form-row col-lg-12 dynamic-input-field';


    newRow.appendChild(newDateUacsInput);
    newRow.appendChild(newDescriptionInput);
    newRow.appendChild(newDebitInput);
    newRow.appendChild(newCreditInput);
    newRow.appendChild(divider);

    inputFieldContainer.appendChild(newRow);
});
//#endregion

//#region FUNCTION FOR NEW ENTRY OF JEV

const form = document.getElementById('entry-form');
const preloader = document.querySelector('.loader');
let saveText = document.querySelector('.save-text');
let saveBtn = document.getElementById('save');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const text = "Are you sure you want to save?";
    preloader.style.display = 'block';
    saveText.style.display = 'none';
    saveBtn.disabled = true;

    const dateForm = document.getElementById('dateForm').value;
    const uacs = document.getElementById('uacs').value;
    let description = document.getElementById('description').value;
    const debit = document.getElementById('debit').value;
    let credit = document.getElementById('credit').value;

    // THIS DYNAMIC INPUT IS A FUNCTION FOR ADDED INPUT FIELD TO STORE IN DATABASE
    const dynamicInputs = document.querySelectorAll('.dynamic-input');
    const dynamicInputValue = Array.from(dynamicInputs).reduce((acc, input, index) => {
        const row = Math.floor(index / 5);
        if (!acc[row]) {
            acc[row] = ['', '', '', '', ''];
        }
        acc[row][index % 5] = input.value;
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
        credit,
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
            preloader.style.display = 'none';
            saveText.style.display = 'block';
            saveBtn.disabled = false;
        }else{
            return;
        }
    }
})


//#endregion

//TO RETRIEVE SPECIFIC RECORD WHEN USER CLICKED
let table = document.querySelector('#tbody-records');

//INITIALIZE INPUT 
const modalForm = document.querySelector('#selectedModalForm');

const selectedInputFieldContainer = document.getElementById('selectedInputFieldContainer');

//#region TO DETECT WHICH RECORD IS BEING SELECTED 
table.addEventListener('click', async (e) => {
    if (e.target && e.target.parentElement.nodeName === 'TR') {
        let row = e.target.parentElement;

        const existingInputFields = document.querySelectorAll('#selectedInputFieldContainer #selectedJev');
        existingInputFields.forEach(inputField => {
            inputField.remove();
        });

        const response = await fetch(`/selectRecord/${row.dataset.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const result = await response.json();

        if (result.status === 'data retrieved') {
            clearDynamicInput();
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
                <!-- Date and UACS -->
                <div class="form-group col-lg-6 date-group">
                    <label for="selectedDateForm" class="label mb-0">Date (mm/dd/yyyy)</label>

                    <input type="text" class="form-control col-lg-12 mb-2 date-form" id="selectedDateForm" name="selectedDateForm"
                    value="${d.date0}" required></input>

                    <label for="uacs" class="label">UACS</label>
                    <input type="text" id="selectedUacs" class="form-control col-lg-12 mb-0 uacs-form" name="uacs"
                    value="${d.uacs}" required></input>
                </div>

                <!-- Account -->  
                <div class="form-group col-lg-6 description-group">
                    <label for="description" class="label">Account</label>

                    <textarea name="text" rows="4" cols="90" id="selectedDescription" class="form-control col-lg-12 description-form" name="description">${d.description}</textarea>
                </div>
                
                <!-- Debit -->
                <div class="form-group col-lg-6 debit-group mb-0 mt-0">
                    <label for="debit" class="label">Debit</label>
                    
                    <input id="selectedDebit" class="form-control col-lg-12 debit-form" name="debit" value="${d.debit}"></input>
                </div>

                <!-- Credit -->
                <div class="form-group col-lg-6 credit-data">
                    <label for="credit" class="label">Credit</label>
                    
                    <input id="selectedCredit" class="form-control col-lg-12 credit-form" name="credit"
                    value="${d.credit}"></input>
                </div>

                <!-- Delete Button -->
                <div class="form-group col-lg-12 delete-btn" style="padding: 0 25px">
                    <button id="deleteBtn" class="delete-button">Delete</button>
                </div>

                    <div class="form-group col-lg-12">
                    <hr>
                    </div>
                    `;
                
                    selectedInputFieldContainer.append(inputDiv);

            })
        } else if(result.status === 'unavailable') {
            alert('Someone is interacting with this record');
        } else if(result.status === 'Failed'){
            alert('This jev is empty. Please delete and recreate it.');
            return;
        }
        
    }
})

//#region FOR DELETING ROW 
selectedInputFieldContainer.addEventListener('click', (e) => {
    const deleteButton = e.target.closest('.delete-button');
    if (deleteButton) {
      e.preventDefault();
      const rowElement = deleteButton.closest('.form-row');
      const rowId = rowElement.getAttribute('data-id');
      deleteRow(rowId);
    }
  });


async function deleteRow(rowId){
    const message= "Are you sure you want to delete this row?";

    if(confirm(message)){
        const jev = sessionStorage.getItem('jevId');
        const _jev = {jev};

        const response = await fetch(`/deleteRow/${rowId}`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify(_jev)
        });

        const result = await response.json();

        if(result.status === 'Success'){
            // Removing in UI 
            alert("Row Deleted");
            const rowElement = document.querySelector(`#selectedJev[data-id="${rowId}"]`);
            if(rowElement){
                rowElement.remove();
            }
        } else{
            alert('Failed to delete');
        }
    } else {

    }
}

//#endregion 

//#endregion
let forInsert = false;
//#region DYNAMICALLY ADDED INPUT FIELD IN EXISTING DATA
document.getElementById("selectedAdd").addEventListener('click', function (e) {
    forInsert = true;
    e.preventDefault();
    var inputFieldContainer = document.getElementById('selectedInputFieldContainer');
    
    var newRow = document.createElement('div');
    newRow.className = 'form-row col-lg-12 dynamic-input-field';
    
    var newDateUacsInput = document.createElement('div');
    newDateUacsInput.className = 'form-group col-lg-6 date-group';
    newDateUacsInput.innerHTML = `
    <label for="selectedDateForm" class=" label dynamic-label mb-0">Date (mm/dd/yyyy)</label> 
    
        <input type="text" class="form-control  col-lg-12 mb-2 selected-date-form selected-dynamic-input" id="insertedDate" name="selectedDateForm" required></input>
        
        <label for="uacs" class="label">UACS Code</label>
        
        <input type="text" id="insertedUacs" class="form-control col-lg-12  selected-uacs-form selected-dynamic-input" name="uacs" required></input>`;
    
        var newDescriptionInput = document.createElement('div');
        newDescriptionInput.className = 'form-group col-lg-6 description-group'
        newDescriptionInput.innerHTML = `
        <label for="description" class="label">Account</label> 
        
        <textarea name="text" id="insertedDescription" class="form-control  col-lg-12 selected-dynamic-input  selected-description-form" rows="4" cols="90" name="description"></textarea>`;
        
        var newDebitInput = document.createElement('div');
        newDebitInput.className = 'form-group col-lg-6 debit-group';
        newDebitInput.innerHTML = `
        <label for="debit" class="label">Debit</label> 
        
        <input id="insertedDebit" class="form-control col-lg-12 selected-debit-form selected-dynamic-input" name="debit"></input> 
        `;
        
        var newCreditInput = document.createElement('div');
        newCreditInput.className = 'form-group col-lg-6 description-group'
        newCreditInput.innerHTML = `
        <label for="credit" class="label">Credit</label>
        
        <input id="insertedCredit" class="form-control col-lg-12 selected-credit-form selected-dynamic-input" name="credit"></input>
        `;
        
        const divider = document.createElement('hr');
    divider.className = 'form-row col-lg-12 dynamic-input-field';

        newRow.appendChild(newDateUacsInput);
        newRow.appendChild(newDescriptionInput);
        newRow.appendChild(newDebitInput);
        newRow.appendChild(newCreditInput);
        newRow.appendChild(divider);
        
        let selectedDebit = document.getElementById('debit');
        selectedDebit.addEventListener('input', function (e) {
            const key = e.data;
            if (!/\d|\./.test(key)) {
            e.target.value = e.target.value.replace(key, '');
          }
        }); 
        let credit = document.getElementById("credit");
        credit.addEventListener('input', function (e) {
            const key = e.data;
            if(/\d|\.|,/.test(key)) {
                e.target.value = e.target.value.replace(key, '');
            }
        });

        inputFieldContainer.appendChild(newRow);
        
});
//#endregion

//#region FOR UPDATING AND INSERTING THE DATA IN EXISTING JEV
const selectedForm = document.getElementById('entry-selected-form');
selectedForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const preloader = document.querySelector('.loader');
    const saveText = document.querySelector('.save-btn-text');
    const saveBtn = document.getElementById('selectedSave');
    const text = "Are you sure you want to save it?";

    if (confirm(text)){
        preloader.style.display = 'block';
        saveText.style.display = 'none';
        saveBtn.disabled = true;
        if (forInsert) {
            const dateForm = document.querySelector('#insertedDate').value;
            const uacs = document.querySelector('#insertedUacs').value;
            const description = document.querySelector('#insertedDescription').value;
            const debit = document.querySelector('#insertedDebit').value;
            const credit = document.querySelector('#insertedCredit').value;

            const dynamicInput = document.querySelectorAll('.selected-dynamic-input');
            const dynamicInputValue = Array.from(dynamicInput).reduce((acc, input, index) => {
                const row = Math.floor(index / 5);
                if(!acc[row]) {
                    acc[row] = ['', '', '', '', ''];
                }
                acc[row][index % 5] = input.value;
                return acc;
            }, []);
            
            const data = {
                dateForm, uacs, description, debit, credit, dynamicInput: dynamicInputValue
            }

            const response = await fetch(`/insertRecord`, {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(data)
            })
            const result = await response.json();

            if(result.status === 'Success'){
                removeFromMap(jevId);
                sessionStorage.removeItem('jevId');
                sessionStorage.removeItem('recordOpen');
                selectedModal.style.display = "none";
                preloader.style.display = 'none';
                saveText.style.display = 'block';
                saveBtn.disabled = false;
            }else{
                removeFromMap(jevId);
                sessionStorage.removeItem('jevId');
                sessionStorage.removeItem('recordOpen');
                selectedModal.style.display = "none";
                alert('Something went wrong.');
                preloader.style.display = 'none';
                saveText.style.display = 'block';
                saveBtn.disabled = false;
            }
        }else {
            const rows = document.querySelectorAll('#selectedJev');

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];

                if (row && row.hasAttribute('data-id')) {
                    const dateForm = row.querySelector('.date-form').value;
                    const uacs = row.querySelector('.uacs-form').value;
                    const description = row.querySelector('.description-form').value;
                    const debit = row.querySelector('.debit-form').value;
                    const credit = row.querySelector('.credit-form').value;
                    const inputDivId = row.getAttribute('data-id');

                    const data = {
                        dateForm, uacs, description, debit, credit
                    };

                    const response = await fetch (`/updateRecord/${inputDivId}`, {
                        method: 'POST',
                        headers: {'Content-Type' : 'application/json'},
                        body: JSON.stringify(data)
                    })

                    const result = await response.json();

                    if(result.status === 'Success'){
                        removeFromMap(jevId);
                        sessionStorage.removeItem('jevId');
                        sessionStorage.removeItem('recordOpen');
                        selectedModal.style.display = "none";
                        preloader.style.display = 'none';
                        saveText.style.display = 'block';
                        saveBtn.disabled = false;
                    }else{
                        removeFromMap(jevId);
                        sessionStorage.removeItem('jevId');
                        sessionStorage.removeItem('recordOpen');
                        selectedModal.style.display = "none";
                        alert('Something went wrong.');
                        preloader.style.display = 'none';
                        saveText.style.display = 'block';
                        saveBtn.disabled = false;
                    }
                }
            }
        }
    }
})
// #endregion

//#region TO MAKE THE MODAL AVAILABLE AGAIN AFTER USER CLOSE IT
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
//#endregion

//#region FUNCTION FOR SELECTED MODAL BUTTONS
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
//#endregion