        // Get the modal
        var modal = document.getElementById("modalForm");

        // Get the button that opens the modal
        var btn = document.getElementById("btnNewEntry");

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("btnBack")[0];

        // Get the <span> element that closes the modal
        var btnCancel = document.getElementsByClassName("btnCancel")[0];

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
        btnCancel.onclick = function () {
            var bool = confirm("Are you sure you want to cancel?");
            if(bool == true){
                modal.style.display = "none";
            }
            else{
                event.preventDefault();
            }
        }

const form = document.getElementById('entry-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dateForm = document.getElementById('dateForm').value;
    const uacs = document.getElementById('uacs').value;
    const jev = document.getElementById('jev').value;
    const description = document.getElementById('description').value;
    const debit = document.getElementById('debit').value;
    const credit = document.getElementById('credit').value;

    const dataForm = {dateForm, uacs, jev, description, debit, credit};

    const response = await fetch('/newEntry', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(dataForm) 
    })

    const status = await response.text();

    if(status == 'Success'){
        modal.style.display = 'none';
    }
})