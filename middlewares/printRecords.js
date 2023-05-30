const express = require('express');
const printRecords = express.Router();
const database = require('../configs/database');
// const {printRecords} = require('../middlewares/recordsEventLister');

printRecords.get('/print/:id', (req, res) => {
    console.log('passed here');
    const id = req.params.id;
    res.send({url : '/printFormat', id : id});
});

printRecords.get('/printFormat/:id', async (req, res) => {
    console.log('passed');
    const encodedId = req.params.id;
    const idString = decodeURIComponent(encodedId);
    const jevIds = new Set(idString.split(','));
    // const ids = `[${Array.from(jevIds).join("],[")}]`;
    const ids = [...jevIds];
    // const ids = `[${Array.from(jevIds).join("],[")}]`;
    console.log(jevIds);
    if(req.session.loggedin){
        // database.query(`SELECT 'refJev' AS TableName, ${ids}.* FROM ${ids}`, (err, data) => {
        //     if(err) console.log(err);
        //     const result = data.recordset;

        //     result.forEach(row => {
        //         console.log(`Data from table ${row.TableName}:`, row);
        //     })
        //     // res.render('pages/printFormat', {jsonData : JSON.stringify(data.recordset).replace(/'/g, "\\'").replace(/"/g, '\\"')});
        // });

        const data = [];

const queryPromises = ids.map(id => {
  return new Promise((resolve, reject) => {
    database.query(`SELECT '${id}' AS TableName, [${id}].* FROM [${id}]`, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      }

      const recordset = result.recordset;
      recordset.forEach(row => {
        const obj = {};
        Object.keys(row).forEach(column => {
          obj[column] = row[column];
        });
        data.push(obj);
      });

      resolve();
    });
  });
});

Promise.all(queryPromises)
  .then(() => {
    res.render('pages/printFormat', { jsonData: JSON.stringify(data).replace(/'/g, "\\'").replace(/"/g, '\\"') });
  })
  .catch(error => {
    // Handle errors
    console.log(error);
  });
        
    } else {
        res.redirect('/');
    }
})

module.exports = printRecords;