const express = require('express');
const session = require('express-session');
const database = require('../configs/database');
const equityPage = express.Router();

equityPage.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true 
}));

equityPage.get('/equity', (req, res) => {
    if(req.session.loggedin){
        res.render('pages/equityPage', {username: session.fullname});
    }
    else{
        res.redirect('/');
    }
});

module.exports = equityPage;