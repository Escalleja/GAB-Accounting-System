const express = require('express');
const printRecords = express.Router();
const database = require('../configs/database');
// const {printRecords} = require('../middlewares/recordsEventLister');

printRecords.get('/print/:id', (req, res) => {
    console.log('passed here');
    const id = req.params.id;
    res.send({url : '/printFormat', id : id});
});

printRecords.get('/printFormat/:id', (req, res) => {
    console.log('passed');
    const encodedId = req.params.id;
    const idString = decodeURIComponent(encodedId);
    const jevIds = new Set(idString.split(','));
    const ids = `[${Array.from(jevIds).join("],[")}]`;
    console.log(ids);
    // if(req.session.loggedin){
        database.query(`SELECT * FROM ${ids} `, (err, data) => {
            if(err) console.log(err);
            res.render('pages/printFormat');
        });
    // } else {
    //     res.redirect('/');
    // }
})

module.exports = printRecords;