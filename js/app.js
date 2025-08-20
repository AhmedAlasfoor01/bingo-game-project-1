
//As a user, I want to see the bingo card clearly.

//As a user, I want to see  color on the stamp.

//As a user, I need to cover the numbers easily without any lag.

//As a user, I am expecting to get a number from each group.

//As a user, I should be able to get the right number to show and the number should be in the box .


//pseudocode

//it's made of set of number 1-30 (add intializenumber as an array so i can call the numbers,
// generateplayercard()creates the sets of the number,
// callrandomnumber()array picks and remove the numbers,
// findnumber() array so checks if the numbers is correct,
// marknumber() array to find the numbers on the cards )
//the user should get at least one number if each set which is 1-10,11-20,21-30 (I have to use if else statement and should be arrays)


// access the DOM via querySelector to find the divs (bingo boxes)
// use the Element.innerText property to overwrite their content with the numbers from the randomized number array

// const boxes = document.querySelectorAll('')
// boxes.forEach((box) => {box.innerText = number})

let numberPool = [];
let playerCard = [];
let markedSquares = [];
let calledNumbers = [];
let gameTimer;
let gameActive = false;
let timeLeft = 15;

// Initialize the number pool (1-30)
function initializeNumberPool() {
    numberPool = [];
    for (let i = 1; i <= 30; i++) {
        numberPool.push(i);
    }
    return numberPool;
}

// Generate a random number between min and max because the range of the numbers is 1-30
function callRandomNumber(min = 1, max = 30) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a randomized array of 25 numbers (5x5 bingo card)
function generateRandomizedNumbers() {
    const cardNumbers = [];
    const usedNumbers = new Set();
    
    // Generate 25 unique random numbers from 1-30
    while (cardNumbers.length < 25) {
        const randomNum = callRandomNumber(1, 30);
        if (!usedNumbers.has(randomNum)) {
            cardNumbers.push(randomNum);
            usedNumbers.add(randomNum);
        }
    }
    
    return shuffleArray(cardNumbers);
}

// Access the DOM via querySelector to find the divs (bingo boxes)
// Use the Element.innerText property to overwrite their content with numbers
function generateCard() {
    const boxes = document.querySelectorAll('.bingo-square');
    
    // Generate randomized numbers for the card
    const cardNumbers = generateRandomizedNumbers();
    
    // Use forEach to assign numbers to each box
    boxes.forEach((box, index) => {
        box.innerText = cardNumbers[index]; // Using innerText as suggested
        box.classList.remove('selected'); // Reset any previous selections
    });
    
    
    playerCard = cardNumbers;  // Store the card numbers and reset marked squares
    markedSquares = [];
}


function shuffleArray(array) {  // Shuffle array function using Fisher-Yates algorithm
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}


function callNumber() { // Call a number from the pool
    if (numberPool.length === 0) {
        alert('All numbers have been called!');
        return;
    }
    
    // Get random number from pool
    const randomIndex = Math.floor(Math.random() * numberPool.length);
    const calledNumber = numberPool[randomIndex];
    
    // Remove from pool so it won't be called again
    numberPool.splice(randomIndex, 1);
    
    // Add to called numbers array
    calledNumbers.push(calledNumber);
    
    // Update display
    document.getElementById('current-called').textContent = calledNumber;
    updateCalledNumbersDisplay();
}

// Update the display of called numbers
function updateCalledNumbersDisplay() {
    const calledDisplay = document.getElementById('called-numbers');
    if (calledDisplay) {
        calledDisplay.textContent = calledNumbers.join(', ');
    }
}

// activate the game
function initializeGame() {
    initializeNumberPool();
    generateCard();
    calledNumbers = [];
    markedSquares = [];
    gameActive = true;
    
    // So display will be reseted 
    document.getElementById('current-called').textContent = 'Press "Call Number" to start';
    updateCalledNumbersDisplay();
}

// Check if a number is on the player's card and mark it
function markNumber(calledNumber) {
    const boxes = document.querySelectorAll('.bingo-square');
    
    boxes.forEach((box, index) => {
        if (parseInt(box.innerText) === calledNumber && !markedSquares.includes(index)) {
            box.classList.add('marked');
            markedSquares.push(index);
        }
    });
}

// Example usage and initialization
// Call this when the page loads or when starting a new game
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});


