const express = require('express');
const session = require('express-session');
const database = require('../configs/database');
const fund03 = express.Router();

fund03.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true 
}));

fund03.get('/fund03', (req, res) => {
    if(req.session.loggedin){
        database.query(`SELECT * FROM refJevHomepagetbl WHERE jevNo LIKE 'tbl6%'`, (err, data) => {
            res.render('pages/specialFund', {
                username: req.session.username,
                data: data});
    });
    }
    else{
        res.redirect('/');
    }
});

module.exports = fund03;