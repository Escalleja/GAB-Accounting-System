const express = require('express');
const database = require('../configs/database');
const homepage = express.Router();
const path = require('path');

homepage.get('/homepage', (req, res) => {
    res.render('/home');
})

//LOGOUT
homepage.get('/logout', (req, res) =>{
    res.redirect('/');
    res.end();
})

module.exports = homepage;