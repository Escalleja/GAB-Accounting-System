const express = require('express');
const session = require('express-session');
const database = require('../configs/database');
const modifyRecord = express.Router();
const {modifiedData, selectData} = require('./recordsEventLister');

let jevNo;
modifyRecord.post('/selectRecord', (req, res) => {

    //GETTING JEV NO. TO SELECT THE TABLE OF THAT JEV 
    jevNo = req.body.jevNo;

    database.query(`SELECT * FROM tbl${jevNo}`, (err, data) => {
        if(err) console.log(err);
        selectData(data);
        res.status(200).send('Success');
    })
})

modifyRecord.post('/updateRecord', (req, res) => {
    const tblJev = jevNo;
    const table = `tbl${tblJev}`;

    console.log("you passed here\n");
    const dateForm = req.body.dateForm;
    const uacs = req.body.uacs;
    const description = req.body.description;
    const debit = req.body.debit;    
    console.log('table: ', table);
    console.log(req.body);
    database.query(`UPDATE ${table} SET date0 = '${dateForm}', uacs = '${uacs}', description = '${description}', debit = '${debit}', dateModify = '${currentDate()}', modifyBy = '${session.fullname}'`, (err, data) => {
        if(data != ' '){
        database.query(`UPDATE refjevHomepagetbl SET dateModified = '${currentDate()}', modifiedBy = '${session.fullname}' WHERE jevNo = '${table}'`, (err, data) => {
            if(err) console.log(err); 
            modifiedData(data);
            res.status(200).send('Success');
        })
        }else {
            res.status(5).send('Failed');
        }
   })
   
})

const currentDate = () => {
    const dateNow = new Date();

    const monthNames = [
        'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.',
        'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'
    ];  

    const currentMonth = (monthNames[dateNow.getMonth()]);
    const currentDay = (dateNow.getDate()); 
    const currentYear = dateNow.getFullYear();
    const formattedDate = `${currentMonth} ${currentDay} ${currentYear}`;
   
    return formattedDate;
}
module.exports = modifyRecord;