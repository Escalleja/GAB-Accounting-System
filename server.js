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
const modifyRecord = require('./middlewares/modifyRecord');
const server = require('http').createServer(app);
const bodyParser = require('body-parser');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//PREVENTING USER TO GO TO PREVIOUS PAGE
app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

//GET REALTIME WHEN CHANGES HAPPEN IN DATABASE SERVER
const {io} = require('./middlewares/recordsEventLister');
io.attach(server);


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
app.post('/newsubmission', dataEntry);
app.post('/selectRecord', modifyRecord);
app.post('/updateRecord', modifyRecord);
//TODO add the other later

server.listen(port, () =>{
    console.log(`Server is running on port: ${port}`);
});



