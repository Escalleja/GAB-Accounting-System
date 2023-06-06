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
    })

    dataEntry.post('/newEntry', (req, res) =>{
        let dateForm = req.body.dateForm;
        let uacs = req.body.uacs;
        let description = req.body.description;
        let debit = req.body.debit;
        let credit = req.body.credit;    
        let dynamicInputs = req.body.dynamicInputs;


        let values = `('${dateForm}', '${uacs}', '${description}', '${debit}', '${credit}', '${currentDate()}', '${req.session.username}', '${currentDate()}', '${req.session.username}')`;
        for(let i = 0; i < dynamicInputs.length; i++){
            const [dynamicDateForm, dynamicUacs, dynamicDescription, dynamicDebit, dynamicCredit] = dynamicInputs[i];
            values += `,('${dynamicDateForm}', '${dynamicUacs}', '${dynamicDescription}', '${dynamicDebit}', '${dynamicCredit}', '${currentDate()}', '${req.session.username}', '${currentDate()}', '${req.session.username}')`;
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

    const day = [
        "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
        "31"
    ]

    const currentMonth = month[newDate.getMonth()];
    const currentDay = day[newDate.getDate()];
    const currentYear = newDate.getFullYear();

    const formattedDate = currentMonth + ' ' + currentDay + ', ' + currentYear;

    return formattedDate;
}

module.exports = dataEntry; 