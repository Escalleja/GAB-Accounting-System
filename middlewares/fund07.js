const express = require('express');
const session = require('express-session');
const database = require('../configs/database');
const assetPage = require('./fund01');
const expensesPage = express.Router();

expensesPage.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

expensesPage.get('/fund07', (req, res) => {
    if(req.session.loggedin){
        database.query(`SELECT * FROM refJevHomepagetbl WHERE jevNo LIKE 'tbl07%'`, (err, data) => {
            if(err) console.log(err);
            res.render('pages/trustFund', {
                username: req.session.username,
                data: data});
        })
    }
    else{
        res.redirect('/');
    }
});

module.exports = expensesPage;