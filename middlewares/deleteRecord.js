const express = require('express');
const database = require('../configs/database');
const deleteRecord = express.Router();
const {deleteRecords} = require('./recordsEventLister');
let jevId;
deleteRecord.get('/authDelete', (req, res) => {
    if(req.session.isAdmin || req.session.isAction){
        res.status(200).send({status: 'authorized'});
    } else{
        res.status(401).send({status: 'unauthorized'});
    }
})

deleteRecord.post('/jevDelete/:id', (req, res) => {
    const encodedId = req.params.id;
    const idString = decodeURIComponent(encodedId);
    const recordIds = new Set(idString.split(','));
    const ids = Array.from(recordIds);

    console.log(ids);
    database.query(`DELETE FROM refJevHomepagetbl WHERE jevNo IN ('${ids.join("','")}')`, (err, data) => {
        if (err) {
            console.log("Error: ", err);
            res.status(401).send({ status: 'Failed' });
        } else {
            deleteRecords(ids);
            const dropPromises = ids.map(tableName => {
                return new Promise((resolve, reject) => {
                    const formattedTableName = tableName.replace(/^\((.*)\)$/, '$1');
                    const dropQuery = `DROP TABLE [${formattedTableName}]`;
                    console.log(dropQuery);
                    database.query(dropQuery, (dropErr, dropData) => {
                        if (dropErr) {
                            console.log(`Error dropping table ${formattedTableName}: `, dropErr);
                            reject(dropErr);
                        } else {
                            console.log(`Dropped table ${formattedTableName}`);
                            resolve();
                        }
                    });
                });
            });

            Promise.all(dropPromises)
                .then(() => {
                    res.status(200).send({ status: 'Success' });
                })
                .catch(error => {
                    console.log("Error dropping tables: ", error);
                    res.status(401).send({ status: 'Failed' });
                });
        }
    });
});


deleteRecord.post('/deleteRow/:id', (req, res) => {
    const rowId = req.params.id;
    const jev = req.body.jev;
    console.log(jev + ''+ rowId);

    database.query(`DELETE FROM [${jev}] WHERE ID = ${rowId}`, (err, data) => {
        if(err) console.log(err)
        res.status(200).send({status: 'Success'})
    })
})


module.exports = deleteRecord;