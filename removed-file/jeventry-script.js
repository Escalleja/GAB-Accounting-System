        //get the enter jev form modal

        var jevModal = document.getElementById("modal-form-create-jev");
        
        //span back button of jev modal
        var jevSpan = document.getElementsByClassName("btnBackJev")[0];

        // Get the modal
        var modal = document.getElementById("modalForm");

        // Get the button that opens the modal
        var btn = document.getElementById("btnNewEntry");

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("btnBack")[0];

        // Get the <span> element that closes the modal
        var btnCancel = document.getElementsByClassName("btnCancel")[0];

const jevForm = document.getElementById('create-jev');

jevForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const jevForm0 = document.getElementById('jevForm').value;

    const jevData = {jevForm0};

    console.log(jevData);
    
    const jevResponse = await fetch('/jevHomepage', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(jevData)
    })
    const statusJev = await jevResponse.text();

    if(statusJev == 'Success'){
        jevModal.style.display = "none";
        modal.style.display = "block";
    }

})