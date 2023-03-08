const express = require('express');
const database = require('../configs/database');
const session = require('express-session'); 
require('dotenv').config();
const login = express.Router();


login.get('/', (req, res) => {
    let error = '';

    if(req.query.error){
        error = 'Invalid Username or Password';
    }
    if(req.session.loggedin){
		let route = '/homepage';
        setUserInfo
		res.redirect(route);
	} else {
    res.render('pages/login' , { error: error });
    }
})
//Authenticating user input
login.post('/auth', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    database.query(`SELECT * FROM account_Tbl WHERE fk_employee_id = '${username}' AND acc_password = '${password}'`, (err, data) =>{
        if(err) throw err;

        if(data.rowsAffected[0] == 1){
            req.session.loggedin = true;
            session.employeeId = username;
            setUserInfo();
            res.redirect('/homepage');
            
        } else {
            res.redirect('/?error=1');
        }
    })
});

//User's Name 
const setUserInfo = () =>{
    database.query(`SELECT * FROM employee_Tbl WHERE employee_id = '${session.employeeId}'`, (err, data) => {
        if (err) throw err;

        let fullname = data.recordsets[0][0].fName + ' ' + data.recordsets[0][0].lName;

        session.fullname = fullname;
    })
}

module.exports = login;