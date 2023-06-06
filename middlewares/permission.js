const express = require('express');
const permission = express.Router();
const database = require('../configs/database');
const {permissions, updatePermitUI} = require('../middlewares/recordsEventLister');

permission.get('/deletionPermit/:id', (req, res) => {
    const employeeId = req.params.id

    database.query(`UPDATE accountTbl SET isAction = '1' WHERE employee_id = '${employeeId}'`, (err, result) => {
        if(err) console.log(err);

        database.query(`SELECT * FROM accountTbl WHERE employee_id = '${employeeId}'`, (err, result) => {
            if(err) console.log(err);

            const status = 'check'

            updatePermitUI( status ,result.recordset[0].employeeId);
            permissions(result.recordset[0].sessionId);
            res.status(200).send('allowed');
        })
    })
})

permission.get('/removePermit/:id', (req, res) => {
    const employeeId = req.params.id;

    database.query(`UPDATE accountTbl SET isAction = '0' WHERE employee_id = '${employeeId}'`, (err, result) => {
        if(err) console.log(err)

        database.query(`SELECT * FROM accountTbl WHERE employee_id '${employeeId}`, (err, result) => {
            if(err) console.log(err);

            const status = 'uncheck'

            updatePermitUI( status ,result.recordset[0].employeeId);
            permissions(result.recordset[0].sessionId);
            res.status(200).send('!allowed');
        })
    })
})

module.exports = permission;