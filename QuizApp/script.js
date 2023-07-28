const gameBoard = document.querySelector('#gameboard');
const scoreDisplay = document.querySelector('#user-score');

let userScore = 0;

const count = 1;
const difficulty = ['easy', 'medium', 'hard'];

const genres = [
    {
        name: 'IT',
        id: 18
    },
    {
        name: 'Math',
        id: 19
    },
    {
        name: 'Vehicles',
        id: 28
    },
    {
        name: 'Games',
        id: 15
    },
];

function addGenre(genre){
    const column = document.createElement('div');
    column.classList.add('genre-column');
    
    difficulty.forEach(difficultyLevel =>{

        const card = document.createElement('div');
        card.classList.add('card');

        if(difficultyLevel === 'easy'){
            card.innerText = 100;
        }
        if(difficultyLevel === 'medium'){
            card.innerText = 200;
        }
        if(difficultyLevel === 'hard'){
            card.innerText = 300;
        }


        column.append(card);

        fetch(`https://opentdb.com/api.php?amount=${count}&category=${genre.id}&difficulty=${difficultyLevel}&type=boolean`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            card.setAttribute('data-question', data.results[0].question);
            card.setAttribute('data-answer', data.results[0].correct_answer);
            card.setAttribute('data-value', card.getInnerHTML())
        })
        .then(done => card.addEventListener('click', flipCard));
    });
    
    gameBoard.append(column);
}

genres.forEach(e => addGenre(e));

function flipCard(){
    console.log('clicked');
    const textDisplay = document.createElement('p');
    const trueButton = document.createElement('button');
    const falseButton = document.createElement('button');
    trueButton.textContent = 'True';
    falseButton.textContent = 'False';
    textDisplay.innerHTML = this.getAttribute('data-question');
    this.append(textDisplay,trueButton,falseButton);
    const allCards = Array.from(document.querySelectorAll('.card'));
    allCards.forEach(card => card.removeEventListener('click',flipCard));

    // BUTTONS:
    trueButton.addEventListener('click', getResult);
    falseButton.addEventListener('click', getResult);
}

function getResult(){
    const allCards = Array.from(document.querySelectorAll('.card'));
    allCards.forEach(card => card.addEventListener('click',flipCard));
    
    const cardOfButton = this.parentElement;
    if(cardOfButton.getAttribute('data-answer') === this.innerText){
        userScore += parseInt(cardOfButton.getAttribute('data-value'));
        scoreDisplay.textContent = userScore;
        cardOfButton.classList.add('correct-answer');
        console.log('match');
        while(cardOfButton.firstChild){
            cardOfButton.removeChild(cardOfButton.lastChild);
        }
        cardOfButton.innerText = cardOfButton.getAttribute('data-value');
    }else{
        cardOfButton.classList.add('wrong-answer');
        while(cardOfButton.firstChild){
            cardOfButton.removeChild(cardOfButton.lastChild);
        }
        cardOfButton.innerText = 0;
    }

    cardOfButton.removeEventListener('click', flipCard);
}