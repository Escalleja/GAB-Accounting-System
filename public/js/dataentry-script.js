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

btnCancel.onclick = function () {
    var bool = confirm("Are you sure you want to cancel?");
    if (bool == true) {
        modal.style.display = "none";
        selectedModal.style.display = "none";
    } else {
        event.preventDefault();
    }
}

// btnCancelSelected.onclick = function () {
//     var bool = confirm("Are you sure you want to cancel?");
//     if (bool == true) {
//         modal.style.display = "none";
//     } else {
//         event.preventDefault();
//     }
// }

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
    newDescriptionInput.innerHTML =    `
    <label for="description" class="label">Account</label> 
    <textarea name="text" id="description" rows="2" cols="65" id="description" class="form-control col-lg-8 mb-2 dynamic-input" name="description"></textarea>`;

    var newDebitInput = document.createElement('div');
    newDebitInput.className = 'form-group col-lg-12 debit-group';
    newDebitInput.innerHTML =  `
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
    const description = document.getElementById('description').value;
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

    const dataForm = {
        dateForm,
        uacs,
        description,
        debit,
        dynamicInputs: dynamicInputValue
    };

    if (confirm(text) == true) {

        let insertUpdate = isNewEntry ? '/newEntry' : '/updateRecord'; //TODO add isNewEntry and updateRecords

        const response = await fetch(insertUpdate, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
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
    const tableRow = document.createElement('tr');
    tableRow.setAttribute('class', 'table-content');

    tableRow.innerHTML = `
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
    tableContent.prepend(tableRow);
    }
});


//TO RETRIEVE SPECIFIC RECORD WHEN USER CLICKED
const tableContent = document.querySelectorAll('.table-content');
const entryForm = document.getElementById('entry-form');

//INITIALIZE INPUT 
const modalForm = document.querySelector('#selectedModalForm');

const selectedInputFieldContainer = document.getElementById('selectedInputFieldContainer');


socket.on('select', (data) => {

   /* const dateForm = document.getElementById('dateForm');
    const uacs = document.getElementById('uacs');
    const description = document.getElementById('description');
    const debit = document.getElementById('debit');
    DISPLAY MODAL
    modalForm.style.display = 'block'; */
    selectedInputFieldContainer.innerHTML = '';
    
    const selectedDateDiv = document.createElement('div');
    selectedDateDiv.setAttribute('class', 'form-row');

    selectedDateDiv.innerHTML=`                        
        <!-- Date -->
        <div class="form-group col-lg-12 date-group">
            <label for="selectedDateForm" class="label">Date mm/dd/yyyy</label>
            <input type="data" class="form-control col-lg-12 date-form" id="dateForm" name="dateForm"
                placeholder="Enter a Date" value="${data.recordset[0].date0}" required></input>
        </div>
    `;
    selectedInputFieldContainer.append(selectedDateDiv);

        data.recordset.forEach((d) => {
                modalForm.style.display = 'block';
                
                const inputDiv = document.createElement('div');
                inputDiv.setAttribute('class', 'form-row');

                inputDiv.innerHTML = `
                    <!-- UACS Code -->
                    <div class="form-group col-lg-6 uacs-group">
                        <label for="uacs" class="label">UACS</label>
                        <input id="uacs" class="form-control col-lg-12 mb-2 uacs-form" name="uacs"
                            placeholder="Enter Uacs Code" value="${d.uacs}" required></input>
                    
                    <!-- Debit and Credit form -->
                    <label for="debit" class="label">Debit</label>
                    <input type="text" id="debit" class="form-control col-lg-12 debit-form" name="debit"
                    placeholder="Enter Debit" value="${d.debit}" required>
                    </div>
                    <!-- Account -->  
                    <div class="form-group col-lg-6 description-group">
                        <label for="description" class="label">Description</label>
                            <textarea name="text" id="description" placeholder="Enter Account" rows="4" cols="90"
                                id="description" class="form-control col-lg-12" name="description">${d.description}</textarea>
                        </div>`;
                const hr = document.createElement('hr');
                selectedInputFieldContainer.appendChild(hr);
                selectedInputFieldContainer.append(inputDiv);

            })

            // FUNCTION FOR BUTTON IN CANCEL IF CANCEL BUTTON NOT WORKING
                btnCancelSelected.onclick = function (e) {
                    var bool = confirm("Are you sure you want to cancel?");
                    if (bool == true) {
                        modal.style.display = "none";
                        selectedModal.style.display = "none";

                    } else {
                        e.preventDefault();
                    }
                }

    /*COMMENT
    SET VALUE TO INPUT
    dateForm.value = data.recordset[0].date0;
    uacs.value = data.recordset[0].uacs;
    description.value = data.recordset[0].description;
    debit.value = data.recordset[0].debit; 


     for(let i = 1; i < rowCount; i++)
         var inputFieldContainer = document.getElementById('inputFieldContainer')
         var newRow = document.createElement('div');
         newRow.className = 'form-group col-lg-12';
    
        var newUacsInput = document.createElement('div');
        newUacsInput.className = 'form-row col-lg-12 uacs-group';
        newUacsInput.innerHTML = '<input id="uacs" class="form-control col-lg-8 mb-2 uacs-form dynamic-input" name="uacs" placeholder="Enter Uacs Code" required></input>';
    
         var newDescriptionInput = document.createElement('div');
         newDescriptionInput.className = 'form-row col-lg-12 description-group'
         newDescriptionInput.innerHTML = '<textarea name="text" id="description" placeholder="Enter Account" rows="2" cols="65" id="description" class="form-control col-lg-8 mb-2 dynamic-input" name="description"></textarea>';
    
         var newDebitInput = document.createElement('div');
         newDebitInput.className = 'form-row col-lg-12 debit-group';
         newDebitInput.innerHTML = '<input type="text" id="debit" class="form-control col-lg-8 mb-2 debit-form dynamic-input dynamic-input-debit" name="debit" placeholder="Enter Debit" required>';
    
         newDebitInput.querySelector('input').addEventListener('keyup', function (evt) {
             var n = parseFloat(this.value.replace(/\D/g, ''), 10);
             if (isNaN(n)) {
                 this.value = "";
                 this.placeholder = "Enter Debit";
             } else {
                 this.value = n.toLocaleString();
             }
         });

         newUacsInput.value = data.recordset[i].uacs;
         newDescriptionInput.value = data.recordset[i].description;
         newDebitInput.value = data.recordset[i].debit
         const divider = document.createElement('hr');

         newRow.appendChild(newUacsInput);
         newRow.appendChild(newDescriptionInput);
         newRow.appendChild(newDebitInput);
         newRow.appendChild(divider);

         inputFieldContainer.appendChild(newRow);
  
         //SET VALUE TO INPUT
         dateForm.value = data.recordset[0].date0;
         uacs.value = data.recordset[0].uacs;
         description.value = data.recordset[0].description;
         debit.value = data.recordset[0].debit
     } */
    
})

//TO DETECT WHICH RECORD IS BEING SELECTED 
for(let i = 0; i < tableContent.length; i++){
    
    const eachContent = document.querySelectorAll('.table-content')[i];

    //PREVENT CHECKBOX TO BE CLICKABLE
    document.querySelectorAll('#selected-item')[i].addEventListener('click', (e) => {
        e.stopPropagation();
    })

   eachContent.addEventListener('click', async (e) => {
    e.preventDefault();
    isNewEntry = false;
    const jevNo = eachContent.firstElementChild.textContent.trim();
    const jevRef = {jevNo};
    const response = await fetch('/selectRecord', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(jevRef)
    })
})
}
