const express = require('express');
const database = require('../configs/database');
const {insertData, deleteRecords} = require('./recordsEventLister');
const dataEntry = express.Router();

let jevInput = '';

let table = '';

    dataEntry.post('/jevHomepage', (req, res) => {

        jevInput = req.body.jevInput;

        table = `tbl${jevInput}`;

        database.query(`INSERT INTO refJevHomepagetbl VALUES ('${table}', '${currentDate()}', '${req.session.username}', '${currentDate()}', '${req.session.username}')`, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error');
        }
        
            database.query(`CREATE TABLE [${table}] (
                ID      int IDENTITY(1,1)   PRIMARY KEY,
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
        let dynamicInputs = req.body.dynamicInputs;
    
        let values = `('${dateForm}', '${uacs}', '${description}', '${debit}', '', '${currentDate()}', '${req.session.username}', '${currentDate()}', '${req.session.username}')`;
        for(let i = 0; i < dynamicInputs.length; i++){
            const [dynamicUacs, dynamicDescription, dynamicDebit] = dynamicInputs[i];
            values += `,('${dateForm}', '${dynamicUacs}', '${dynamicDescription}', '${dynamicDebit}', '', '${currentDate()}', '${req.session.username}', '${currentDate()}', '${req.session.username}')`;
        }
    
        let query = `INSERT INTO [${table}] VALUES ${values}`;
        database.query(query, (err, data) => {
            if(err) console.log(err);

            if(data != ' '){
                database.query(`SELECT * FROM refJevHomepagetbl WHERE jevNo = '${table}'`, (err, data) => {
                    if(err) console.log(err);  
                    insertData(data);
                    res.status(200).send('Success');
                })
            }else {
                res.status(5).send('Failed');
            }
        });
    });
    
    dataEntry.post('/refJevDelete/:id', (req, res) => {
        // const jevId = req.params.id;
    
        database.query(`DELETE FROM refJevHomepagetbl WHERE jevNo = '${table}'`, (err, data) => {
            if(err){ 
                console.log(err);
                res.status(401).send({status: 'Failed'});
            } else{
                deleteRecords(data);
                database.query(`DROP TABLE [${table}]`);
                res.status(200).send({status: 'Success'});
            }    
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

    const formattedDate = currentMonth + ' ' + currentDay + ', ' + currentYear;

    return formattedDate;
}

module.exports = dataEntry; 