const express = require('express');
const database = require('../configs/database');
const deleteRecord = express.Router();
const {deleteRecords} = require('./recordsEventLister');

deleteRecord.get('/authDelete', (req, res) => {
    if(req.session.isAdmin || req.session.isAction){
        res.status(200).send({status: 'authorized'});
    } else{
        res.status(401).send({status: 'unauthorized'});
    }
})

deleteRecord.post('/jevDelete/:id', (req, res) => {
    const jevId = req.params.id;
    
    database.query(`DELETE FROM refJevHomepagetbl WHERE jevNo = '${jevId}'`, (err, data) => {
        if(err){
            console.log("you got",err);
            res.status(401).send({status: 'Failed'});
        } else {
            deleteRecords(jevId);
            database.query(`DROP TABLE [${jevId}]`);
            res.status(200).send({status: 'Success'});
        }
    });
})
module.exports = deleteRecord;