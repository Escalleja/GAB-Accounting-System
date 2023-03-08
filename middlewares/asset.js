const express = require('express');
const session = require('express-session');
const database = require('../configs/database');
const assetPage = express.Router();

assetPage.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true	
}));

assetPage.get('/asset', (req, res) => {
    if(req.session.loggedin){
        res.render('pages/assetPage', {username: session.fullname});
    }
    else{
        res.redirect('/');
    }
});

module.exports = assetPage;