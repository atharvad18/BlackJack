//let haveit = [];
 /*function randomcard(){
    let randomindex = Math.floor( (Math.random() * 13)) ;
    return blackjack['dict'][randomindex];
}
function randomsuit(){
    let randomindex = Math.floor( (Math.random() * 4) );
    return blackjack['cardsuit'][randomindex];
}*/

function randomindex(num) {
    return Math.floor(Math.random() * num);
};

let  blackjack= {
    'you': {'scorespan':'#yourscore' , 'div': '#your-box' ,'score': 0},
    'dealer': {'scorespan':'#dealerscore' , 'div': '#dealer-box' ,'score': 0},
     'dict' : ['2', '3', '4', '5','6' ,'7' ,'8', '9' ,'10','jack','queen','king','ace'],
     'cardsuit' : ['_of_hearts','_of_spades','_of_clubs','_of_diamonds'],
     'cardmap' : {'2': 2, '3':3, '4':4, '5':5,'6':6 ,'7':7 ,'8':8, '9':9 ,'10':10,'jack':10,'queen':10,'king':10,'ace':[1,11]},
     'wins' : 0,
     'draws': 0,
     'losses':0
};
const YOU = blackjack['you'];
const DEALER = blackjack['dealer'];


//non-repeating random card
let allcards = [];
for(let i=0;i<blackjack['dict'].length;i++){
    for(let j=0;j<blackjack['cardsuit'].length;j++){
        allcards.push({'value':blackjack['dict'][i],'suit':blackjack['cardsuit'][j]});
    }
};


//buttons activation
document.querySelector('#Hit').addEventListener('click',blackjackHit);
document.querySelector('#Stand').addEventListener('click',stand);
document.querySelector('#Deal').addEventListener('click',deal);

//sounds
const hitsound = new Audio('./sounds/swish.m4a');
const losssound = new Audio('./sounds/aww.mp3');
const winsound = new Audio('./sounds/cash.mp3');

var j = 52;

//blackjack hit
function blackjackHit(){
    let temp = randomindex(j);
    let card = allcards[temp]['value'];
    let suit = allcards[temp]['suit'];
    showcard(YOU,card,suit);
    updatescore(YOU,card);
    showscore(YOU);
    let TEMP = allcards[temp]
    allcards[temp] = allcards[j-1];
    allcards[j-1] = TEMP;
    j--;
    if(YOU['score']>21){
        document.querySelector('#message').textContent = 'You Lost!';
        document.querySelector('#message').style.color = 'red';
        document.getElementById('Stand').style.visibility = 'hidden';
        document.getElementById('Hit').style.visibility = 'hidden';
        losssound.play();
        blackjack['losses']++;
        document.querySelector('#Losses').textContent = blackjack['losses'];
    }
}

//showcard function
function showcard(activeplayer,card,suit){
    if(activeplayer['score'] < 21){
        let cardimage = document.createElement('img');
        cardimage.src = './images/' + card + suit + '.png';
        document.querySelector(activeplayer['div']).appendChild(cardimage);
        hitsound.play();
    }
}

//function update score
function updatescore(activeplayer,card){
    if(card=='ace'){
        if(activeplayer['score']<=10) activeplayer['score'] += 11;
        else activeplayer['score'] += 1;
    }else{
        activeplayer['score'] += blackjack['cardmap'][card];
    }
}

//function to show the score
function showscore(activeplayer){
    if(activeplayer['score'] > 21 ){
        document.querySelector(activeplayer['scorespan']).textContent = 'BUSTED!';
        document.querySelector(activeplayer['scorespan']).style.color = 'red';
    }
    else{
        document.querySelector(activeplayer['scorespan']).textContent = activeplayer['score'];
    }
}

//stand function
function stand(){
    document.getElementById('Hit').style.visibility = 'hidden';
    document.getElementById('Stand').style.visibility = 'hidden';
    let temp_score = YOU['score'];
    while(DEALER['score']<temp_score || DEALER['score']==temp_score && DEALER['score']<=15){
        let temp = randomindex(j);
        let card = allcards[temp]['value'];
        let suit = allcards[temp]['suit'];
        showcard(DEALER,card,suit);
        updatescore(DEALER,card);
        showscore(DEALER);
    }
    showresult(Winner());
}
//deal function
function deal(){
    document.getElementById('Hit').style.visibility = 'visible';
    document.getElementById('Stand').style.visibility = 'visible';
    Array.from(document.querySelectorAll('#your-box img')).forEach(el => el.remove());
    Array.from(document.querySelectorAll('#dealer-box img')).forEach(el => el.remove());
    document.querySelector('#yourscore').textContent = 0;
    document.querySelector('#dealerscore').textContent = 0;
    document.querySelector('#yourscore').style.color = 'white';
    document.querySelector('#dealerscore').style.color = 'white';
    YOU['score'] = 0;
    DEALER['score'] = 0;
    document.querySelector('#message').textContent = 'Lets Play!'
    document.querySelector('#message').style.color = 'black';
    document.querySelector('#yourscore').style.color = 'white';
    j = 52;
}

//function to decide winner
function Winner(){
    if(YOU['score']<=21){
        if(YOU['score'] > DEALER['score'] || DEALER['score']>21){
            return YOU;
        }else if(YOU['score']<DEALER['score']){
            return DEALER;
        }
        else if(YOU['score'] == DEALER['score']) return null; 
    }
    else{
        return DEALER;
    }
}

//function to show results
function showresult(winner){
    let message , color;
    if(winner === YOU){
        winsound.play();
        message = "You Won!";
        color = 'green';
        blackjack['wins']++;
        document.querySelector('#Wins').textContent = blackjack['wins'];
    }else if(winner===null){
        message = "Match Drawn!";
        color = 'black';
        blackjack['draws']++;
        document.querySelector('#Draws').textContent = blackjack['draws'];
    }else{
        losssound.play();
        message = "You Lost!"
        color = 'red';
        blackjack['losses']++;
        document.querySelector('#Losses').textContent = blackjack['losses'];
    }
    document.querySelector('#message').textContent = message;
    document.querySelector('#message').style.color = color; 
}