const io  = require('socket.io')();
const database = require('../configs/database');

let sessionId;
//EVENT LISTENER THAT WILL TRIGGER CLIENT SIDE TO UPDATE RECORDS IN REALTIME

exports.insertData = (data) => {
    io.emit('insertData', data);
}

exports.selectData = (data) => {
    io.to(`room-${sessionId}`).emit('select', data);
}

exports.latestData = (data, id) => {
    io.to(`room-${id}`).emit('latestData', data);
}

exports.modifiedData = (data) => {
    io.emit('modifiedData', data )
}

exports.deleteRecords = (data) => {
    io.emit('deleteRecords', data);
}

exports.newUser = (user) => {
    io.emit('newUser', user);
}

exports.users = (users) => {
    io.emit('userList', users);
}

exports.permissions = (id) => {
    // console.log(id);
    io.to(`room-${id}`).emit('permissionChanged');
}

exports.updatePermitUI = (status, employeeId) => {
    io.emit('updatePermitUI', status, employeeId);
}

exports.deletedAcc = (id) => {
    io.emit('deletedAcc', id);
}

exports.deletedAccNotif = (id) => {
    io.emit('deletedAccNotif', id);
}

exports.sortRegular = (data, id) => {
    io.to(`room-${id}`).emit('sortReg', data);
}

exports.sortSpecial = (data, id) => {
    io.to(`room-${id}`).emit('sortSpe', data);
}

exports.sortTrust = (data, id) => {
    io.to(`room-${id}`).emit('sortTrs', data);
}

exports.searchResult = (data, id, term) => {
    io.to(`room-${id}`).emit('searchResult', data, term);
} 


//TO CHECK THE CONNECTION IS ESTABLISHED
io.on('connection', socket => {
    // console.log('Socket connected: ', socket.id);
    // const sessionId = sessionStorage.getItem('sessionId');
    socket.on('loadLatestData', (Id) => {
        sessionId = Id;
        socket.join(`room-${Id}`);
        database.query(`SELECT * FROM refJevHomepagetbl`, (err, data) => {
            if(err) console.log(err);
            this.latestData(data, Id);
        })
    })

    socket.on('loadUsers', () => {
        database.query(`SELECT * FROM accountTbl ORDER BY isActive ASC, fName DESC`, (err, data) => {
            if(err) console.log(err);
            this.users(data.recordset);
        })
    })

})
exports.io = io;