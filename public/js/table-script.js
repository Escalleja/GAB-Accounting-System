//INITIALIZE SOCKET.IO
const socket = io.connect();

//TO HAVE A CONNECTION TO SERVER
socket.on('connect', () => {
    console.log('Successfully connected');
    const sessionId = sessionStorage.getItem('sessionId');
    socket.emit('loadLatestData', sessionId);
})

//THIS WILL UPDATE THE UI WITH LATEST DATA THIS WILL TRIGGER DURING THE ESTABLISHMENT OF CONNECTION WHEN PAGE LOADS
socket.on('latestData', (data) => {
    const tableRow = document.querySelector('#tbody-records');
    tableRow.innerHTML = ``;
    data.recordset.forEach((item) => {
        const tr = document.createElement('tr');
        tr.setAttribute('class', 'table-content');
        tr.setAttribute('data-id',  `${item.jevNo}`);

        tr.innerHTML = `
        <td id="jev-no"><i class="fa-solid fa-file"></i>&ThickSpace;
            ${item.jevNo.slice(3)}
        </td>
        <td>
            <span class="date">${ item.dateCreated }</span> 
            <span class="byName"> by </span>
            <span class="byName"> ${ item.createdBy }</span>
        </td>
        <td>
            <span id="date-modified" class="date">${ item.dateModified }</span> 
            <span class="byName"> by </span>
            <span id="name-modified" class="byName">${ item.modifiedBy }</span>
        </td>
        <td id="selected-item">
            <input type="checkbox" name="chk" id="">
        </td>
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
    const jevIdStr = `"${data}"`
    const jevArray = jevIdStr.match(/\w+/g);
    const deleteJev = new Set(jevArray);

    rows.forEach((row) => {
        if(deleteJev.has(row.dataset.id)){
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
            <span class="date"> ${data.recordset[0].dateCreated} </span> 
            <span class="byName"> by ${data.recordset[0].createdBy} </span>
        </td>
        <td>
            <span id="date-modified" class="date">${data.recordset[0].dateModified} </span> 
            <span class="byName"> by </span>
            <span id="name-modified" class="byName">${data.recordset[0].modifiedBy} </span>
        </td>

        <td id="selected-item">
            <input type="checkbox" name="chk" id="">
        </td>
        `;
        tableContent.prepend(newTableRow);
    }

});

socket.on('sortReg', (data) => {
    console.log('sortReg', data);
    const tableRow = document.querySelector('#tbody-records');
    tableRow.innerHTML = '';

    data.forEach((item) => {
        const tr = document.createElement('tr');
        tr.setAttribute('class', 'table-content');
        tr.setAttribute('data-id', `${item.jevNo}`);

        tr.innerHTML = `
            <td>
                <i class="fa-solid fa-file"></i>&ThickSpace; ${item.jevNo.slice(3)}
            </td>
            <td>
                <span class="date">${item.dateCreated}</span>
                <span class="byName"> by </span>
                <span class="byName"> ${item.createdBy}</span>
            </td>
            <td>
                <span id="date-modified" class="date">${item.dateModified}</span>
                <span class="byName"> by </span>
                <span id="name-modified" class="byName">${item.modifiedBy}</span>
            </td>
            <td id="selected-item">
                <input type="checkbox" name="chk" id="">
            </td>
        `;
        tableRow.append(tr);
    })
})

socket.on('sortSpe', (data) => {
    const tableRow = document.querySelector('#tbody-records');
    tableRow.innerHTML = '';

    data.forEach((item) => {
        const tr = document.createElement('tr');
        tr.setAttribute('class', 'table-content');
        tr.setAttribute('data-id', `${item.jevNo}`);

        tr.innerHTML = `
            <td>
                <i class="fa-solid fa-file"></i>&ThickSpace; ${item.jevNo.slice(3)}
            </td>
            <td>
                <span class="date">${item.dateCreated}</span>
                <span class="byName"> by </span>
                <span class="byName"> ${item.createdBy}</span>
            </td>
            <td>
                <span id="date-modified" class="date">${item.dateModified}</span>
                <span class="byName"> by </span>
                <span id="name-modified" class="byName">${item.modifiedBy}</span>
            </td>
            <td id="selected-item">
                <input type="checkbox" name="chk" id="">
            </td>
        `;
        tableRow.append(tr);
    })
})

socket.on('sortTrs', (data) => {
    const tableRow = document.querySelector('#tbody-records');
    tableRow.innerHTML = '';

    data.forEach((item) => {
        const tr = document.createElement('tr');
        tr.setAttribute('class', 'table-content');
        tr.setAttribute('data-id', `${item.jevNo}`);

        tr.innerHTML = `
            <td>
                <i class="fa-solid fa-file"></i>&ThickSpace; ${item.jevNo.slice(3)}
            </td>
            <td>
                <span class="date">${item.dateCreated}</span>
                <span class="byName"> by </span>
                <span class="byName"> ${item.createdBy}</span>
            </td>
            <td>
                <span id="date-modified" class="date">${item.dateModified}</span>
                <span class="byName"> by </span>
                <span id="name-modified" class="byName">${item.modifiedBy}</span>
            </td>
            <td id="selected-item">
                <input type="checkbox" name="chk" id="">
            </td>
        `;
        tableRow.append(tr);
    })
})

//FUNCTION FOR SEARCH
socket.on('searchResult', (data, term) => {
    
    if (data.length > 0){
        
        data.forEach((jev) => {
            const firstRow = document.querySelector('.table-content');
            const searchedRow = document.querySelector(`.table-content[data-id='${jev.jevNo}']`);
            const searchRow = document.createElement('tr');
            searchRow.setAttribute('class', 'table-content');
            searchRow.setAttribute('data-id', `${jev.jevNo}`);

            searchRow.innerHTML = `
            <td>
                <i class="fa-solid fa-file"></i>&ThickSpace; ${jev.jevNo.slice(3)}
            </td>
            <td>
                <span class="date">${jev.dateCreated}</span>
                <span class="byName"> by </span>
                <span class="byName">${jev.createdBy}</span>
            </td>
            <td>
                <span id="date-modified" class="date">${jev.dateModified}</span>
                <span class="byName"> by </span>
                <span id="name-modified" class="byName">${jev.modifiedBy}</span>
            </td>
            <td id="selected-item">
                <input type="checkbox" name="chk" id="">
            </td>
            `;

            if(firstRow !== null && searchedRow !== null){
                firstRow.parentNode.insertBefore(searchRow, firstRow);
                searchedRow.remove();
            }
        })
    }else{
        alert(`No results found for '${term}'`);
    }
})
    //#region FUNCTION FOR CHECKBOX
    let chktable = document.querySelector('#tbody-records');
    let checkedRow = new Set();

    chktable.addEventListener('click', async (e) => {
        if(e.target && e.target.nodeName == 'INPUT'){
            let row = e.target;
        
            row.addEventListener('change', () => {

                isAllCheck(); 

                let trRow = row.parentElement.parentElement;

                if(e.target.checked){
                    trRow.style.backgroundColor = "#C2DBFF";
                    checkedRow.add(trRow.dataset.id);
                    document.querySelector('.content-header-btn').style.display = "block";
                } else{
                    checkedRow.delete(trRow.dataset.id);

                    trRow.removeAttribute('style');
                    trRow.setAttribute('class', 'table-content');
                }
            }) 
        }
    })
    // #endregion

    //#region FUNCTION TO CHECK IF CHECKBOX IS CHECKED OR NOT
    function isAllCheck(){
        const tblHeadBtn = document.querySelector('.content-header-btn');

        if(checkedRow.size === 0){
            tblHeadBtn.style.display = "none";
        } else{
            tblHeadBtn.style.display = "block";
        }
    }
    // #endregion
    
    //#region CANCEL BUTTON FOR DESELECT CHECKBOX
    const cancelBtn = document.getElementById('checkbox-cancel');

    cancelBtn.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('[name="chk"]');

        checkboxes.forEach((checkbox) => {
            const trRow = checkbox.parentElement.parentElement;

            if(checkbox.checked){
                checkbox.checked = false;
                trRow.removeAttribute('style');
                trRow.setAttribute('class', 'table-content');
            }
        })
        checkedRow.clear();
        isAllCheck()
    })
    // #endregion
    
    //#region MULTIPLE DELETION OF JEV TABLE
    const deleteBtn = document.getElementById('checkbox-delete');

    deleteBtn.addEventListener('click', async () => {
        const stringJevIds = [...checkedRow];

        const encodedJevIds = encodeURIComponent(stringJevIds);

        const response = await fetch('/authDelete', {
            method: 'GET',
            headers: {'Content-Type' : 'application/json'}
        })
        
        const result = await response.json();

        if(result.status === 'authorized'){
            let message = "Are you sure you want to delete this?"

            if(confirm(message) === true){
                
                const response = await fetch(`/jevDelete/${encodedJevIds}`, {
                    method: 'POST',
                    headers: {'Content-Type' : 'application/json'}
                })

                const result = await response.json();

                if(result.status === 'Success') {
                    checkedRow.clear();
                    isAllCheck();
                    alert('JEV Deleted.');
                } else {
                    alert('Something went wrong.');
                    return;
                }
            }
        } else{
            alert("You are not authorized to delete.");
        }
    })
    // #endregion
    
    ////#region MULTIPLE PRINT OF JEV TABLE
    const printBtn = document.getElementById('checkbox-print');

    printBtn.addEventListener('click', async () => {
        const stringJevIds = [...checkedRow];

        const encodedJevIds = encodeURIComponent(stringJevIds);

        const response = await fetch(`/print/${encodedJevIds}`, {
            method: 'GET',
            headers: {'Content-Type' : 'application/json'}
        })

        const result = await response.json();

        if (result.url != null){
            window.location.href = `${result.url}/${result.id}`;
        }
    })
    //#endregion