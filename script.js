function boardIntialization() {
    const gameCells = document.querySelectorAll(".game-cell");
    gameCells.forEach(gameCell => gameCell.addEventListener("click", onGameCellClick))
}

function onGameCellClick(e) {
    let elem = e.target;
    if (e.target.classList.contains('game-cell')) {
         elem = e.target.querySelector('.game-element');
    }
    elem.innerText = 'X';
}

function init() {

    boardIntialization();
}


window.addEventListener('load', init);