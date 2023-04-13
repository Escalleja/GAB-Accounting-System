//INITIALIZE SOCKET.IO
const socket = io.connect();

//TO HAVE A CONNECTION TO SERVER
socket.on('connect', () => {
    console.log('Successfully connected');
})

socket.on('latestData', data => {
    const tableRow = document.querySelector('#tbody-records');
    tableRow.innerHTML = '';

    data.recordset.forEach((item) => {
        console.log(item);
        const tr = document.createElement('tr');
        tr.setAttribute('class', 'table-content');
        tr.setAttribute('data-id', 'item.jevNo');

        tr.innerHTML = `
        <td id="jev-no"><i class="fa-solid fa-file"></i>&ThickSpace;
            ${item.jevNo.slice(3)}
        </td>
        <td><span>${ item.dateCreated }</span> <span class="byName"> by
                ${ item.createdBy }</span></td>
        <td><span>${ item.dateModified }</span> <span class="byName"> by
                ${ item.modifiedBy }</span></td>
        <td id="selected-item"><input type="checkbox" name="chk" id=""></td>
            `;
        tableRow.append(tr);
    })
})