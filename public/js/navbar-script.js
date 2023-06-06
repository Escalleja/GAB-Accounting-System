const userMngAnchor = document.getElementById('user-management');
const homeAnchor = document.getElementById('home');

const isAdmin = document.cookie.replace('isAdmin=', '');

if(isAdmin === 'false'){
    userMngAnchor.style.display = 'none';
}

const searchBtn = document.getElementById('search');
searchBtn.addEventListener('submit', async (e) => {
    e.preventDefault();

    const termSearch = document.getElementById('search-record').value;
    alert(termSearch);
    if (termSearch === ''){
        return;
    }

    const response = await fetch(`/searchRecord/${termSearch}`, {
        method: 'GET',
        headers: { 'Content-Type' :'application/json' }
    })

    const result = await response.json();

    if(result.status === 'Success'){
        search.reset();
    }
})

const changePassBtn = document.getElementById('changePasswordBtn');
const passContainer = document.querySelector('.pass-container');
const changePassForm = document.getElementById('changePasswordForm');

changePassBtn.addEventListener('click', () => {
    passContainer.style.display = 'block';
})

const cancelPassBtn = document.getElementById('cancelChangePass');
cancelPassBtn.addEventListener('click', () => {
    passContainer.addEventListener = 'none';
    changePassForm.reset();
})

changePassForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = `Are you sure you want to change your password?`;

    if(confirm(message) === true){
        const currentPass = document.getElementById('currentPass').value;
        const newPass = document.getElementById('newPass').value;
        const conPass = document.getElementById('confPass').value;

        const form = {currentPass, newPass}

        if(newPass !== conPass){
            alert("Password doesn't match");
        }else{
                const response = await fetch('/changePass', {
                    method: 'POST',
                    headers: {'Content-Type' : 'application/json'},
                    body: JSON.stringify(form)
                })
            
            const result = await response.json();
            if(result.status === 'changed'){
                alert('Password changed successfully.');
                passContainer.style.display = 'none';
            }else if(result.status === 'invalid'){
                alert('The current password you entered is invalid.');
                changePassForm.reset();
                return;
            }else{
                alert('Something went wrong.');
            }
        }
    }else{
        return;
    }


})