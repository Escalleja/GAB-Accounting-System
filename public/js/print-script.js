printFunc();

function printFunc(){
const printBtn = document.getElementById('print-btn');

printBtn.addEventListener('click', () => {
    window.print();
})
}

const editBtn = document.getElementById('edit-btn');
const checkBtn = document.getElementById('check-btn');

editBtn.onclick = () => {
    editBtn.style.display = "none";
    checkBtn.style.display = "block";

    let editTitleYear = document.getElementById('year');
    let editFundNo = document.getElementById('fundNo');
    let editTotalDebit = document.getElementById('totalDebit');
    let editTotalCredit = document.getElementById('totalCredit');

    let inputTitleYear = document.createElement('input');
    let inputFundNo = document.createElement('input');
    let inputTotalDebit = document.createElement('input');
    let inputTotalCredit = document.createElement('input');

    inputTitleYear.setAttribute('class', 'edit-input');
    inputFundNo.classList.add('edit-input', 'red');
    inputTotalDebit.setAttribute('class', 'edit-total');
    inputTotalCredit.setAttribute('class', 'edit-total');

    inputTitleYear.value = editTitleYear.innerHTML;
    inputFundNo.value = editFundNo.innerHTML;
    inputTotalDebit.value = editTotalDebit.innerHTML;
    inputTotalCredit.value = editTotalCredit.innerHTML;

    checkBtn.onclick = () => {
        editBtn.style.display = 'block';
        checkBtn.style.display = "none";

        let pTitleYear = document.createElement('p');
        let pFundNo = document.createElement('p');
        let pTotalDebit = document.createElement('p');
        let pTotalCredit = document.createElement('p');

        pTitleYear.innerHTML = inputTitleYear.value;
        pFundNo.innerHTML = inputFundNo.value;
        pTotalDebit.innerHTML = inputTotalDebit.value;
        pTotalCredit.innerHTML = inputTotalCredit.value;

        pTitleYear.setAttribute('id', 'year');
        pFundNo.setAttribute('id', 'fundNo');
        pFundNo.setAttribute('class', 'red');
        pTotalDebit.setAttribute('id', 'totalDebit');
        pTotalCredit.setAttribute('id', 'totalCredit');

        if (pTitleYear.innerHTML === 'Add Year'){
            alert('Year is blank');
            return;
        }
        if (pFundNo.innerHTML === 'Add Fund No.'){
            alert('Fund No. is blank');
            return;
        }
        if (pTotalDebit.innerHTML === "Add Total Credit"){
            alert('Total Debit is blank');
            return;
        }
        if (pTotalCredit.innerHTML === 'Add Total Debit'){
            alert('Total Credit is blank');
            return;
        }
        
        if (inputTitleYear.parentNode) {
            inputTitleYear.parentNode.replaceChild(pTitleYear, inputTitleYear);
        }

        if (inputFundNo.parentNode) {
        inputFundNo.parentNode.replaceChild(pFundNo, inputFundNo);
        }

        if (inputTotalDebit.parentNode) {
                inputTotalDebit.parentNode.replaceChild(pTotalDebit, inputTotalDebit);
        }

        if (inputTotalCredit.parentNode) {
            inputTotalCredit.parentNode.replaceChild(pTotalCredit, inputTotalCredit);
        }
    };
};