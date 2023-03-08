const express = require('express');
const session = require('express-session');
const database = require('../configs/database');
const dataEntry = express.Router();

dataEntry.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

dataEntry.post('/newEntry', (req, res) =>{
    let dateForm = req.body.dateForm;
    let jev = req.body.jev;
    let uacs = req.body.uacs;
    let description = req.body.description;
    let debit = req.body.debit;
    let credit = req.body.credit;

    database.query(`INSERT INTO jevT VALUES ('${dateForm}', '${jev}', '${uacs}', '${description}', '${debit}', '${credit}', '${currentDate()}', '${currentDate()}', '${session.fullname}', '${session.fullname}'  )`, (err, data) => {
        if(err) throw err;

        res.status(200).send('Success');
    })
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