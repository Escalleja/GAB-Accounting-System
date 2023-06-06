const express = require('express');
const session = require('express-session');
const database = require('../configs/database');
require('dotenv').config();
const login = express.Router();

login.use(express.static(('public')));

login.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true	
}));


login.get('/', (req, res) => {
    if(req.session.loggedin && !req.session.isAdmin){
        res.redirect('/homepage');
    }else if(req.session.loggedin && req.session.isAdmin){
        res.redirect('/adminHomepage');
    }else{
        res.render('pages/login');
    }
})

login.post('/auth', (req, res) => {

    const employeeId = req.body.username;
    const password = req.body.password;

    database.query(`SELECT * FROM accountTbl WHERE employee_id = '${employeeId}' AND pass = '${password}'`, (err, data) => {
        if(err) console.log(err);

        if(data.recordset.length === 1){
            const sessionId = req.session.id;
            req.session.loggedin = true;
            req.session.employeeId = data.recordset[0].employee_id
            req.session.username = `${data.recordset[0].fName} ${data.recordset[0].lName}`;
            req.session.isAdmin = data.recordset[0].isAdmin;
            req.session.isAction = data.recordset[0].isAction;
            req.session.sessionId = sessionId;

        database.query(`UPDATE accountTbl SET isActive = '1' WHERE employee_id = '${employeeId}'`, (err, result) => {
            if(err) console.log(err);
                if(req.session.isAdmin){
                    res.status(200).send({redirect: '/adminHomepage', sessionId : req.session.sessionId, isAdmin : req.session.isAdmin, id : employeeId});
                } else{
                    res.status(200).send({redirect: '/homepage', sessionId : req.session.sessionId, isAdmin : req.session.isAdmin, id : employeeId});
                }
            });
        }else{
            res.status(401).send({redirect: 'invalid'})
        }
    })
})

login.get('/logout', (req, res) =>{
    database.query(`UPDATE accountTbl SET isActive = '0' WHERE employee_id = '${req.session.employeeId}'`, (err, result) => {
        if(err)console.log(err);
        req.session.destroy();
        res.redirect('/');
        res.end();
    });
})

module.exports = login;