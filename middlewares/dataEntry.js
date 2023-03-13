const express = require('express');
const session = require('express-session');
const database = require('../configs/database');
const dataEntry = express.Router();

dataEntry.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

let jevInput = '';

let table = '';

    dataEntry.post('/jevHomepage', (req, res) => {

        jevInput = req.body.jevInput;

        table = `tbl${jevInput}`;

        database.query(`INSERT INTO refJevHomepagetbl VALUES ('${table}', '${currentDate()}', '${session.fullname}', '${currentDate()}', '${session.fullname}')`, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error');
        }
        
            database.query(`CREATE TABLE [${table}] (
                date0       VARCHAR(255)    NOT NULL,
                uacs        VARCHAR(255)    NOT NULL,
                description VARCHAR(255)    NOT NULL,
                debit       VARCHAR(255)    NOT NULL,
                credit      VARCHAR(255)    NOT NULL,
                dateCreated VARCHAR(255)    NOT NULL,
                createdBy   VARCHAR(255)    NOT NULL,
                dateModify  VARCHAR(255)    NOT NULL,
                modifyBy    VARCHAR(255)    NOT NULL );`, (err, data) =>{
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error');
                }
                res.status(200).send('Success');
                })
            }) 
    })

dataEntry.post('/newEntry', (req, res) =>{
    let dateForm = req.body.dateForm;
    let uacs = req.body.uacs;
    let description = req.body.description;
    let debit = req.body.debit;

    database.query(`INSERT INTO [${table}] VALUES ('${dateForm}', '${uacs}', '${description}', '${debit}', '', '${currentDate()}', '${session.fullname}', '${currentDate()}', '${session.fullname}')`, (err, data) => {
        if(err) throw err;
    })
    res.status(200).send('Success');
})

const currentDate = () => {
    const newDate = new Date();

    const month = [
        "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", 
        "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
    ];

    const currentMonth = month[newDate.getMonth()];
    const currentDay = newDate.getDate();
    const currentYear = newDate.getFullYear();

    const formattedDate = currentMonth + ' ' + currentDay + ' ' + currentYear;

    return formattedDate;
}

module.exports = dataEntry; 