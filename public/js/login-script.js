const form = document.getElementById('login-form');
const submitBtn = document.getElementById('submit-btn');
const message = document.querySelector('.invalid-error');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

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
        window.location.href = result.redirect;
    }
})