const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
require('dotenv').config();
const port = process.env.DB_ACCOUNTING_PORT;
const login = require('./middlewares/login');
const homepage = require('./middlewares/homepage');
const assetPage = require('./middlewares/asset');
const equityPage = require('./middlewares/equity');
const expensesPage = require('./middlewares/expenses');
const liabilitiesPage = require('./middlewares/liabilities');
const revenuePage = require('./middlewares/revenue');
const dataEntry = require('./middlewares/dataEntry');
const bodyParser = require('body-parser');



//Securing files    
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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
app.get('/asset', assetPage);
app.get('/equity', equityPage);
app.get('/expenses', expensesPage);
app.get('/liabilities', liabilitiesPage);
app.get('/revenue', revenuePage);
app.post('/jevHomepage', dataEntry);
app.post('/newEntry', dataEntry);

    //TODO add the other later

app.listen(port, () =>{
    console.log(`Server is running on port: ${port}`);
});



