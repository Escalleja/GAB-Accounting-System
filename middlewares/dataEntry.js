const express = require('express');
const database = require('../configs/database');
const {insertData, deleteRecords} = require('./recordsEventLister');
const dataEntry = express.Router();

let jevInput = '';

let table = '';

    dataEntry.post('/jevHomepage', (req, res) => {

        jevInput = req.body.jevInput;

        table = `tbl${jevInput}`;
        if(req.session.loggedin){
            database.query(`INSERT INTO refJevHomepagetbl VALUES ('${table}', '${currentDate()}', '${req.session.username}', '${currentDate()}', '${req.session.username}')`, (err) => {
            if (err) {
                console.error(err);
                if(err.number === 2627){
                    return res.status(400).send('Primary Key already exists');
                }else{
                return res.status(500).send('Error');
                }
            }
            
                database.query(`CREATE TABLE [${table}] (
                    ID      int IDENTITY(1,1)   PRIMARY KEY,
                    date0       VARCHAR(255)    NOT NULL,
                    uacs        VARCHAR(255)    NOT NULL,
                    description VARCHAR(5000)    NOT NULL,
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
        }else{
            res.redirect('/');
        }
    })

    dataEntry.post('/newEntry', (req, res) =>{
        let dateForm = req.body.dateForm;
        let uacs = req.body.uacs;
        let description = req.body.description;
        let debit = req.body.debit;
        let credit = req.body.credit;    
        let dynamicInputs = req.body.dynamicInputs;

        if(req.session.loggedin){
            let values = `('${dateForm}', '${uacs}', '${description}', '${debit}', '${credit}', '${currentDate()}', '${req.session.username}', '${currentDate()}', '${req.session.username}')`;
            for(let i = 0; i < dynamicInputs.length; i++){
                let [dynamicDateForm, dynamicUacs, dynamicDescription, dynamicDebit, dynamicCredit] = dynamicInputs[i];
                values += `,('${dynamicDateForm}', '${dynamicUacs}', '${dynamicDescription}', '${dynamicDebit}', '${dynamicCredit}', '${currentDate()}', '${req.session.username}', '${currentDate()}', '${req.session.username}')`;
            }
            let query = `INSERT INTO [${table}] VALUES ${values}`;
            database.query(query, (err, data) => {
                if(err) console.log(err);

                if(data != ''){
                    database.query(`SELECT * FROM refJevHomepagetbl WHERE jevNo = '${table}'`, (err, data) => {
                        if(err) console.log(err);  
                        insertData(data);
                        res.status(200).send('Success');
                    })
                }else {
                    res.status(5).send('Failed');
                }
            });
        }else{
            res.redirect('/');
        }
    });
    
    dataEntry.post('/refJevDelete/:id', (req, res) => {
        // const jevId = req.params.id;
    
        if(req.session.loggedin){
            database.query(`DELETE FROM refJevHomepagetbl WHERE jevNo = '${table}'`, (err, data) => {
                if(err) console.log(err);
                    deleteRecords(data);
                    database.query(`DROP TABLE [${table}]`);
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

module.exports = dataEntry; 