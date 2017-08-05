const blessed = require('blessed');
const gosper = require('./gosperGliderGlider.js').gosperGlider

/************************************
Create Screen in Terminal
************************************/
const screen = blessed.screen({
  smartCSR: true
});

const box = blessed.box({
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  content: ' 0 \n  0',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black'
  }
});

screen.append(box);

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});


/************************************
Global Boards (Current tick and past)
************************************/
let GameBoard = [];
let currentGame;

/************************************
Render Inital Pattern
************************************/
let makeGamebox = () => {
 //Create the board (fixed 50x50 Array) 0(n^2)
 for (let x = 0; x < 50; x++) {
   let tempArray = [];
   for (let y = 0; y < 50; y++) {
     if (y === 49) {
       tempArray.push('\n');
     } else {
     tempArray.push(' ');
    }
   }
   GameBoard.push(tempArray);
 }
 setBoard(gosper);
};

let setBoard = (pattern) => {
  //Set first cells onto board
  let cells = pattern['Cells'];
  for (let x = 0; x <cells.length; x++) {
    let postX = cells[x][0];
    let postY = cells[x][1];

    GameBoard[postX][postY] = 'X';
  }
  currentGame = JSON.parse(JSON.stringify(GameBoard));
  joinArray(currentGame);
}

/************************************
Conway's Conditions
************************************/
const changeBoard = (game) => {

  let currentBoard = JSON.parse(JSON.stringify(game));

  for (let x = 1; x < currentBoard.length-1; x++) {
    for ( let y = 1; y < currentBoard.length-1; y++) {
      let total = 0;

      total = total + isAlive(currentBoard[x - 1][y - 1]); //top left
      total = total + isAlive(currentBoard[x - 1][y]); //top center
      total = total + isAlive(currentBoard[x - 1][y + 1]); //top right

      total = total + isAlive(currentBoard[x + 1][y - 1]); //bottom left
      total = total + isAlive(currentBoard[x + 1][y]); //bottom center
      total = total + isAlive(currentBoard[x + 1][y + 1]); //bottom right

      total = total + isAlive(currentBoard[x][y - 1]); //center left
      total = total + isAlive(currentBoard[x][y + 1]); //center right

      if (currentBoard[x][y] === 'X') {
        if (total <= 1 || total >= 4) {
          GameBoard[x][y] = ' '; //Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
                                 //Any live cell with more than three live neighbours dies, as if by overpopulation.
        } else {
          GameBoard[x][y] = 'X'; //Any live cell with two or three live neighbours lives on to the next generation.
        }
      }

      if (total === 3) {
        game[x][y] = 'X'; //Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
      }
    }
  }
}

/************************************
Helper functions
************************************/
const joinArray = (board) => {
  for (let x = 0; x < board.length; x++) {
    board[x] = board[x].join('');
  }
  currentGame = board.join('');
}

const isAlive = (str) => {
  if (str === 'X') {
    return 1;
  } else {
    return 0;
  }
}

/************************************
Intial Setup of the Game
************************************/
const StartGame = () => {
  makeGamebox();
  box.setContent(currentGame);
  screen.render();
  currentGame = GameBoard.slice(0);
  joinArray(currentGame);
}

StartGame();

/************************************
Tick function (Re-render board)
************************************/
setInterval(() => {
  changeBoard(GameBoard);
  currentGame = GameBoard.slice(0);
  joinArray(currentGame);
  box.setContent(currentGame);
  screen.render();
},100)
