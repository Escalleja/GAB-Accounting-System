const express = require('express');
const session = require('express-session');
const database = require('../configs/database');
const modifyRecord = express.Router();
const {modifiedData, searchResult, io} = require('./recordsEventLister');

let jevId;
const currentlyOpen = new Map();

modifyRecord.post('/selectRecord/:id', (req, res) => {
    jevId = req.params.id;
    if(req.session.loggedin){
        database.query(`SELECT * FROM [${jevId}]`, (err, data) => {
            if(err) console.log(err);

            if(data.rowsAffected != 0){

                if(req.session.id != null){
                    
                    if(currentlyOpen.has(jevId)){
                        console.log(currentlyOpen.values().next().value);
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
            }else{
                res.send({status: 'Failed'});
            }
        })
    }else{
        res.redirect('/');
    }
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

    const date = req.body.dateForm;
    const uacs = req.body.uacs;
    const description = req.body.description;
    const debit = req.body.debit;    
    const credit = req.body.credit;

    if(req.session.loggedin){
        database.query(`UPDATE [${tblJev}] SET date0 = '${date}', uacs = '${uacs}', description = '${description}', debit = '${debit}', credit = '${credit}', dateModify = '${currentDate()}', modifyBy = '${req.session.username}' WHERE ID = '${id}'`, (err, data) => {
            if(err) {
                console.log(err);
            }
                if (data){
                    database.query(`SELECT * FROM refjevHomepagetbl where jevNo = '${tblJev}'`, (err, data) => {
                        if(err) console.log(data);
                        modifiedData(data);
                        res.status(200).send({status: 'Success'});
                    })
                }else{
                    res.status(401).send({status: 'Failed'});
                }
        })
    }else{
        res.redirect('/');
    }
})

modifyRecord.post('/insertRecord', (req, res) => {
    let jev = jevId;
    let dateForm = req.body.dateForm;
    let uacs = req.body.uacs;
    let description = req.body.description;
    let debit = req.body.debit;
    let credit = req.body.credit;    
    let dynamicInputs = req.body.dynamicInput;


    if(req.session.loggedin){
        let values = `('${dateForm}', '${uacs}', '${description}', '${debit}', '${credit}', '${currentDate()}', '${req.session.username}', '${currentDate()}', '${req.session.username}')`;

        for(let i = 1; i < dynamicInputs.length; i++){
            const [dynamicDateForm, dynamicUacs, dynamicDescription, dynamicDebit, dynamicCredit] = dynamicInputs[i];

            values += `,('${dynamicDateForm}', '${dynamicUacs}', '${dynamicDescription}', '${dynamicDebit}', '${dynamicCredit}', '${currentDate()}', '${req.session.username}', '${currentDate()}', '${req.session.username}')`;
        }

        let query = `INSERT INTO [${jev}] VALUES ${values}`;
        database.query(query, (err, data) => {
            if(err) console.log(err);

            if(data != ' '){
                res.status(200).send({status: 'Success'});
            } else{
                res.status(400).send({status: 'Failed'});
            }
        })
    }else{
        res.redirect('/');
    }

})

modifyRecord.get('/searchRecord/:id', (req, res) => {
    const term = req.params.id;
    const sessionId = req.session.sessionId;

    if(req.session.loggedin){
        database.query(`SELECT * FROM refJevHomepagetbl WHERE jevNo LIKE '%tbl${term}%'`, (err, data) => {
            if(err) console.log(err);
            searchResult(data.recordset, sessionId, term);
            res.status(200).send({status: 'Success'});
        })
    }else{
        res.redirect('/');
    }
})
const currentDate = () => {
    let newDate = new Date();

    let month = [
        "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", 
        "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
    ];

    const currentMonth = month[newDate.getMonth()];
    let currentDay = newDate.getDate();
    currentDay = currentDay <= 9 ? '0' + currentDay : currentDay;
    let currentYear = newDate.getFullYear();

    let formattedDate = `${currentMonth} ${currentDay}, ${currentYear}`;

    return formattedDate;
}
module.exports = modifyRecord;