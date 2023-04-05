const express = require('express');
const session = require('express-session');
const database = require('../configs/database');
const modifyRecord = express.Router();
const {modifiedData, selectData} = require('./recordsEventLister');

modifyRecord.post('/selectRecord', (req, res) => {

    //GETTING JEV NO. TO SELECT THE TABLE OF THAT JEV 
    const jevNo = req.body.jevNo;

    database.query(`SELECT * FROM tbl${jevNo}`, (err, data) => {
        if(err) console.log(err);
        selectData(data);
        res.status(200).send('Success');
    })
})

let table = '';
modifyRecord.post('/updateRecord', (req, res) => {
    let dateForm = req.body.dateForm;
    let uacs = req.body.uacs;
    let description = req.body.description;
    let debit = req.body.debit;    
    let dynamicInputs = req.body.dynamicInputs;

    let values = `('${dateForm}', '${uacs}', '${description}', '${debit}', '', '${currentDate()}', '${session.fullname}', '${currentDate()}', '${session.fullname}')`;
        for(let i = 0; i < dynamicInputs.length; i++){
            const [dynamicUacs, dynamicDescription, dynamicDebit] = dynamicInputs[i];
            values += `,('${dateForm}', '${dynamicUacs}', '${dynamicDescription}', '${dynamicDebit}', '', '${currentDate()}', '${session.fullname}', '${currentDate()}', '${session.fullname}')`;
        }
    
   database.query(`UPDATE [${table}] SET uacs = '${uacs}', description = '${description}', debit = '${debit}', dateModify = '${currentDate()}', modifyBy = '${session.fullname}' WHERE uacs = '${uacs}' AND description = '${description}' AND debit = '${debit}'`, (err, data) => {
        if(err) console.log(err);

        if(data != ' '){
        database.query(`UPDATE refjevHomepagetable SET = dateModified = '${currentDate()}', modifiedBy = '${session.fullname}' WHERE jevNo = '${table}'`, (err, data) => {
            if(err) console.log(err);
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
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
    ];  

    const currentMonth = (monthNames[dateNow.getMonth()]);
    const currentDay = (dateNow.getDate()); 
    const currentYear = dateNow.getFullYear();
    // const currentTime = `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`;
    const formattedDate = `${currentMonth} ${currentDay} ${currentYear}`;
   
    return formattedDate;
}
module.exports = modifyRecord;
