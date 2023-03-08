const express = require('express');
const session = require('express-session');
const database = require('../configs/database');
const revenuePage = express.Router();

revenuePage.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

revenuePage.get('/revenue', (req, res) => {
    if(req.session.loggedin){
        res.render('pages/revenuePage', {username: session.fullname});
    }
    else{
        res.redirect('/');
    }
});

module.exports = revenuePage;