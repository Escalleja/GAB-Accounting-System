const socket = io.connect();

displayPrint();
printFunc();

function displayPrint(){
    const dataFeedLine = printData.replace(/\n/g, '[LF]');

    const sanitizedData = dataFeedLine.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    const withFeedLine = sanitizedData.replace(/\[LF\]/g, '\<br>');
    const parsedData = JSON.parse(withFeedLine);

    console.log(printData)

    parsedData.forEach((data) => {
        const contentRow = document.getElementById('content-row');
        const footer = document.getElementById('tfoot');
        const tr = document.createElement('TR');

        console.log(data);
        tr.innerHTML = `
        <td class="center">${data.date0}</td>
        <td class="center">${data.TableName.slice(3)} </td>
        <td>${data.description}</td>
        <td class="center">${data.uacs}</td>
        <td class="right">${data.debit}</td>
        <td class="right">${data.credit}</td>
        `;
        contentRow.append(tr);
    });
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