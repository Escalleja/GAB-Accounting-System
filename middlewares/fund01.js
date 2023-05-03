const express = require('express');
const session = require('express-session');
const database = require('../configs/database');
const fund01 = express.Router();

fund01.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true	
}));

fund01.get('/fund01', (req, res) => {
    if(req.session.loggedin){
        database.query(`SELECT * FROM refJevHomepagetbl WHERE jevNo LIKE 'tbl1%'`, (err, data) => {
            if(err) console.log(err);
            res.render('pages/regularFund', {
                username: req.session.username,
                data: data});
        })
    }
    else{
        res.redirect('/');
    }
});

module.exports = fund01;