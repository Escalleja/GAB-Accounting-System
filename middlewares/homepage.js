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

    if(req.session.loggedin){
        // res.render('pages/home', {username: session.fullname});
    database.query(`SELECT * FROM refJevHomepagetbl`, (err, data) => {
        if(err) throw err;

        res.render('pages/home', {
            username: session.fullname,
            data: data
        })
    })
    } else {
        res.redirect('/');
    }
});

// const currentDate = () => {
//     const newDate = new Date();

//     const month = [
//         "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", 
//         "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
//     ];

//     const currentMonth = month[newDate.getMonth()];
//     const currentDay = newDate.getDate();
//     const currentYear = newDate.getFullYear();

//     const formattedDate = currentMonth + ' ' + currentDay + ' ' + currentYear;

//     return formattedDate;
// }
//LOGOUT
homepage.get('/logout', (req, res) =>{
    req.session.destroy();
    res.redirect('/');
    res.end();
})

module.exports = homepage;