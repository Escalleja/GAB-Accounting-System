const express = require('express');
const session = require('express-session');
const database = require('../configs/database');
const liabilitiesPage = express.Router();

liabilitiesPage.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

liabilitiesPage.get('/liabilities', (req, res) => {
    if(req.session.loggedin){
        res.render('pages/liabilitiesPage', {username: session.fullname});
    }
    else{
        res.redirect('/');
    }
});

module.exports = liabilitiesPage;