const socket = io.connect();

displayPrint();
printFunc();

function displayPrint(){
    let totalDebit = 0;
    let totalCredit = 0;
    const dataFeedLine = printData.replace(/\n/g, '[LF]');

    const sanitizedData = dataFeedLine.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    const withFeedLine = sanitizedData.replace(/\[LF\]/g, '\<br>');
    const parsedData = JSON.parse(withFeedLine);

    parsedData.forEach((data) => {
        const contentRow = document.getElementById('content-row');
        const footer = document.getElementById('tfoot');
        const tr = document.createElement('TR');
        const trBlank = document.createElement('TR');

        const jevFund = document.getElementById('jev-fund');
        const jevNo = document.getElementById('jev-no');
        const jevDate = document.getElementById('jev-date');
        const employee = document.getElementById('employee');

        jevFund.textContent = data.TableName.slice(3, 5);
        jevNo.textContent = data.TableName.slice(6);
        employee.textContent = sessionStorage.getItem('name');
        jevDate.textContent = data.date0;

        let indent = data.debit === '' ? `<td class="center debit-indent">${data.description}</td>` : `<td class="center credit-indent">${data.description}</td>`

        trBlank.innerHTML = `
        <tr>
        <td contenteditable="true"><span>&ThickSpace;</span></td>
        <td><span>&ThickSpace;</span></td>
        <td><span>&ThickSpace;</span></td>
        <td><span>&ThickSpace;</span></td>
        <td><span>&ThickSpace;</span></td>
        </tr>
        `;
        tr.innerHTML = `
        <td class="center"contenteditable="true"></td>
        ${indent}
        <td>${data.uacs}</td>
        <td class="right">${data.debit}</td>
        <td class="right">${data.credit}</td>
        `;
        let debitStr = data.debit;
        let creditStr = data.credit;

        if(debitStr != ''){
            let debitValue = parseFloat(debitStr.replace(/,/g, ''));
            totalDebit += debitValue;
        }
        if(creditStr != ''){
            let creditValue = parseFloat(creditStr.replace(/,/g, ''));
            totalCredit += creditValue;
        }

        contentRow.append(tr);
        contentRow.append(trBlank);
    });
    formatTotal(totalDebit, totalCredit);
}

function formatTotal(totalDebit, totalCredit){
    const debitTotalAmount = document.getElementById('totalDebit');
    const creditTotalAmount = document.getElementById('totalCredit');
    const totalDebitStr = String(totalDebit);
    const totalCreditStr = String(totalCredit);

    if(totalDebitStr.includes(".")){
        debitTotalAmount.textContent = totalDebit.toLocaleString('en-US');
    }else{
        debitTotalAmount.textContent = totalDebit.toLocaleString('en-US') + ".00";
    }

    if(totalCreditStr.includes(".")){
        creditTotalAmount.textContent = totalCredit.toLocaleString('en-US');
    }else{
        creditTotalAmount.textContent = totalCredit.toLocaleString('en-US') + ".00";
    }
}

function printFunc(){
const printBtn = document.getElementById('print-btn');

printBtn.addEventListener('click', () => {
    window.print();
})
}

const editBtn = document.getElementById('edit-btn');
const checkBtn = document.getElementById('check-btn');

editBtn.addEventListener('click', () => {
    editBtn.style.display = 'none';
    checkBtn.style.display = 'block';

    let editTitleYear = document.getElementById('year');
    let editFundNo = document.getElementById('fundNo');

    let inputTitleYear = document.createElement('input');
    let inputFundNo = document.createElement('input');

    inputTitleYear.setAttribute('class', 'edit-input');
    inputFundNo.classList.add('edit-input', 'red');

    inputTitleYear.value = editTitleYear.innerHTML;
    inputFundNo.value = editFundNo.innerHTML;

    editTitleYear.parentNode.replaceChild(inputTitleYear, editTitleYear);
    editFundNo.parentNode.replaceChild(inputFundNo, editFundNo);

    checkBtn.addEventListener('click', () => {
        editBtn.style.display = 'block';
        checkBtn.style.display = 'none';

        let pTitleYear = document.createElement('p');
        let pFundNo = document.createElement('p');

        pTitleYear.innerHTML = inputTitleYear.value;
        pFundNo.innerHTML = inputFundNo.value;

        pTitleYear.setAttribute('id', 'year');
        pFundNo.setAttribute('id', 'fundNo');
        pFundNo.setAttribute('class', 'red');

        inputTitleYear.parentNode.replaceChild(pTitleYear, inputTitleYear);
        inputFundNo.parentNode.replaceChild(pFundNo, inputFundNo);

    });
});

const backBtn = document.getElementById('back-btn');

backBtn.addEventListener('click', () => {
    window.location.href = '/';
})