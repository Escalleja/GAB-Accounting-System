const io  = require('socket.io')();
const database = require('../configs/database');

//EVENT LISTENER THAT WILL TRIGGER CLIENT SIDE TO UPDATE RECORDS IN REALTIME

exports.insertData = (data) => {
    io.emit('insertData', data);
}
exports.regularInsertData = (data) => {
    io.emit('regularInsertData', data);
}
exports.specialInsertData = (data) => {
    io.emit('regularInsertData', data);
}
exports.trustInsertData = (data) => {
    io.emit('regularInsertData', data);
}

exports.selectData = (data) => {
    io.emit('select', data);
}

exports.latestData = (data) => {
    io.emit('latestData', data);
}
exports.regularLatestData = (data) => {
    io.emit('regularLatestData', data);
}
exports.specialLatestData = (data) => {
    io.emit('specialLatestData', data);
}
exports.trustLatestData = (data) => {
    io.emit('trustLatestData', data);
}


exports.modifiedData = (data) => {
    io.emit('modifiedData', data )
}

exports.deleteRecords = (data) => {
    io.emit('deleteRecords', data);
}

//TO CHECK THE CONNECTION IS ESTABLISHED
io.on('connection', socket => {
    console.log('Socket connected: ', socket.id);

    database.query(`SELECT * FROM refJevHomepagetbl`, (err, data) => {
        if(err) console.log(err);
        this.latestData(data);
    })
    
})
//THIS IS FOR FUND 01 PAGE
io.on('connection', socket => {

    database.query(`SELECT * FROM refJevHomepagetbl WHERE jevNo LIKE 'tbl01%'`, (err, data) => {
        if(err) console.log(err);
        this.regularLatestData(data);
    })
    
})
//THIS IS FOR FUND 03 PAGE
io.on('connection', socket => {

    database.query(`SELECT * FROM refJevHomepagetbl WHERE jevNo LIKE 'tbl03%'`, (err, data) => {
        if(err) console.log(err);
        this.specialLatestData(data);
    })
    
})
//THIS IS FOR FUND 07 PAGE
io.on('connection', socket => {

    database.query(`SELECT * FROM refJevHomepagetbl WHERE jevNo LIKE 'tbl07%'`, (err, data) => {
        if(err) console.log(err);
        this.trustLatestData(data);
    })
    
})
exports.io = io;