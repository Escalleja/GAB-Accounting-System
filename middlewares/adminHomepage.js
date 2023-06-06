const express = require('express');
const session = require('express-session');
const database = require('../configs/database');
const adminHomepage = express.Router();

adminHomepage.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true	
}));

adminHomepage.get('/adminHomepage', (req, res) => {

    if(req.session.loggedin && req.session.isAdmin){
        // res.render('pages/adminHomepage', {username: session.fullname});
    database.query(`SELECT * FROM refJevHomepagetbl`, (err, data) => {
        if(err) throw err;
        res.render('pages/admin', {
            username: req.session.username,
            data: data,
            activeButton: 'home'
        })
    })
    } else {
        res.redirect('/');
    }
});

module.exports = adminHomepage;