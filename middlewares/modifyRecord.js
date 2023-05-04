const express = require('express');
const session = require('express-session');
const database = require('../configs/database');
const modifyRecord = express.Router();
const {modifiedData, io} = require('./recordsEventLister');

let jevId;
const currentlyOpen = new Map();

modifyRecord.post('/selectRecord/:id', (req, res) => {
    jevId = req.params.id;
    database.query(`SELECT * FROM [${jevId}]`, (err, data) => {
        if(err) console.log(err);

        if(data.rowsAffected != 0){

            if(req.session.id != null){
                
                if(currentlyOpen.has(jevId)){
                    if(currentlyOpen.values().next().value === req.session.employeeId){
                        res.send({status: 'data retrieved', data});
                    }else{
                        res.send({status: 'unavailable'});
                    }
                }else{
                    currentlyOpen.set(jevId, req.session.employeeId);
                    res.send({status: 'data retrieved', data});
                }

            // res.send({status: 'data retrieved', data : data})
        }
    }
    })
})

modifyRecord.post('/removeFromMap', (req, res) => {
    const jevId = req.body.jevId;
    if(currentlyOpen.has(jevId)){
        currentlyOpen.delete(jevId);
    }
})

modifyRecord.post('/updateRecord/:id', (req, res) => {
    const id = req.params.id;
    const tblJev = jevId;

    console.log("you passed here\n");
    const dateForm = req.body.dateForm;
    const uacs = req.body.uacs;
    const description = req.body.description;
    const debit = req.body.debit;    

    console.log('id: ' + id + '\n' +
                'table: ' + tblJev + '\n' +
                'dateForm: ' + dateForm + '\n' +
                'uacs: ' + uacs + '\n' +
                'description: ' + description + '\n' +
                'debit: ' + debit + '\n'); 
    database.query(`UPDATE [${tblJev}] SET date0 = '${dateForm}', uacs = '${uacs}', description = '${description}', debit = '${debit}', dateModify = '${currentDate()}', modifyBy = '${session.fullname}' WHERE ID = '${id}'`, (err, data) => {
        
        if(data != ' '){
            database.query(`UPDATE refjevHomepagetbl SET dateModified = '${currentDate()}', modifiedBy = '${req.session.username}' WHERE jevNo = '${tblJev}'`, (err, data) => {
                if(err) console.log(err); 

                if(data){
                    database.query(`SELECT * FROM refJevHomepagetbl WHERE jevNo = '${tblJev}'`, (err, data) => {
                        modifiedData(data);
                        res.status(200).send('Success');
                    })
                }
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
    const formattedDate = `${currentMonth} ${currentDay}, ${currentYear}`;
   
    return formattedDate;
}
module.exports = modifyRecord;