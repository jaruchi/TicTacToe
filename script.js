//constants for X and O to change players other than X & O 
const X = 'X';
const O = 'O';


//Winning Conditions Array represents the position where a player can win
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
// initializes the game controls
// call to initialize cells on gameBoard
class GameBoard {
    constructor() {
        this.initializeGameData(); // to initialize the game data
        this.setUp(); // to set up the game and different elements from HTML
    }

    //Consists of 3x3 gameBoard array
    // Players Score Object
    // an array to store game history
    // token to check when to stop game
    initializeGameData() {

        this.resetGameData();
        // Setting Starting score for both players as 0
        this.playersScore = {
            playerXScore: 0,
            playerOScore: 0,
            drawCount: 0
        };

        // to track every game
        this.gameHistory = [];
    }

    resetGameData() {
        //to capture all the cells data
        this.gameBoard = [
            ['c00', 'c01', 'c02'],
            ['c10', 'c11', 'c12'],
            ['c20', 'c21', 'c22']
        ];

        // game always starts from X turn
        this.currentTurn = X;
        // token to check when to stop the game after a certain condition is met
        this.gameIsStopped = false;
    }

    // mapping of HTML elements
    // event listener for click on game cells
    //event listeners for restart and reset functionality
    setUp() {
        this.captureHTMLElements();
        this.setInitialCounters();
        this.resetHistory();
    }

    //captures and bind HTML elements to game elements
    captureHTMLElements() {
        this.gameBoardDiv = document.querySelector("#game-container");
        this.gameCells = document.querySelectorAll(".game-cell");
        this.gameElements = document.querySelectorAll(".game-element");
        this.gameStatusElement = document.querySelector("#game-status");
        this.scoreXElement = document.querySelector("#scoreX");
        this.scoreOElement = document.querySelector("#scoreO");
        this.drawCountElement = document.querySelector("#count");
        this.clickSound = document.querySelector("#soundClick");
        this.winSound = document.querySelector("#soundWin");
        this.drawSound = document.querySelector("#soundDraw");
        this.gameHistoryElement = document.querySelector("#history");
        this.restartButton = document.querySelector("#restart");
        this.resetButton = document.querySelector("#reset");

        /// it passes the callback with particular cell data
        //this.gameCells.forEach(gameCell => gameCell.addEventListener("click",this.onGameCellClick));

        /// (event)callback function don't support functionality of this keyword
        this.gameCells.forEach(gameCell => gameCell.addEventListener("click", e => this.onGameCellClick(e)));

        this.restartButton.addEventListener("click", () => this.onRestartGame());
        this.resetButton.addEventListener("click", () => this.onResetGame());
    }

    // UI Initialization as per Data
    setInitialCounters() {
        //Starting with 0 values for X, O & draw 
        this.scoreXElement.innerText = this.playersScore.playerXScore;
        this.scoreOElement.innerText = this.playersScore.playerOScore;
        this.drawCountElement.innerText = this.playersScore.drawCount;

        //setting game elements content to empty
        this.gameElements.forEach(elm => elm.innerText = '');
        this.gameElements.forEach(elm => elm.classList.remove('filled'));
        this.updateGameStatus(this.currentTurn === X ? 1 : 2);

        this.gameBoardDiv.classList.remove('game-over')
    }

    resetHistory() {
        this.gameHistoryElement.innerHTML = '';
    }

    // Function to perform on every cell click
    onGameCellClick(e) {
        if (this.gameIsStopped) {
            return;
        }
        let cell = e.currentTarget;
        let gameElement = cell.firstElementChild;

        let elementId = cell.id;
        if (gameElement.innerText === '') {
            this.clickSound.play();
            gameElement.innerText = this.currentTurn;
            gameElement.classList.add('filled')

            this.updateGameBoard(elementId);
            this.updateGameBoardForWinOrDrawCondition();
        }
    }

    // Functionality for changing players between X & O 
    switchTurn() {
        this.currentTurn = this.currentTurn === X ? O : X;
    }

    // updates game board after every turn
    updateGameBoard(elementId) {
        const row = elementId[1];
        const column = elementId[2];
        this.gameBoard[row][column] = this.currentTurn;
    }

    // check game board after every turn
    //to see if there is any winner or a draw
    //update the whole game board accordingly
    updateGameBoardForWinOrDrawCondition() {
        if (this.isCurrentPlayerWon()) {// Player Won
            this.stopGame();
            if (this.currentTurn === X) {
                this.winSound.play();
                this.updateGameStatus(3);
                this.calculateXScore()
                this.updateGameHistory(X);
            }
            else {
                this.winSound.play();
                this.updateGameStatus(4);
                this.calculateOScore();
                this.updateGameHistory(O);
            }
        } else if (this.isAllCellFilled()) {//Draw
            this.stopGame();
            this.drawSound.play();
            this.updateGameStatus(5);
            this.calculateDrawCount();
            this.updateGameHistory('');
        } else {// continue
            if (this.currentTurn === X) {
                this.updateGameStatus(2);
            }
            else {
                this.updateGameStatus(1);
            }
            this.switchTurn();
        }
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
        const position1 = gameBoardFlat[winCon[0]];
        const position2 = gameBoardFlat[winCon[1]];
        const position3 = gameBoardFlat[winCon[2]];
        if (position1 === position2 && position1 === position3) {
            return true;
        }
        else {
            return false;
        }
    }

    // updates the game history by adding new li element after every game is over
    // history ==> ['x','o',''] ==> Game 1:X Won  or Game 2:Draw
    updateGameHistory(history) {
        this.gameHistory.push(history);
        const li = document.createElement('li');
        li.innerText = `Game ${this.gameHistory.length}: ${history} ${!history ? 'Draw' : 'Won'}`;
  
        this.gameHistoryElement.insertBefore(li, this.gameHistoryElement.childNodes[0]);
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

    // calculates draw counts
    calculateDrawCount() {
        this.playersScore.drawCount++;
        this.drawCountElement.innerText = this.playersScore.drawCount;
    }
  

    // update the game status after every move
    updateGameStatus(statusState) {
        this.gameStatusElement.innerText = gameStatus[statusState];
    }

    // checks if all the cells in the gameboard are filled or not for the draw condition
    isAllCellFilled() {
        const gameBoardFlat = this.gameBoard.flat();
        if (gameBoardFlat.find(data => data !== X && data !== O)) {
            return false;
        }
        return true;
    }

    // updates token to stop the game after checking for winning or draw condition
    stopGame() {
        this.gameIsStopped = true;
        this.gameBoardDiv.classList.add('game-over');
    }

    //resets the whole game 
    onResetGame() {
        this.initializeGameData();
        this.setInitialCounters();
        this.resetHistory();
    }

    //restarts the game without affetcing the score and game history 
    onRestartGame() {
        this.resetGameData();
        this.setInitialCounters();
    }
}

//instantiate the class
function init() {
    new GameBoard();
}

//on window load call the init function to instantiate the class 
window.addEventListener('load', init);