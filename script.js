

//Winning Conditions Array
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

//Game Status Object for different Status
const gameStatus = {
    1: 'X Turn',
    2: 'O Turn',
    3: 'X Won',
    4: 'O Won',
    5: 'Game Draw'
};

// Class for GameBoard
// Consists of 3x3 gameBoard array
// Players Score Object
// an array to store game history
// token to check when to stop game
// call to initialize cells on gameBoard
class GameBoard {
    constructor() {

        // to capture all the cells data
        this.gameBoard = [
            ['c00', 'c01', 'c02'],
            ['c10', 'c11', 'c12'],
            ['c20', 'c21', 'c22']
        ];

        this.currentTurn = 'X'; // game always starts from X turn

        // Setting Starting score for both players as 0
        this.playersScore = {
            playerXScore: 0,
            playerOScore: 0
        };

        this.gameHistory = [];

        // token to check when to stop the game after a certain condition is met

        this.gameIsStopped = false;

        this.initCells(); // to get different elements from the HTML

    }

    // mapping of HTML elements
    // event listener for click on game cells
    //event listeners for restart and reset functionality
    initCells() {
        this.gameCells = document.querySelectorAll(".game-cell");
        this.gameElements = document.querySelectorAll(".game-element");
        this.gameStatusElement = document.querySelector("#game-status");

        this.scoreXElement = document.querySelector("#scoreX");
        this.scoreXElement.innerText = this.playersScore.playerXScore;
        this.scoreOElement = document.querySelector("#scoreO");

        this.scoreOElement.innerText = this.playersScore.playerOScore;

        this.clickSound = document.querySelector("#soundClick");
        this.winSound = document.querySelector("#soundWin");
        this.drawSound = document.querySelector("#soundDraw");

        this.gameHistoryElement = document.querySelector("#history");


        //this.gameCells.forEach(gameCell => gameCell.addEventListener("click",this.onGameCellClick));/// it passes the callback with particular cell data
        this.gameCells.forEach(gameCell => gameCell.addEventListener("click", e => this.onGameCellClick(e)));/// (event)callback function don't support functionality of this keyword

        this.restartButton = document.querySelector("#restart");
        this.restartButton.addEventListener("click", () => this.onRestartClick());

        this.resetButton = document.querySelector("#reset");
        this.resetButton.addEventListener("click", () => this.onResetClick());
    }

    // Function to perform on every cell click
    onGameCellClick(e) {
        if (this.gameIsStopped) {
            return;
        }
        let elem = e.currentTarget;
        let gameElement = elem.firstElementChild;

        let elementId = elem.id;
        if (gameElement.innerText === '') {
            this.clickSound.play();
            gameElement.innerText = this.currentTurn;
            this.updateGameBoard(elementId);
            this.setGameStatus();
            this.switchTurn();
        }
    }

    // Functionality for changing players between X & O 
    switchTurn() {
        if (this.currentTurn === 'X') {
            this.currentTurn = 'O';
        }
        else {
            this.currentTurn = 'X';
        }
    }

    // updates game board after every turn
    updateGameBoard(elementId) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.gameBoard[i][j] === elementId) {
                    this.gameBoard[i][j] = this.currentTurn;
                }
            }
        }
    }

    // check game board after every turn
    //to see if there is any winner or a draw
    setGameStatus() {
        if (this.isCurrentPlayerWon()) {// Player Won
            this.stopGame();
            if (this.currentTurn === 'X') {
                this.winSound.play();
                this.updateGameStatus(3);
                this.calculateXScore()
                this.updateGameHistory('X');
            }
            else {
                this.winSound.play();
                this.updateGameStatus(4);
                //this.gameHistory.push('O');
                this.calculateOScore();
                this.updateGameHistory('O');
            }
        } else if (this.isAllCellFilled()) {//Draw
            this.stopGame();
            this.drawSound.play();
            this.updateGameStatus(5);
            this.updateGameHistory('');
        }
        else {
            if (this.currentTurn === 'X') {// next turn
                this.updateGameStatus(2);
            }
            else {
                this.updateGameStatus(1);
            }
        }
    }
    //
    updateGameHistory(history) {
        //console.log(this.gameHistory)
        this.gameHistory.push(history);

        const li = document.createElement('li');
        li.innerText = `Game ${this.gameHistory.length}: ${history} ${!history ? 'Draw' : 'Won'}`;
        this.gameHistoryElement.appendChild(li);
    }

    // calculates score when player X wins
    calculateXScore() {
        this.playersScore.playerXScore++;
        this.scoreXElement.innerText = this.playersScore.playerXScore;
    }

    // calculates score when player O wins
    calculateOScore() {
        this.playersScore.playerOScore++;
        this.scoreOElement.innerText = this.playersScore.playerOScore;
    }

    // checks if current player is a winner by working on already set winning conditions
    isCurrentPlayerWon() {
        for (let index = 0; index < winningConditions.length; index++) {
            const winCon = winningConditions[index];
            const result = this.isAllCellsFilledWithSameValue(winCon);
            if (result) {
                return true;
            }
        }
        return false;
    }

    // compares gameboard for winning conditions
    // if gameboard matches to any of the winning condition returns true otherwise false
    isAllCellsFilledWithSameValue(winCon) {
        const gameBoardFlat = this.gameBoard.flat();
        const a = gameBoardFlat[winCon[0]];
        const b = gameBoardFlat[winCon[1]];
        const c = gameBoardFlat[winCon[2]];
        if (a === b && a === c) {
            return true;
        }
        else {
            return false;
        }
    }

    // update the game status after every move
    updateGameStatus(statusState) {
        this.gameStatusElement.innerText = gameStatus[statusState];
    }

    // checks if all the cells in the gameboard are filled or not for the draw condition
    isAllCellFilled() {
        const gameBoardFlat = this.gameBoard.flat();
        if (gameBoardFlat.find(data => data !== 'X' && data !== 'O')) {
            return false;
        }
        return true;
    }

    // updates token to stop the game after checking for winning or draw condition
    stopGame() {
        this.gameIsStopped = true;
    }

    //resets the whole game 
    onResetClick(e) {

        this.onRestartClick();
        // score
        this.playersScore = {
            playerXScore: 0,
            playerOScore: 0
        };
        this.scoreXElement.innerText = this.playersScore.playerXScore;
        this.scoreOElement.innerText = this.playersScore.playerOScore;

        this.gameHistory = [];
        this.gameHistoryElement.innerHTML = '';

    }

    //restarts the game without affetcing the score and game history 
    onRestartClick(e) {
        this.gameBoard = [
            ['c00', 'c01', 'c02'],
            ['c10', 'c11', 'c12'],
            ['c20', 'c21', 'c22']
        ];
        //game elements reset
        this.gameElements.forEach(elm => elm.innerText = '')
        //game status empty
        this.gameStatusElement.innerText = 'X Turn';
        //current turn = x
        this.currentTurn = 'X';
        //gamestopped = false
        this.gameIsStopped = false;
    }
}

//instantiate the class
function init() {
    new GameBoard();
}

//on window load call the init function to instantiate the class 
window.addEventListener('load', init);
