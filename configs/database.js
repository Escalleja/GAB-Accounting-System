const express = require('express');
var app = express();
const sql = require('mssql');
var database = express.Router();
require('dotenv').config();

//Connecting Database
const config = {
    user: process.env.DB_ACCOUNTING_USER,
    password: process.env.DB_ACCOUNTING_PASSWORD,
    server: process.env.DB_ACCOUNTING_SERVER,
    database: process.env.DB_ACCOUNTING_DATABASE,
    options: {
        trustedconnection: true,
        trustServerCertificate: true,
        enableArithAbort: true,
        instancename: process.env.DB_ACCOUNTING_INSTANCE,
    },

    port: 3000
};

//Checking Connection
database = sql.connect(config, (err) =>{
    if(err){
        console.log('Connection Failed', err);
    }
    console.log("connected to database");
})

module.exports = database;
// app.get('/', function (req, res){
//     var sql = require('mssql');

//     //Config Database
//     // var config = {
//     //     user: 'KRISTINE',
//     //     password: '',
//     //     server: 'KRISTINE\\SQLEXPRESS',
//     //     database: 'GAB',
//     //     options: {
//     //         trustedconnection: true,
//     //         trustServerCertificate: true,
//     //         enableArithAbort: true,
//     //         instancename: '/SQLEXPRESS'
//     //     }
//     // };

//     //connecting database
//     // sql.connect(config, function (err)){
//     //     if (err) console.log(err);

//     //     //Create request object
//     //     sql.query()
//     // }

//     sql.connect(config, (err) => {
//         if(err){
//             console.log(err);
//             return;
//         }else{
//             console.log("connected");
//         }
//     })
// })
