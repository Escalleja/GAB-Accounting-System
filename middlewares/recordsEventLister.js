const io  = require('socket.io')();
const database = require('../configs/database');

//EVENT LISTENER THAT WILL TRIGGER CLIENT SIDE TO UPDATE RECORDS IN REALTIME

exports.insertData = (data) => {
    io.emit('insertData', data);
}

exports.selectData = (data) => {
    io.emit('select', data);
}

exports.latestData = (data) => {
    io.emit('latestData', data);
}

exports.modifiedData = (data) => {
    io.emit('modifiedData', data )
}

//TO CHECK THE CONNECTION IS ESTABLISHED
io.on('connection', socket => {
    console.log('Socket connected: ', socket.id);

    database.query(`SELECT * FROM refJevHomepagetbl`, (err, data) => {
        if(err) console.log(err);
        console.log(data);
        this.latestData(data);
    })
    
})

exports.io = io;