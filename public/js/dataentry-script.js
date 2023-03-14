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
    modal.style.display = "block";
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
    }
})

addBtn.addEventListener('click', (e) =>{
    e.preventDefault();

    const copyUacsInput = document.getElementById('uacs').cloneNode(true);
    const copyDescriptionInput = document.getElementById('description').cloneNode(true);
    const copyDebitInput = document.getElementById('debit').cloneNode(true);   
    
    copyUacsInput.setAttribute('name', 'uacs[]');
    copyDescriptionInput.setAttribute('name', 'description[]');
    copyDebitInput.setAttribute('name', 'debit[]');

    copyUacsInput.classList.add('form-control', 'col-lg-6', 'mb-1');
    copyDescriptionInput.classList.add('form-control', 'col-lg-12', 'mb-1');
    copyDebitInput.classList.add('form-control', 'col-lg-6', 'mb-1');

    inputFieldContainer.appendChild(copyUacsInput);
    inputFieldContainer.appendChild(copyDescriptionInput);
    inputFieldContainer.appendChild(copyDebitInput); 

    let divider = document.createElement('hr');
    inputFieldContainer.appendChild(divider);
})

//Function for new entry
const form = document.getElementById('entry-form');

form.addEventListener('submit', async (e) => {
e.preventDefault();

const dateForm = document.getElementById('dateForm').value;
const uacs = document.getElementById('uacs').value;
const description = document.getElementById('description').value;
const debit = document.getElementById('debit').value;
// document.querySelectorAll().values

const dataForm = {dateForm, uacs, description, debit};

const response = await fetch('/newEntry', {
method: 'POST',
headers: {'Content-Type' : 'application/json'},
body: JSON.stringify(dataForm) 
})

const status = await response.text();

if(status == 'Success'){
modal.style.display = "none";
jevModal.style.display = "none";
}
})