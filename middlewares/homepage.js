const express = require('express');
const session = require('express-session');
const database = require('../configs/database');
const homepage = express.Router();

homepage.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true	
}));

homepage.get('/homepage', (req, res) => {

    if(req.session.loggedin && !req.session.isAdmin){
        // res.render('pages/home', {username: session.fullname});
    database.query(`SELECT * FROM refJevHomepagetbl`, (err, data) => {
        if(err) throw err;
        res.render('pages/home', {
            username: req.session.username,
            data: data,
            activeButton: 'home'
        })
    })
    } else {
        res.redirect('/');
    }
});

module.exports = homepage;