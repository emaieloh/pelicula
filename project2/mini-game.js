const grid = document.querySelector(".grid");
const startButton = document.querySelector("#start-button");
const flagCount = document.querySelector("#num-of-flags");
let width = 10;
let mineCount = 20
let flags = 0;
let cells = [];
let isGameOver = false;

let createBoard = function() {
    grid.innerHTML = "";
    flagCount.innerHTML = mineCount;
    const minesArray = Array(mineCount).fill("mine");
    const noMineArray = Array((width * width) - mineCount).fill("nomine");
    const gameArray = noMineArray.concat(minesArray);
    const shuffledArray = gameArray.sort(function(a, b) {
        return Math.random() - 0.5;
    })

    for(let i = 0; i < width * width; i++) {
        const tile = document.createElement("div");
        tile.setAttribute("id", i);
        tile.classList.add(shuffledArray[i]);
        grid.append(tile);
        cells.push(tile);

        tile.addEventListener("click", function(e) {
            click(tile);
        })

        tile.oncontextmenu = function(e) {
            e.preventDefault();
            putFlag(tile);
        }
    }

    for(let i = 0; i < cells.length; i++) {
        let total = 0;
        const leftEdge = i % width === 0;
        const rightEdge = i % width === width - 1;
        if(cells[i].classList.contains("nomine")) {
            if(i > 0 && !leftEdge && cells[i - 1].classList.contains("mine")) {
                total++;
            }
            if(i > 9 && !rightEdge && cells[i + 1 - width].classList.contains("mine")) {
                total++;
            }
            if(i > 10 && cells[i - width].classList.contains("mine")) {
                total++;
            }
            if(i > 11 && !leftEdge && cells[i - 1 - width].classList.contains("mine")) {
                total++;
            }
            if(i < 98 && !rightEdge && cells[i + 1].classList.contains("mine")) {
                total++;
            }
            if(i < 90 && !leftEdge && cells[i -1 + width].classList.contains("mine")) {
                total++;
            }
            if(i < 88 && !rightEdge && cells[i + 1 + width].classList.contains("mine")) {
                total++;
            }
            if(i < 89 && cells[i + width].classList.contains("mine")) {
                total++;
            }
            cells[i].setAttribute("data", total);
            console.log(cells[i], total);
        }
    }
    isGameOver = false;
}
createBoard();

let putFlag = function(tile) {
    if(isGameOver) {
        return;
    }
    if(!tile.classList.contains("checked") && (flags < mineCount)) {
        if(!tile.classList.contains("flag")) {
            tile.classList.add("flag");
            tile.innerHTML = "<img src='images/red-flag.png' id='red-flag'>";
            flags++;
            flagCount.innerHTML = mineCount - flags;
            isWinner();
        } else {
            tile.classList.remove("flag");
            tile.innerHTML = "";
            flags--;
            flagCount.innerHTML = mineCount - flags;
        }
    }
}

let click = function(tile) {
    let currentId = tile.id;
    if(isGameOver) {
        return;
    }
    if(tile.classList.contains("checked") || tile.classList.contains("flag")) {
        return;
    }
    if(tile.classList.contains("mine")) {
        gameOver(tile);
    } else {
        let total = tile.getAttribute("data")
        if(total != 0) {
            tile.classList.add("checked");
            tile.innerHTML = total;
            return;
        }
        // checkTile(tile, currentId)
    }
    tile.classList.add("checked");
}

// let checkTile = function(tile, currentId) {
//     const leftEdge = (currentId % width === 0)
//     const rightEdge = (currentId % width === width -1)

//     setTimeout(function() {
//         if(currentId > 0 && !leftEdge) {
//             const newId = cells[parseInt(currentId) -1].id;
//             const newTile = document.getElementById(newId);
//             click(newTile)
//         }
//         if(currentId > 9 && !rightEdge) {
//             const newId = cells[parseInt(currentId) +1 -width].id;
//             const newTile = document.getElementById(newId);
//             click(newTile)
//         }
//         if(currentId > 10) {
//             const newId = cells[parseInt(currentId) -width].id;
//             const newTile = document.getElementById(newId);
//             click(newTile)
//         }
//         if(currentId > 11 && !leftEdge) {
//             const newId = cells[parseInt(currentId) -1 -width].id;
//             const newTile = document.getElementById(newId);
//             click(newTile)
//         }
//         if(currentId < 98 && !rightEdge) {
//             const newId = cells[parseInt(currentId) +1].id;
//             const newTile = document.getElementById(newId);
//             click(newTile)
//         }
//         if(currentId < 90 && !leftEdge) {
//             const newId = cells[parseInt(currentId) -1 +width].id;
//             const newTile = document.getElementById(newId);
//             click(newTile)
//         }
//         if(currentId < 88 && !rightEdge) {
//             const newId = cells[parseInt(currentId) +1 +width].id;
//             const newTile = document.getElementById(newId);
//             click(newTile)
//         }
//         if(currentId < 89) {
//             const newId = cells[parseInt(currentId) +width].id;
//             const newTile = document.getElementById(newId);
//             click(newTile)
//         }
//     }, 10)
// }

let gameOver = function(tile) {
    alert("Game Over");
    isGameOver = true;
    cells.forEach(function(tile) {
        if(tile.classList.contains("mine")) {
            tile.innerHTML = "<img src='images/mine.png' id='mine-img'>"
        }
    })
}

let isWinner = function() {
    let matches = 0;
    for(let i = 0; i < cells.length; i++) {
        if(cells[i].classList.contains("flag") && cells[i].classList.contains("mine")) {
            matches++
        }
        if(matches === mineCount) {
            alert("You Win");
            isGameOver = true;
        }
    }
}

startButton.addEventListener("click", createBoard);

startButton.click();