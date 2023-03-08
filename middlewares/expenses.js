const express = require('express');
const session = require('express-session');
const database = require('../configs/database');
const assetPage = require('./asset');
const expensesPage = express.Router();

expensesPage.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

expensesPage.get('/expenses', (req, res) => {
    if(req.session.loggedin){
        res.render('pages/equityPage', {username: session.fullname});
    }
    else{
        res.redirect('/');
    }
});

module.exports = expensesPage;