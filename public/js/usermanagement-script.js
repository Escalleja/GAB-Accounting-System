const socket = io.connect();

socket.emit('loadUsers')

function handleUserList(users){
    const userList = document.getElementById('user-content');
    userList.innerHTML = '';
    const myEmployeeId = localStorage.getItem('employeeId');
    
    users.forEach((user) => {
        if(user.employee_id != myEmployeeId){
            const tr = document.createElement('TR');
            tr.setAttribute('class', 'user');
            tr.setAttribute('data-id', `${user.employee_id}`);
            let isAdmin = '';        
            let delChecked = '';
            let delStatus = '';

            if(user.isAdmin){
                isAdmin = `<span class='admin-label'>(Admin)</span>`
                delStatus = `disabled`;
                if(user.isAction){
                    delChecked = `checked`;
                }
            }

            if(!user.isAdmin){
                if(user.isAction){
                    delChecked = `checked`;
                }
            }

            tr.innerHTML = `
                <td class="employee">
                    <div class="user-profile">
                        <i class="fa-solid fa-user"></i>
                    </div>

                    <div class="name-id">
                        <div class="name">
                            ${user.fName} ${user.lName} ${isAdmin}
                        </div>
                        <div class="employeeId">
                            ${user.employee_id}
                        </div>
                    </div>
                </td>

                <td>
                    <div id="delPermit" class="permission">
                        <input type="checkbox" ${delChecked}>
                    </div>
                </td>

                <td>
                    <div class="reset">
                        <button id="resetPass">Reset</button>
                    </div>
                </td>
                
                <td>
                    <div class="delete">
                        <button id="del-btn" ${delStatus}>
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            userList.prepend(tr);
        }
    })


const checkDelPermit = document.querySelectorAll("#delPermit");

checkDelPermit.forEach((check) => {
    check.addEventListener('change', async (e) => {
        const checkbox = e.target;
        const employeeId = checkbox.parentElement.parentElement.parentElement.dataset.id;
        
        const message = 'Are you sure you want to allow this user?'

        if(e.target.checked){
            if(confirm(message) === true){
                const response = await fetch(`/deletionPermit/${employeeId}`, {
                    method: 'GET',
                    headers: {'Content-Type' : 'application/json'}
                })
            }else{
                e.target.checked = false;
                return;
            }
        }else{
            const response = await fetch(`/removePermit/${employeeId}`, {
                method: 'GET',
                headers: {'Content-Type' : 'application/json'}
            })
        }
    })
})

const resetPassBtn = document.querySelectorAll('#resetPass');

resetPassBtn.forEach((reset) => {
    reset.addEventListener('click', async () => {
        const employeeId = reset.parentElement.parentElement.parentElement.dataset.id;
        const message = `Are you sure you want to reset ${employeeId}'s password?`;

        if(confirm(message) === true){
            const response = await fetch(`/resetpassword/${employeeId}`, {
                method: 'GET',
                headers: {'Content-Type' : 'application/json'}
            })

            const result = await response.json();

            if(result.status === 'reset'){
                alert('Password set back to default');
            }else{
                alert('Failed to reset');
            }
        }else{
            return;
        }
    })
})

const delAccButton = document.querySelectorAll('#del-btn');

delAccButton.forEach((acc) => {
    acc.addEventListener('click', async () => {
        const employeeId = acc.parentElement.parentElement.parentElement.dataset.id;
        const message = `Are you sure you want to remove user ${employeeId}`;

        if(confirm(message) === true){
            const response = await fetch(`/deleteAcc/${employeeId}`, {
                method: 'GET',
                headers: {'Content-Type' : 'application/json'}
            })

            const result = await response.json();

            if(result.status === 'deleted'){
                alert('User removed');
            }
        }else{
            return;
        }
    })
    
})

socket.on('updatePermitUI', (status, employeeId) => {
    checkDelPermit.forEach((check) => {
        const user = check.parentElement.parentElement.dataset.id;
        const checkbox = check.firstElementChild;

        if(user === employeeId && status === 'check'){
            if(!checkbox.checked){
                checkbox.checked = true;
            }
        }else if(user === employeeId && status === 'uncheck'){
            if(checkbox.checked){
                checkbox.checked = false;
            }
        }
    })
})

socket.on('deletedAcc', (id) => {
    const users = document.querySelectorAll('.user');

    users.forEach((user) => {
        const employeeId = user.dataset.id;

        if(employeeId === id){
            user.remove();
        }
    })
})
}
function handleNewUserList(user){
            const userList = document.getElementById('user-content');
            const tr = document.createElement('TR');
            tr.setAttribute('class', 'user');
            tr.setAttribute('data-id', `${user[0].employee_id}`);
            let isAdmin = '';        
            let delChecked = '';
            let delStatus = '';

            if(!user[0].isAdmin){
                isAdmin = `<span class='admin-label'>(Admin)</span>`
                delStatus = `disabled`;
                if(user[0].isAction){
                    delChecked = `checked`;
                }
            }

            if(!user[0].isAdmin){
                if(user[0].isAction){
                    delChecked = `checked`;
                }
            }

            tr.innerHTML = `
                <td class="employee">
                    <div class="user-profile">
                        <i class="fa-solid fa-user"></i>
                    </div>

                    <div class="name-id">
                        <div class="name">
                            ${user[0].fName} ${user[0].lName} ${isAdmin}
                        </div>
                        <div class="employeeId">
                            ${user[0].employee_id}
                        </div>
                    </div>
                </td>

                <td>
                    <div id="delPermit" class="permission">
                        <input type="checkbox" ${delChecked}>
                    </div>
                </td>

                <td>
                    <div class="reset">
                        <button id="resetPass">Reset</button>
                    </div>
                </td>
                
                <td>
                    <div class="delete">
                        <button id="del-btn" ${delStatus}>
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            userList.prepend(tr);
        }

const checkDelPermit = document.querySelectorAll("#delPermit");

checkDelPermit.forEach((check) => {
    check.addEventListener('change', async (e) => {
        const checkbox = e.target;
        const employeeId = checkbox.parentElement.parentElement.parentElement.dataset.id;
        
        const message = 'Are you sure you want to allow this user?'

        if(e.target.checked){
            if(confirm(message) === true){
                const response = await fetch(`/deletionPermit/${employeeId}`, {
                    method: 'GET',
                    headers: {'Content-Type' : 'application/json'}
                })
            }else{
                e.target.checked = false;
                return;
            }
        }else{
            const response = await fetch(`/removePermit/${employeeId}`, {
                method: 'GET',
                headers: {'Content-Type' : 'application/json'}
            })
        }
    })
})

const resetPassBtn = document.querySelectorAll('#resetPass');

resetPassBtn.forEach((reset) => {
    reset.addEventListener('click', async () => {
        const employeeId = reset.parentElement.parentElement.parentElement.dataset.id;
        const message = `Are you sure you want to reset ${employeeId}'s password?`;

        if(confirm(message) === true){
            const response = await fetch(`/resetpassword/${employeeId}`, {
                method: 'GET',
                headers: {'Content-Type' : 'application/json'}
            })

            const result = await response.json();

            if(result.status === 'reset'){
                alert('Password set back to default');
            }else{
                alert('Failed to reset');
            }
        }else{
            return;
        }
    })
})

const delAccButton = document.querySelectorAll('#del-btn');

delAccButton.forEach((acc) => {
    acc.addEventListener('click', async () => {
        const employeeId = acc.parentElement.parentElement.parentElement.dataset.id;
        const message = `Are you sure you want to remove user ${employeeId}`;

        if(confirm(message) === true){
            const response = await fetch(`/deleteAcc/${employeeId}`, {
                method: 'GET',
                headers: {'Content-Type' : 'application/json'}
            })

            const result = await response.json();

            if(result.status === 'deleted'){
                alert('User removed');
            }
        }else{
            return;
        }
    })
    
})

socket.on('updatePermitUI', (status, employeeId) => {
    const _employeeId = tr.dataset.id;

    const checkbox = checkDelPermit.firstElementChild;

    if(_employeeId === employeeId && status === 'check'){
        if(!checkbox.checked){
            checkbox.checked = true;
        }
    } else if(_employeeId === employeeId && status === 'uncheck'){
        if(checkbox.checked){
            checkbox.checked = false;
        }
    }
})

socket.on('deletedAcc', (id) => {
    const users = document.querySelectorAll('.user');

    users.forEach((user) => {
        const employeeId = user.dataset.id;

        if(employeeId === id){
            user.remove();
        }
    })
})


socket.on('userList', (users) => {
    handleUserList(users)
})

socket.on('newUser', (user) => {
    handleNewUserList(user)
})

const modal = document.getElementById('modal');
const addForm = document.getElementById('add-user-form');

const addUserBtn = document.getElementById('add-user');
addUserBtn.addEventListener('click', () => {
    modal.style.display = 'block';
})

const backButton = document.getElementById('back-btn');
backButton.addEventListener('click', () => {
    modal.style.display = 'none';
    addForm.reset();
})

const cancelBtn = document.getElementById('click', () => {
    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        addForm.reset();
    })
})

addForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const saveText = document.querySelector('#save .submit-btn-text');
    const loader = document.querySelector('#save .loader');

    saveText.style.display = 'none';
    loader.style.display = 'block';

    const fName = document.getElementById('firstname').value;
    const lName = document.getElementById('lastname').value;
    const employeeId = document.getElementById('employee-id').value;
    const admin = document.getElementById('adminCheck');
    const deletion = document.getElementById('deletionCheck');
    const accPassword = document.getElementById('password').value;
    const conPassword = document.getElementById('conPassword').value;
    let isAdminChecked = '';
    let isDeletionChecked = '';

    if(accPassword !== conPassword){
        e.preventDefault();
        alert("Password doesn't match!");
        saveText.style.display = 'block';
        loader.style.display = 'none';
        return;
    }

    if(admin.checked){
        isAdminChecked = '1';
    }

    if(deletion.checked){
        isDeletionChecked = '1';
    }

    const form = {fName, lName, employeeId, isAdminChecked, isDeletionChecked, accPassword};

    const response = await fetch('/addUser', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(form)
    })

    const result = await response.json();

    if(result.status === 'added'){
        alert('New account added successfully');
        modal.style.display = 'none';
        saveText.style.display = 'block';
        loader.style.display = 'none';
        addForm.reset();
    }else{
        alert(result.status);
        saveText.style.display = 'block';
        loader.style.display = 'none';
    }
})

const searchUser = document.getElementById('search-user');
let buttonSearch = document.getElementById('search-icon');

searchUser.addEventListener('click', () => {
    alert('This function is not available this time.');
    searchUser.disabled = true;
    buttonSearch.disabled = true;
})

buttonSearch.addEventListener('click', () => {
    alert('This function is not available this time.');
    searchUser.disabled = true;
    buttonSearch.disabled = true;
})