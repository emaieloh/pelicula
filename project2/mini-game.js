const grid = document.querySelector(".grid");
const startButton = document.querySelector("#start-button");
const flagsLeft = document.querySelector("#flags-left");
const result = document.querySelector("#result");
let width = 10;
let mineCount = 20;
let flags = 0;
let cells = [];
let isGameOver = false;

//create the board
function createBoard() {
    grid.innerHTML = "";
    result.innerHTML = "";
    cells = [];
    isGameOver = false;
    flagsLeft.innerHTML = mineCount;
    const minesArray = Array(mineCount).fill('mine');
    const noMineArray = Array(width*width - mineCount).fill('nomine');
    const gameArray = noMineArray.concat(minesArray);
    const shuffledArray = gameArray.sort(() => Math.random() -0.5);
    for(let i = 0; i < width*width; i++) {
      const tile = document.createElement('div');
      tile.setAttribute('id', i);
      tile.classList.add(shuffledArray[i]);
      grid.appendChild(tile);
      cells.push(tile);
      tile.addEventListener('click', function(e) {
        click(tile)
      })
      tile.oncontextmenu = function(e) {
        e.preventDefault()
        putFlag(tile)
      }
    }

    for (let i = 0; i < cells.length; i++) {
      let total = 0
      const isLeftEdge = (i % width === 0)
      const isRightEdge = (i % width === width -1)

      if (cells[i].classList.contains('nomine')) {
        if (i > 0 && !isLeftEdge && cells[i -1].classList.contains('mine')) total ++
        if (i > 9 && !isRightEdge && cells[i +1 -width].classList.contains('mine')) total ++
        if (i > 10 && cells[i -width].classList.contains('mine')) total ++
        if (i > 11 && !isLeftEdge && cells[i -1 -width].classList.contains('mine')) total ++
        if (i < 98 && !isRightEdge && cells[i +1].classList.contains('mine')) total ++
        if (i < 90 && !isLeftEdge && cells[i -1 +width].classList.contains('mine')) total ++
        if (i < 88 && !isRightEdge && cells[i +1 +width].classList.contains('mine')) total ++
        if (i < 89 && cells[i +width].classList.contains('mine')) total ++
        cells[i].setAttribute('data', total)
      }
    }
  }
  createBoard()

//add Flag with right click
function putFlag(tile) {
    if (isGameOver) return
    if (!tile.classList.contains('checked') && (flags < mineCount)) {
      if (!tile.classList.contains('flag')) {
        tile.classList.add('flag')
        tile.innerHTML = "<img src='images/red-flag.png' id='red-flag'>";
        flags ++;
        flagsLeft.innerHTML = mineCount- flags
        isWinner();
      } else {
        tile.classList.remove('flag');
        tile.innerHTML = "";
        flags --;
        flagsLeft.innerHTML = mineCount- flags;
      }
    }
}

  function click(tile) {
    let currentId = tile.id
    if (isGameOver) return
    if (tile.classList.contains('checked') || tile.classList.contains('flag')) return
    if (tile.classList.contains('mine')) {
      gameOver(tile)
    } else {
      let total = tile.getAttribute('data')
      if (total != 0) {
        tile.classList.add('checked')
        if (total == 1) tile.classList.add('one');
        if (total == 2) tile.classList.add('two');
        if (total == 3) tile.classList.add('three');
        if (total == 4) tile.classList.add('four');
        tile.innerHTML = total
        return
      }
      checkTile(tile, currentId)
    }
    tile.classList.add('checked')
  }

  function checkTile(tile, currentId) {
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width -1);

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = cells[parseInt(currentId) -1].id;
        const newTile = document.getElementById(newId);
        click(newTile)
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = cells[parseInt(currentId) +1 -width].id;
        const newTile = document.getElementById(newId);
        click(newTile)
      }
      if (currentId > 10) {
        const newId = cells[parseInt(currentId -width)].id;
        const newTile = document.getElementById(newId);
        click(newTile)
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = cells[parseInt(currentId) -1 -width].id;
        const newTile = document.getElementById(newId);
        click(newTile)
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = cells[parseInt(currentId) +1].id;
        const newTile = document.getElementById(newId);
        click(newTile)
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = cells[parseInt(currentId) -1 +width].id;
        const newTile = document.getElementById(newId);
        click(newTile)
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = cells[parseInt(currentId) +1 +width].id;
        const newTile = document.getElementById(newId);
        click(newTile)
      }
      if (currentId < 89) {
        const newId = cells[parseInt(currentId) +width].id;
        const newTile = document.getElementById(newId);
        click(newTile)
      }
    }, 10)
  }

  
  function gameOver(tile) {
    result.innerHTML = 'BOOM! Game Over!';
    isGameOver = true;
    cells.forEach(tile => {
      if (tile.classList.contains('mine')) {
        tile.innerHTML = "<img src='images/mine.png' id='mine-img'>";
        tile.classList.remove('mine')
        tile.classList.add('checked')
      }
    })
  }

  function isWinner() {
  let matches = 0;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].classList.contains('flag') && cells[i].classList.contains('mine')) {
        matches ++
      }
      if (matches === mineCount) {
        result.innerHTML = 'YOU WIN!'
        isGameOver = true
      }
    }
  }

  startButton.addEventListener("click", createBoard);