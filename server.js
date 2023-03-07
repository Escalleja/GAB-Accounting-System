const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
require('dotenv').config();
const port = process.env.DB_ACCOUNTING_PORT;
const login = require('./middlewares/login');
const homepage = require('./middlewares/homepage');

//Securing files    
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// SETTING VIEW ENGINE TO EJS TEMPLATE, ALL FILE WITH EJS EXTENSION NAME WILL RENDER
app.set('view engine', 'ejs')

//Middleware Initialized
app.get('/', login);        
app.post('/auth', login);
app.get('/homepage', homepage);
app.get('/logout', homepage);
    //TODO add the other later

app.listen(port, () =>{
    console.log(`Server is running on port: ${port}`);
});



