const express = require('express');
const printRecords = express.Router();
const database = require('../configs/database');
// const {printRecords} = require('../middlewares/recordsEventLister');

printRecords.get('/print/:id', (req, res) => {
    const id = req.params.id;
    const idArr = id.split(',');
    if(idArr.length === 1){
      const singleId = idArr[0].trim();
      res.send({url : '/printJev', id : singleId});
    }else{
    res.send({url : '/printFormat', id : id});
    }
});

printRecords.get('/printFormat/:id', async (req, res) => {
    const encodedId = req.params.id;
    const idString = decodeURIComponent(encodedId);
    const jevIds = new Set(idString.split(','));
    // const ids = `[${Array.from(jevIds).join("],[")}]`;
    const ids = [...jevIds];
    // const ids = `[${Array.from(jevIds).join("],[")}]`;
    // console.log(jevIds);
    if(req.session.loggedin){
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
printRecords.get('/printJev/:id', async (req, res) => {
  // console.log('passed');
  const encodedId = req.params.id;
  const idString = decodeURIComponent(encodedId);
  const jevIds = new Set(idString.split(','));
  // const ids = `[${Array.from(jevIds).join("],[")}]`;
  const ids = [...jevIds];
  // const ids = `[${Array.from(jevIds).join("],[")}]`;
  // console.log(jevIds);
  if(req.session.loggedin){
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
  res.render('pages/printJev', { jsonData: JSON.stringify(data).replace(/'/g, "\\'").replace(/"/g, '\\"') });
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