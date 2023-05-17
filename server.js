const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const port = process.env.DB_ACCOUNTING_PORT;
const login = require('./middlewares/login');
const homepage = require('./middlewares/homepage');
const adminHomepage = require('./middlewares/adminHomepage');

const fund01 = require('./middlewares/fund01');
const fund03 = require('./middlewares/fund03');
const fund07 = require('./middlewares/fund07');

const dataEntry = require('./middlewares/dataEntry');

const modifyRecord = require('./middlewares/modifyRecord');
const deleteRecord = require('./middlewares/deleteRecord');

const server = require('http').createServer(app);
const bodyParser = require('body-parser');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(('public')));

// app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/adminHomepage', adminHomepage);

app.get('/fund01', fund01);
app.get('/fund03', fund03);
app.get('/fund07', fund07);

app.post('/jevHomepage', dataEntry);
app.post('/newEntry', dataEntry);
app.post('/newsubmission', dataEntry);
app.post('/refJevDelete/:id', dataEntry);

app.post('/selectRecord/:id', modifyRecord);
app.post('/updateRecord/:id', modifyRecord);
app.post('/insertRecord', modifyRecord);
app.post('/removeFromMap', modifyRecord);

app.get('/authDelete', deleteRecord);
app.post('/jevDelete/:id', deleteRecord);
app.post('/deleteRow/:id', deleteRecord);
//TODO add the other later

server.listen(port, () =>{
    console.log(`Server is running on port: ${port}`);
});



