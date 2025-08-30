
//As a user, I want to see the bingo card clearly.

//As a user, I want to see  color on the stamp.

//As a user, I need to cover the numbers easily without any lag.

//As a user, I am expecting to get a number from each group.

//As a user, I should be able to get the right number to show and the number should be in the box .


//pseudocode

//intialize the numbers from 1-30
//use math.floor to call the random numbers from 1-30 randomly
//calling random numbers in the 9 boxes by using if else so every time random nnumbers will be called 
//use queryselector to generate the card so the numbers will be called with inserting them.
// insert timer function so the user will get only 15 seconds to select the numbers.





let numberPool = [];
let playerCard = [];
let markedSquares = [];
let calledNumbers = [];
let gameTimer;
let gameActive = false;
let timeLeft = 15;






function initializeNumberPool() {
    numberPool = [];
    for (let i = 1; i <= 30; i++) {
        numberPool.push(i);
    }
    return numberPool;
}

function callRandomNumber(min = 1, max = 30) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomizedNumbers() {
    const cardNumbers = [];
    const usedNumbers = new Set();
    
    while (cardNumbers.length < 9) {
        const randomNum = callRandomNumber(1, 30);
        if (!usedNumbers.has(randomNum)) {
            cardNumbers.push(randomNum);
            usedNumbers.add(randomNum);
        }
    }
    
    return shuffleArray(cardNumbers);
}

function generateCard() {
    const boxes = document.querySelectorAll('.bingo-square');
    const cardNumbers = generateRandomizedNumbers();
    
    boxes.forEach((box, index) => {
        box.innerText = cardNumbers[index]; 
        box.classList.remove('selected', 'marked'); 
    });
           
    playerCard = cardNumbers;  
    markedSquares = [];
}

function shuffleArray(array) {  
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function callNumber() { 
    if (!gameActive) {
       document.getElementById(message).innerText='Game is not active! Please start a new game.';
        return;
    }
    
    if (numberPool.length === 0) {
        document.getElementById(message).innerText='All numbers have been called!';
        endGame();
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * numberPool.length);
    const calledNumber = numberPool[randomIndex];
    
    numberPool.splice(randomIndex, 1);
    calledNumbers.push(calledNumber);
    
    document.getElementById('current-called').textContent = `Called Number: ${calledNumber}`;
    updateCalledNumbersDisplay();
    
    markNumber(calledNumber);
}

function updateCalledNumbersDisplay() {
    const calledDisplay = document.getElementById('called-numbers');
    if (calledDisplay) {
        if (calledNumbers.length === 0) {
            calledDisplay.textContent = 'None yet';
        } else {
            calledDisplay.textContent = calledNumbers.join(', ');
        }
    }
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer');
    if (timerDisplay) {
        if (timeLeft > 0) {
            timerDisplay.textContent = `Time left: ${timeLeft}s`;
        } else {
            timerDisplay.textContent = 'Time\'s Up!';
        }
    }
}

function endGame() {
    gameActive = false;
    clearInterval(gameTimer);
    
    const timerDisplay = document.getElementById('timer');
    if (timerDisplay) {
        timerDisplay.textContent = 'Game Over!';
        timerDisplay.classList.remove('warning');
    }
    
    const callBtn = document.getElementById('callBtn');
    if (callBtn) {
        callBtn.disabled = true;
    }
    
    const selectedSquares = document.querySelectorAll('.bingo-square.selected');
    const correctSelections = [];
    
    selectedSquares.forEach(square => {
        const number = parseInt(square.innerText);
        if (calledNumbers.includes(number)) {
            correctSelections.push(number);
        }
    });
    
    setTimeout(() => {
        document.getElementById(message).innerText=`Game Over!\nYou correctly selected ${correctSelections.length} called numbers: ${correctSelections.join(', ')}`;
    }, 500);
}

function initializeGame() {
    initializeNumberPool();
    generateCard();
    calledNumbers = [];
    markedSquares = [];
    gameActive = true;
    
    document.getElementById('current-called').textContent = 'Game started! Call numbers quickly!';
    updateCalledNumbersDisplay();
}

function markNumber(calledNumber) {
    const boxes = document.querySelectorAll('.bingo-square');
    
    boxes.forEach((box, index) => {
        if (parseInt(box.innerText) === calledNumber && !markedSquares.includes(index)) {
            box.classList.add('marked');
            markedSquares.push(index);
        }
    });
}




function checkWinCondition() {
    
    const cornerPositions = [0, 2, 6, 8];
    const selectedSquares = document.querySelectorAll('.bingo-square.selected');
    const selectedPositions = [];
    
    selectedSquares.forEach((square, index) => {
        const allSquares = document.querySelectorAll('.bingo-square');
        const position = Array.from(allSquares).indexOf(square);
        selectedPositions.push(position);
    });
    
   
    const fourCornersSelected = cornerPositions.every(pos => selectedPositions.includes(pos));
    
    if (fourCornersSelected) {
        return 'four_corners';
    }
    
    
    const winPatterns = [
        [0, 1, 2], 
        [3, 4, 5],  
        [6, 7, 8],
        [0, 3, 6], 
        [1, 4, 7], 
        [2, 5, 8], 
        [0, 4, 8], 
        [2, 4, 6]  
    ];
    
    for (let pattern of winPatterns) {
        if (pattern.every(pos => selectedPositions.includes(pos))) {
            return 'line';
        }
    }
    
    return null;
}

function handleWin(winType) {
    gameActive = false;
    clearInterval(gameTimer);
    
    const winMessage = winType === 'four_corners' 
        ? '🎉 BINGO! You got four corners! YOU WIN!' 
        : '🎉 BINGO! You got a line! YOU WIN!';
    
    document.getElementById('current-called').textContent = winMessage;
    document.getElementById('current-called').style.backgroundColor = 'green';
    document.getElementById('current-called').style.color = 'white';
    
    const callBtn = document.getElementById('callBtn');
    if (callBtn) {
        callBtn.disabled = true;
    }
}

function handleLoss() {
    gameActive = false;
    clearInterval(gameTimer);
    
    document.getElementById('current-called').textContent = ' TIME\'S UP! YOU LOSE!';
    document.getElementById('current-called').style.backgroundColor = 'red';
    document.getElementById('current-called').style.color = 'white';
    
    const callBtn = document.getElementById('callBtn');
    if (callBtn) {
        callBtn.disabled = true;
    }
}


function startGameTimer() {
    timeLeft = 15;
    updateTimerDisplay();
    
    gameTimer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        const timerElement = document.getElementById('timer');
        if (timeLeft <= 5 && timerElement) {
            timerElement.classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            handleLoss();
        }
    }, 1000);
}

function startNewGame() {
    if (gameTimer) {
        clearInterval(gameTimer);
    }
    
    const timerDisplay = document.getElementById('timer');
    if (timerDisplay) {
        timerDisplay.classList.remove('warning');
    }
    
    const callBtn = document.getElementById('callBtn');
    if (callBtn) {
        callBtn.disabled = false;
    }
    
    
    const currentCalled = document.getElementById('current-called');
    if (currentCalled) {
        currentCalled.style.backgroundColor = '';
        currentCalled.style.color = '';
    }
    
    initializeGame();
    startGameTimer();
}


function checkForWin() {
    if (gameActive) {
        const winType = checkWinCondition();
        if (winType) {
            handleWin(winType);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeNumberPool();
    gameActive = false; 
    document.getElementById('current-called').textContent = 'Press "Start New Game" to begin';
    
    generateCard();
    gameActive = false;
});