const io  = require('socket.io')();

//EVENT LISTENER THAT WILL TRIGGER CLIENT SIDE TO UPDATE RECORDS IN REALTIME

exports.insertData = (data) => {
    io.emit('insertData', data);
}

exports.selectData = (data) => {
    io.emit('select', data);
}

exports.modifiedData = (data) => {
    io.emit('modifiedData', data )
}
//TO CHECK THE CONNECTION IS ESTABLISHED
io.on('connection', socket => {
    console.log('Socket connected: ', socket.id);
})

exports.io = io;