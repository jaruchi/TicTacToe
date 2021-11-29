
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
  
class GameBoard {
    constructor() {
       
        // to capture all the cells data
        this.gameBoard =  [
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

        // token to check when to stop the game after a certain condition is met
        this.gameIsStopped = false;
        this.initCells(); // to get different elements from the HTML

    }
    
    initCells() {
        this.gameCells = document.querySelectorAll(".game-cell");
        this.gameElements = document.querySelectorAll(".game-element");
        this.gameStatusElement = document.querySelector("#game-status");

        this.scoreXElement = document.querySelector("#scoreX");
        this.scoreXElement.innerText = this.playersScore.playerXScore;
        this.scoreOElement = document.querySelector("#scoreO");
        this.scoreOElement.innerText = this.playersScore.playerOScore;

        this.audio = document.querySelector("#sound");



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
            this.audio.play();
            gameElement.innerText = this.currentTurn;
            this.updateGameBoard(elementId);
            this.setGameStatus();
            this.switchTurn();
        }
    }

// Functionality for changing players between X & O 
    
    switchTurn() {
        console.log(this.currentTurn);
        if (this.currentTurn === 'X') {
            this.currentTurn = 'O';
        }
        else {
            this.currentTurn = 'X';
        }
    }

    updateGameBoard(elementId) { 
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.gameBoard[i][j] === elementId) {
                    this.gameBoard[i][j] = this.currentTurn;
                }
            }
        } 
    }

    setGameStatus() {
        if (this.isCurrentPlayerWon()) {// Player Won
            this.stopGame();
            if (this.currentTurn === 'X') {
                this.updateGameStatus(3);
                this.calculateXScore()
            }
            else {
                this.updateGameStatus(4);
                this.calculateOScore();
            }
        } else if (this.isAllCellFilled()) {//Draw
            this.stopGame();
            this.updateGameStatus(5);
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

    calculateXScore() {
        this.playersScore.playerXScore++;
        this.scoreXElement.innerText =  this.playersScore.playerXScore;
    }

    calculateOScore() {
        this.playersScore.playerOScore++;
        this.scoreOElement.innerText =  this.playersScore.playerOScore;
    }

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

    updateGameStatus(statusState) {
        this.gameStatusElement.innerText = gameStatus[statusState];
    }

    isAllCellFilled() {
        const gameBoardFlat = this.gameBoard.flat();
        if (gameBoardFlat.find(data => data !== 'X' && data !== 'O')) {
            return false;
        }
        return true;
    }

    stopGame() {
        this.gameIsStopped = true;
    }

    onResetClick(e) {
        this.onRestartClick();
        // score
        this.playersScore = {
            playerXScore: 0,
            playerOScore: 0
        };
        this.scoreXElement.innerText = this.playersScore.playerXScore;
        this.scoreOElement.innerText =  this.playersScore.playerOScore;

    }

    onRestartClick(e) {
        //this.gameboard empty
        this.gameBoard = [
            ['c00', 'c01', 'c02'],
            ['c10', 'c11', 'c12'],
            ['c20', 'c21', 'c22']
        ];
        //game elements reset
        this.gameElements.forEach(elm=>elm.innerText='')
        //game status empty
        this.gameStatusElement.innerText = '';
        //current turn = x
        this.currentTurn = 'X';
        //gamestopped = false
        this.gameIsStopped = false;        
    }
}

function init() {
    new GameBoard();
}

window.addEventListener('load', init);