const socket = io();

const form = document.getElementById('login-form');
const submitBtn = document.getElementById('submit-btn');
const message = document.querySelector('.invalid-error');
const preloader = document.querySelector('.loader');
const loginText = document.querySelector('.login-btn-text');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    preloader.style.display = 'block';
    loginText.style.display = 'none';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const dataForm = {username, password};

    const response = await fetch ('/auth', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(dataForm)
    });

    const result = await response.json();

    if(result.redirect === 'invalid'){
        message.textContent =  'Invalid username or password';
    } else{
        socket.emit('loadUsers');
        sessionStorage.setItem('sessionId', `${result.sessionId}`)
        localStorage.setItem('employeeId', result.id);
        document.cookie = 'isAdmin=' + result.isAdmin;
        window.location.href = result.redirect;
    }

    preloader.style.display = 'none';
    loginText.style.display = 'block';
})