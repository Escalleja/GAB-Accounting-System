const buttonStyle = document.querySelectorAll('.suggested-btn button');

let sortedRegular = false;
const regularbtn = document.getElementById('reg-btn');
regularbtn.addEventListener('click', async (e) => {
    
    switch(true){
        case sortedSpecial: sortedSpecial = false;
                            buttonStyle[1].removeAttribute('style');
                            break;
        case sortedTrust:   sortedTrust = false;
                            buttonStyle[2].removeAttribute('style');
                            break;
    }
    if(!sortedRegular){
        const response = await fetch(`/sortedRegular`, {
            method: 'GET',
            headers: {'Content-Type' : 'application/json'}
        })

        const result = await response.json();

        if(result.status === 'sorted'){
            sortedRegular = true;
            buttonStyle[0].style.backgroundColor = '#379237';
            buttonStyle[0].style.color = '#fff';
        }
    }else{
        sortedRegular = false;
        const sessionId = sessionStorage.getItem('sessionId');
        socket.emit('loadLatestData', sessionId);
        buttonStyle[0].removeAttribute('style');
    }
})

let sortedSpecial = false;
const specialBtn = document.getElementById('spcl-btn');

specialBtn.addEventListener('click', async () => {
    
    switch(true){
        case sortedRegular: sortedRegular = false;
                            buttonStyle[0].removeAttribute('style');
                            break;
        case sortedTrust:   sortedTrust = false;
                            buttonStyle[2].removeAttribute('style');
                            break;
    }
    if(!sortedSpecial){
        const response = await fetch(`/sortedSpecial`, {
            method: 'GET',
            headers: {'Content-Type' : 'application/json'}
        })

        const result = await response.json();

        if(result.status === 'sorted'){
            sortedSpecial = true;
            buttonStyle[1].style.backgroundColor = '#379237';
            buttonStyle[1].style.color = '#fff';
        }
    }else{
        sortedSpecial = false;
        const sessionId = sessionStorage.getItem('sessionId');
        socket.emit('loadLatestData', sessionId);
        buttonStyle[1].removeAttribute('style');
    }
})

let sortedTrust = false;
const trustBtn = document.getElementById('trs-btn');

trustBtn.addEventListener('click', async () => {

    switch(true){
        case sortedRegular: sortedRegular = false;
                            buttonStyle[0].removeAttribute('style');
                            break;
        case sortedSpecial: sortedSpecial = false;
                            buttonStyle[1].removeAttribute('style');
                            break;
    }
    if(!sortedTrust){
        const response = await fetch(`/sortedTrust`, {
            method: 'GET',
            headers: {'Content-Type' : 'application/json'}
        })

        const result = await response.json();

        if(result.status === 'sorted'){
            sortedTrust = true;
            buttonStyle[2].style.backgroundColor = '#379237';
            buttonStyle[2].style.color = '#fff';   
        }
    }else{
        sortedTrust = false;
        const sessionId = sessionStorage.getItem('sessionId');
        socket.emit('loadLatestData', sessionId);
        buttonStyle[2].removeAttribute('style');
    }
})
