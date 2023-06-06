const express = require('express');
const database = require('../configs/database');
const sortData = express.Router();
const {sortRegular, sortSpecial, sortTrust} = require('../middlewares/recordsEventLister');

sortData.get('/sortedRegular', (req, res) => {
    const id = req.session.sessionId;
    
    database.query(`SELECT * FROM refJevHomepagetbl WHERE jevNo LIKE '%tbl01%'`, (err, sorted) => {

        if(err){
            res.status(400).send('Error Request');
        }
        sortRegular(sorted.recordset, id);
        res.status(200).send({status: 'sorted'});
    })
})

sortData.get('/sortedSpecial', (req, res) => {
    const id = req.session.sessionId;

    database.query(`SELECT * FROM refJevHomepagetbl WHERE jevNo LIKE '%tbl03%'`, (err, sorted) => {
        if(err){
            res.status(400).send('Error Request');
        }

        sortSpecial(sorted.recordset, id);
        res.status(200).send({status: 'sorted'});
    })
})

sortData.get('/sortedTrust', (req, res) => {
    const id = req.session.sessionId;

    database.query(`SELECT * FROM refJevHomepagetbl WHERE jevNo LIKE '%tbl07%'`, (err, sorted) => {
        if(err){
            res.status(400).send('Error Request');
        }

        sortTrust(sorted.recordset, id);
        res.status(200).send({status: 'sorted'});
    })
})

module.exports = sortData;