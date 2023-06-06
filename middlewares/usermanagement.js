const express = require('express');
const database = require('../configs/database');
const usermanagement = express.Router();
const {deletedAcc, deletedAccNotif, newUser} = require('../middlewares/recordsEventLister');

usermanagement.get('/userControl', (req, res) => {
    if(req.session.loggedin && req.session.isAdmin){
        res.render('pages/user-management', {username: req.session.username, activeButton : 'userMng'});
    } else {
        res.redirect('/');
    }
})

usermanagement.post('/addUser', (req, res) => {
    const fName = req.body.fName;
    const lName = req.body.lName;
    const employeeId = req.body.employeeId;
    const isAdminChecked = req.body.isAdminChecked;
    const isDeletionChecked = req.body.isDeletionChecked;
    let accPassword = req.body.accPassword;

    if(accPassword === ''){
        accPassword = 'default';
    }

    if(req.session.loggedin){
        database.query(`INSERT INTO accountTbl VALUES ('${employeeId}', '${fName}', '${lName}', '${accPassword}', '${isDeletionChecked}', '${isAdminChecked}', '')`, (err, result) => {
            if(err){
                if(err.number === 2627){
                    res.send({status: 'Employee ID already exist!'})
                    res.end();
                }else{
                    console.log(err);
                }
            }else{
                database.query(`SELECT * FROM accountTbl WHERE employee_id = '${employeeId}'`, (err, user) => {
                    if(err){
                        res.send({status: 'Something went wrong.'});
                    }else{
                        newUser(user.recordset);
                        res.status(200).send({status: 'added'}) 
                    }
                })
            }
        })
    }else{
        res.redirect('/');
    }
})

usermanagement.get('/resetpassword/:id', (req, res) => {
    const employeeId = req.params.id;

    if(req.session.loggedin){
        database.query(`UPDATE accountTbl SET pass = 'default' WHERE employee_id = '${employeeId}'`, (err, result) => {
            if(err) console.log(err)

            res.status(200).send({status: 'reset'});
        })
    }
})

usermanagement.get('/deleteAcc/:id', (req, res) => {
    const employeeId = req.params.id;

    if(req.session.loggedin){
        database.query(`DELETE FROM accountTbl WHERE employee_id = '${employeeId}'`, (err, result) => {
            if(err) console.log(err);
            deletedAcc(employeeId);
            deletedAccNotif(employeeId);
            res.status(200).send({ status: 'deleted' });
        })
    }else{
        res.redirect('/');
    }
})

usermanagement.post('/changePass', (req, res) => {
    const employeeId = req.session.employeeId;
    const currentPass = req.body.currentPass;
    const newPass = req.body.newPass

    if(req.session.loggedin){
        database.query(`SELECT * FROM accountTbl WHERE employee_id = '${employeeId}' and pass = '${currentPass}'`, (err, result) => {
            if(err) console.log(err);
            console.log(result);

            if(result.rowsAffected > 0){
                database.query(`UPDATE accountTbl SET pass = '${newPass}' WHERE employee_id = '${employeeId}'`, (err, result) => {
                    if(err)console.log(err);
                    res.status(200).send({status: 'changed'});
                    res.end();
                })
            }else{
                res.send({status : 'invalid'});
            }
        })
    }else{
        res.redirect('/');
    }
})
module.exports = usermanagement;