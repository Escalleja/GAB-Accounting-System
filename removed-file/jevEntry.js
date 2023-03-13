const express = require('express');
const session = require('express-session');
const database = require('../configs/database');
const jevEntry = express.Router();

jevEntry.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


// jevEntry.post('/jevEntry', (req, res) => {
//     let refJev = req.body.jevInput;

//     database.query(`CREATE TABLE '${refJev}'(
//         date0			VARCHAR(255)	NOT NULL,
//         uacs			VARCHAR(255)	NOT NULL,
//         account			VARCHAR(255)	NOT NULL,
//         debit			VARCHAR(255)	NOT NULL,
//         credit			VARCHAR(255)	NOT NULL,
//         dateCreated		VARCHAR(255)	NOT NULL,
//         dateModified	VARCHAR(255)	NOT NULL,
//         createdBy		VARCHAR(255)	NOT NULL,
//         modifiedBy		VARCHAR(255)	NOT NULL,
//     );`, (err, data) => {
//         if(err) throw err;
//     })
//     res.statusJev(200).send('Success');
// })

module.exports =  jevEntry;