const regularTxt = document.getElementById('title-label');
const hrHide = document.getElementById('content-hr')

regularTxt.textContent ="Fund 01 - Regular";
regularTxt.style.marginTop = '50px'
hrHide.style.display = "none";

// INITIALIZE SOCKET.IO
const socket = io.connect();

//TO HAVE A CONNECTION TO SERVER
socket.on('connect', () => {
    console.log('Successfully Connected');
})

//THIS WILL UPDATE THE UI WITH LATEST DATA THIS WILL TRIGGER DURING THE ESTABLISHMENT OF CONNECTION WHEN PAGE LOADS
socket.on('regularLatestData', (data) => {
    const tableRow = document.querySelector('#tbody-records');
    tableRow.innerHTML = '';

    data.recordset.forEach((item) => {
        const tr = document.createElement('tr');
        tr.setAttribute('class', 'table-content');
        tr.setAttribute('data-id', `${item.jevNo}`);

        tr.innerHTML = `
        <td id="jev-no"><i class="fa-solid fa-file"></i>&ThickSpace;
            ${item.jevNo.slice(3)}
        </td>
        <td><span>${ item.dateCreated }</span> <span class="byName"> by
                ${ item.createdBy }</span></td>
        <td><span id="date-modified">${ item.dateModified }</span> <span id="name-modified" class="byName"> by
                ${ item.modifiedBy }</span></td>
        <td id="selected-item"><input type="checkbox" name="chk" id=""></td>
            `;
        tableRow.append(tr);
    })
})

//UPDATING UI WITH UPDATED DATA
socket.on('modifiedData', (data) => {
    
    const updateRow =  document.querySelector(`.table-content[data-id='${data.recordset[0].jevNo}']`);
    
    updateRow.querySelector('#date-modified').textContent = data.recordset[0].dateModified;
    updateRow.querySelector('#name-modified').innerHTML =`
        <span id="name-modified" class="byName"> by
            ${data.recordset[0].modifiedBy}
        </span>`;

    updateRow.parentNode.removeChild(updateRow);
 
    const firstRow = document.querySelector('.table-content');
    firstRow.parentNode.insertBefore(updateRow, firstRow);
})

//UPDATING UI TO REMOVE THE DELETED DATA
socket.on('deleteRecords', (data) => {
    const rows = document.querySelectorAll('.table-content');

    rows.forEach((row) => {
        if(row.dataset.id === data){
            row.remove();
        }
    })
})

// UPDATE FRONT END TABLE REALTIME WHEN DATA WAS INSERTED
socket.on('insertData', (data) => {

    const tableContent = document.querySelector('#tbody-records');

    if (tableContent) {
        const newTableRow = document.createElement('tr');
        newTableRow.setAttribute('class', 'table-content');
        newTableRow.setAttribute('data-id', `${data.recordset[0].jevNo}`);

        newTableRow.innerHTML = `
        <td id="propertyTag">
            <i class="fa-solid fa-file"></i>&ThickSpace;
            ${data.recordset[0].jevNo.slice(3)}
        </td>
        <td>
            <span> ${data.recordset[0].dateCreated} </span> 
            <span class="byName"> by ${data.recordset[0].createdBy} </span>
        </td>
        <td>
            <span id="date-modified">${data.recordset[0].dateModified} </span> 
            <span id="name-modified"class="byName"> by ${data.recordset[0].modifiedBy} </span>
        </td>

        <td id="selected-item"><input type="checkbox" name="chk" id=""></td>
    `;
        tableContent.prepend(newTableRow);
    }

});

socket.on('regularInsertData', (data) => {

    const tableContent = document.querySelector('#tbody-records');

    if (tableContent) {
        const newTableRow = document.createElement('tr');
        newTableRow.setAttribute('class', 'table-content');
        newTableRow.setAttribute('data-id', `${data.recordset[0].jevNo}`);

        newTableRow.innerHTML = `
        <td id="propertyTag">
            <i class="fa-solid fa-file"></i>&ThickSpace;
            ${data.recordset[0].jevNo.slice(3)}
        </td>
        <td>
            <span> ${data.recordset[0].dateCreated} </span> 
            <span class="byName"> by ${data.recordset[0].createdBy} </span>
        </td>
        <td>
            <span id="date-modified">${data.recordset[0].dateModified} </span> 
            <span id="name-modified"class="byName"> by ${data.recordset[0].modifiedBy} </span>
        </td>

        <td id="selected-item"><input type="checkbox" name="chk" id=""></td>
    `;
        tableContent.prepend(newTableRow);
    }

});