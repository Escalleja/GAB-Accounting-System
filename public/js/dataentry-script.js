//get jev modal
var jevModal = document.getElementById("jevModalForm")

// Get the modal
var modal = document.getElementById("modalForm");

// Get the button that opens the modal
var btn = document.getElementById("btnNewEntry");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("btnBack")[0];

var jevSpan = document.getElementsByClassName("btnBackJev")[0];

// Get the <span> element that closes the modal
var btnCancel = document.getElementsByClassName("btnCancel")[0];

var addBtn = document.getElementById('addInput');

var inputFieldContainer = document.getElementById('inputFieldContainer');

// When the user clicks on the button, open the modal
btn.onclick = function () {
    jevModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
    // var bool = confirm("Are you sure you want to cancel?");
    // if(bool == true){
    //     modal.style.display = "none";
    // }
    // else{
    //     event.preventDefault();
    // }
}

jevSpan.onclick = function () {
    jevModal.style.display = "none";
}

btnCancel.onclick = function () {
    var bool = confirm("Are you sure you want to cancel?");
    if(bool == true){
        modal.style.display = "none";
    }
    else{
        event.preventDefault();
    }
}

//Function for creating jev
const formJev = document.getElementById('create-jev');

formJev.addEventListener('submit', async (e) => {
    e.preventDefault();

    const jevInput = document.getElementById('jevInput').value;

    const jevDataForm = {jevInput};

    const jevResponse = await fetch('/jevHomepage', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(jevDataForm)
    })
    const jevStatus = await jevResponse.text();

    if(jevStatus == 'Success'){
        modal.style.display = "block";
        formJev.reset();
    }
})
// Added input field dynamically function front-end
document.getElementById("addInput").addEventListener('click', function(e) {
    e.preventDefault();
    var inputFieldContainer = document.getElementById('inputFieldContainer');

    var newRow = document.createElement('div');
    newRow.className = 'form-group col-lg-12';

    var newUacsInput = document.createElement('div');
    newUacsInput.className = 'form-row col-lg-12 uacs-group';
    newUacsInput.innerHTML = '<input id="uacs" class="form-control col-lg-8 mb-2 uacs-form dynamic-input" name="uacs" placeholder="Enter Uacs Code"></input>';

    var newDescriptionInput = document.createElement('div');
    newDescriptionInput.className = 'form-row col-lg-12 description-group'
    newDescriptionInput.innerHTML = '<textarea name="text" id="description" placeholder="Enter Account" rows="2" cols="65" id="description" class="form-control col-lg-8 mb-2 dynamic-input" name="description"></textarea>';
    
    var newDebitInput = document.createElement('div');
    newDebitInput.className = 'form-row col-lg-12 debit-group';
    newDebitInput.innerHTML = '<input type="text" id="debit" class="form-control col-lg-8 mb-2 debit-form dynamic-input" name="debit" placeholder="Enter Debit">';
    newDebitInput.toLocaleString();

    const divider = document.createElement('hr');


    newRow.appendChild(newUacsInput);
    newRow.appendChild(newDescriptionInput);
    newRow.appendChild(newDebitInput);
    newRow.appendChild(divider);

    inputFieldContainer.appendChild(newRow);
});

//Function for new entry
const form = document.getElementById('entry-form');

form.addEventListener('submit', async (e) => {
e.preventDefault();

const dateForm = document.getElementById('dateForm').value;
const uacs = document.getElementById('uacs').value;
const description = document.getElementById('description').value;
const debit = document.getElementById('debit').value;

// THIS DYNAMIC INPUT IS A FUNCTION FOR ADDED INPUT FIELD TO STORE IN DATABASE
const dynamicInputs = document.querySelectorAll('.dynamic-input');
const dynamicInputValue = Array.from(dynamicInputs).reduce((acc, input, index) => {
    const row = Math.floor(index / 3);
    if (!acc[row]){
        acc[row] = ['', '', ''];
    }
    acc[row][index % 3] = input.value;
    return acc;
    }, []);

const dataForm = {dateForm, uacs, description, debit, dynamicInputs: dynamicInputValue};

const response = await fetch('/newEntry', {
method: 'POST',
headers: {'Content-Type' : 'application/json'},
body: JSON.stringify(dataForm) 
})

const status = await response.text();

if(status == 'Success'){
form.reset();
modal.style.display = "none";
jevModal.style.display = "none";
}
})