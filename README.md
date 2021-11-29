# TicTacToe

### Technologies Used
Tic Tac Toe game using HTML, CSS and JavaScript.

### Description
Tic-tac-toe, or Xs and Os is a paper-and-pencil game for two players who take turns marking the spaces in a three-by-three grid with X or O. The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row is the winner.

### Step I: Initial Game Board design
There is a heading on the page with a 3X3 game board.
The game board consists of a game container which has 3 game rows. Every game row has a game cell which will hold the game elements. Game element is the place where X or O will be displayed.
![Intial Game Board Design](/docs/initialgameboarddesign.png)

### Step II: Game Design with possible elements
Added semantics like header, main, footer in HTML. Manipulated CSS for different layouts using flex property.
![Game Page Layout](/docs/layout.png)

### Bronze MVP
 An HTML page with a layout of 9 cells and different game components like setting of players and their scores, game status like winning, loose or draw, reset & restart buttons.
 CSS to make the page layout visible.
 Dummy JS functions to test functonality of setting up the game and accessing the elements by filling them with 'X' on each click.

 ### Pseudocode
 Make the game board using HTML and CSS
 Initialize all the event handlers for the cell clicks
 On first cell click update its value with X as its the statring turn:
    Update the game board
    Set the game status
    Switch turns between X and O

  ### Pseudocode For UpdateGameBoard
  updateGameBoard:
    Iterate the gameBoard array according to elementID:
        Insert the X or O on the specified location

### Pseudocode For setGameStatus
  setGameStatus:
    for every click check:
        if currentPlayer Won
            then stopGame
                if currentTurn==='X'
                    updateGameStatus for X
                    calculateScore for X
                else
                    updateGameStatus for O
                    calculateScore for O
        ElseIf check for isAllCellFilled
                then stopGame
                updateGameStatus for Draw 
        Else
            check for CurrentTurn and updatestatus for next player turn

### Pseudocode For isAllCellFilled
  find for any empty cell from gameboard
  if yes return false
  else return true

  ### Pseudocode For currentPlayerWon
  Iterate the const array defined for 8 winning conditions
    for every index 
        get the values for those indexes in the gameBoard
        check if all are Equal
        if yes return true
        else return false


### Pseudocode For restartGame
  make gameBoard empty or to its initial stage
  set gameElements to empty
  empty gameStatus
  set currentTurn to X


### User Stories Covered
As a user, I should be able to start a new tic tac toe game
As a user, I should be able to click on a square to add X first and then O, and so on
As a user, I should be shown a message after each turn for if I win, lose, tie or who's turn it is next
As a user, I should not be able to click the same square twice
As a user, I should be shown a message when I win, lose or tie
As a user, I should not be able to continue playing once I win, lose, or tie
As a user, I should be able to play the game again without refreshing the page

  




 




