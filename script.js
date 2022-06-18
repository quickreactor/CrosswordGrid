// TODO
// add anagram wheel function
// scale entire app by viewport
// make drawing only available afte you lock the image

// scale by viewport
// font scaling needs to consider grid size too
// better clue system/positioning
// auto resive canvas when the image div resizes




let container;

let xwGrid = {
    rows: 13,
    cols: 13,
    size: 750
}

const keyboard = {
    "a": 65, "b": 66, "c": 67, "d": 68, "e": 69, "f": 70, "g": 71, "h": 72,
    "i": 73, "j": 74, "k": 75, "l": 76, "m": 77, "n": 78, "o": 79, "p": 80,
    "q": 81, "r": 82, "s": 83, "t": 84, "u": 85, "v": 86, "w": 87, "x": 88, "y": 89,
    "z": 90,
    "black": 190, ".": 190,
    "delete": 8,
    "enter": 13,
    "space": 32,
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
    // "ctrl":   17
};

const BLACK = ".";
const DASH = "-";
const BLANK = " ";
const ACROSS = "across";
const DOWN = "down";
const DEFAULT_SIZE = 15;
const DEFAULT_TITLE = "Untitled";
const DEFAULT_AUTHOR = "Anonymous";
const DEFAULT_CLUE = "(blank clue)";
const pink = "rgba(255,100,150,0.6)"
const aqua = "rgba(50,220,220,0.6)";
// const pink = "rgba(255,192,203,0.8)"
// const aqua = "rgba(0,255,255,0.8)";
const opacityPink = "rgb(255,192,203,0.2)";
const opacityAqua = "rgba(0,255,255,0.2)";

var direction = ACROSS;
var highlightColour = pink;
var indicator = opacityPink;


container = document.getElementById("container");
makeRows(xwGrid.cols, xwGrid.rows);
container.addEventListener("click", clickHandler)
container.mouseIsOver = false;
container.onmouseover = function()   {
    stop();
    this.mouseIsOver = true;
};
container.onmouseout = function()   {
    this.mouseIsOver = false;
}
document.addEventListener("keydown", keyboardHandler)
$(function() {
    $('#container').draggable();
    $('#container').resizable();
});
// window.onbeforeunload = function() {
//     return true;
// };

// CANVAS SHIT
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let coord = { x: 0, y: 0 };

document.addEventListener("mousedown", start);
document.addEventListener("mouseup", stop);
window.addEventListener("resize", resize);

resize();

function resize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}
function reposition(event) {
    coord.x = event.offsetX;
    coord.y = event.offsetY;
}
function start(event) {
    if (container.mouseIsOver !== true) {
        document.addEventListener("mousemove", draw);
        reposition(event);
    }
}
function stop() {
    document.removeEventListener("mousemove", draw);
}
function draw(event) {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#ACD3ED";
    ctx.moveTo(coord.x, coord.y);
    reposition(event);
    ctx.lineTo(coord.x, coord.y);
    ctx.stroke();
}

// END CANVAS



function makeRows(rows, cols) {
    Array.from(document.querySelectorAll(".grid-item")).forEach(e => e.remove()); // clears grid
    if (rows === undefined && cols === undefined) {
        let gridArr = Array.from(document.querySelectorAll(".grid-input")).map(e => e.value);
        console.log(gridArr);
        cols = gridArr[0];
        console.log(cols);
        rows = gridArr[1];
        console.log(rows);
        xwGrid.rows = rows;
        xwGrid.cols = cols;
    }
    container.style.setProperty('--grid-rows', rows);
    container.style.setProperty('--grid-cols', cols);
    for (c = 1; c <= (rows * cols); c++) {
      let cell = document.createElement("div");
      cell.id = "Cell" + (c);
    //   cell.setAttribute("contenteditable", "true");
      var rowNum = Math.ceil(c / (rows));
      cell.setAttribute("row", rowNum);
      var colNum = c % cols;
      //console.log(colNum);
      if (colNum === 0) { colNum = cols; }
      cell.setAttribute("column", colNum);
      cell.setAttribute("coord", colNum + "-" + rowNum)
      cell.style.border = "1px solid rgba(255, 0, 150, 0.8";
      cell.style.userSelect = "none";
      //cell.innerText = (c + 1);
      container.appendChild(cell).className = "grid-item";
      $(function() {
		$('#container').draggable();
		$('#container').resizable(
            {
                resize: function(event, ui) {
                  // handle fontsize here
                  console.log(ui.size); // gives you the current size of the div
                  var size = ui.size;
                  xwGrid.size = Math.max(size.width, size.height);
                  var largestAxis = Math.max(xwGrid.cols, xwGrid.rows);
                //   console.log(((Math.min(size.width, size.height) / 19) / Math.max(xwGrid.cols, xwGrid.rows)) * 13);
                  // something like this change the values according to your requirements
                  $(this).css("font-size", Math.floor(((Math.min(size.width, size.height) / 19) / largestAxis) * 13) + "px"); 
                }
            }
        );
	});
    $(container).css("font-size", Math.floor((xwGrid.size / 19) / Math.max(xwGrid.cols, xwGrid.rows)) * 13 + "px"); 
};
  


let directionSpan = document.querySelector("#direction");
directionSpan.innerText = "Across";
directionSpan.style.color = pink;
};




var loadFile = function(event) {
	var image = document.getElementById('output');
	image.src = URL.createObjectURL(event.target.files[0]);
    makeResizableImage();
};



var previousElement = null;
var activeCell = null;
var isImageResizable = true;
var isGridResizable = true;

function toggleResizableImage() {
    if (isImageResizable === true) {
        const canvas = document.getElementById("canvas");
        const image = document.querySelector(".resizable");
        image.style.zIndex = 6;
        canvas.style.zIndex = 7;
        lockResizableImage()
    } else {
        const canvas = document.getElementById("canvas");
        const image = document.querySelector(".resizable");
        image.style.zIndex = 7;
        canvas.style.zIndex = 6;
        $(function() {
            $('.resizable').draggable("enable");
            $('.resizable').resizable("enable");
        });
        isImageResizable = true;
        document.querySelector("#toggle-lock-image").innerText = "Lock Image";
    }
}

function makeResizableImage() {
	$(function() {
		$('.resizable').draggable();
		$('.resizable').resizable({ aspectRatio: true });
	});
    isImageResizable = true;
    document.querySelector("#toggle-lock-image").innerText = "Lock Image";
}

function lockResizableImage() {
    $(function() {
		$('.resizable').draggable("disable");
		$('.resizable').resizable("disable");
	});
    isImageResizable = false;
    document.querySelector("#toggle-lock-image").innerText = "Unlock Image";
}

function toggleResizableGrid() {
    let gridCells = Array.from(document.querySelectorAll(".grid-item"));
    isGridResizable = !isGridResizable;
    if (isGridResizable) {
        $(function() {
            $('#container').draggable('enable');
            $('#container').resizable('enable');
        });
        document.querySelector("#toggle-lock-grid").innerText = "Lock Grid";
        gridCells.forEach(e => e.style.border = "1px solid rgba(255, 0, 150, 0.8");
    } else {
        $(function() {
            $('#container').draggable('disable');
            $('#container').resizable('disable');
        });
        document.querySelector("#toggle-lock-grid").innerText = "Unlock Grid";
        gridCells.forEach(e => e.style.border = "1px solid rgba(0, 0, 0, 0.1");
    }
}

function changeDirection() {
    let toDir = null;
    // console.log('togg')
    toDir = (direction == ACROSS) ? DOWN : ACROSS;

    direction = toDir;
    highlightRowCol()
    let directionSpan = document.querySelector("#direction");
    if (direction === ACROSS) {
        directionSpan.innerText = "Across";
        directionSpan.style.color = pink;
        highlightColour = pink;
        indicator = opacityPink;
    } else {
        directionSpan.innerText = "Down";
        directionSpan.style.color = aqua;
        highlightColour = aqua;
        indicator - opacityAqua
    }
    if (activeCell !== null) {
        activeCell.style.background = highlightColour;
    }

}


function keyboardHandler(e) {
    console.log("yin");
    if (activeCell !== null) {
        // Put the letter in
        let isLetter = e.which >= keyboard.a && e.which <= keyboard.z;
        let isDirection = e.which >= keyboard.left && e.which <= keyboard.down;
        let isEnter = e.which == keyboard.enter;
        let isBackspace = e.which == keyboard.delete;

        // stop default keypresses
        if (isEnter || isBackspace || isDirection) e.preventDefault();

        // do enter separate
        if (isEnter) {
            changeDirection();
        } else if (isBackspace) {
            newFill = " ";
            activeCell.innerText = newFill;
            if (direction === ACROSS){
                move(activeCell, -1, 0);
            } else {
                move(activeCell, 0, -1);
            }
        } else if (isLetter) {

                // get string
                newFill = String.fromCharCode(e.which);
                activeCell.innerText = newFill;

                // Move The Selection
                if (direction === ACROSS) {
                    move(activeCell, 1, 0);
                } else {
                    move(activeCell, 0, 1);
                }
                
                // if (direction === ACROSS) {
                //     let row = parseInt(activeCell.getAttribute('row'));
                //     let column = parseInt(activeCell.getAttribute('column'));
                //     let nextCol = parseInt(activeCell.getAttribute('column')) + 1;
                //     let nextCoord = nextCol + '-' + row;
                //     console.log(typeof nextCoord);
                //     console.log(nextCoord);
                //     var next = document.querySelector("[coord="+"'"+nextCoord+"'"+"]")
                //     console.log("nexct", next);
                //     clickHandler({target: next})
                // } else {
                //     let row = parseInt(activeCell.getAttribute('row'));
                //     let column = parseInt(activeCell.getAttribute('column'));
                //     let nextRow = parseInt(activeCell.getAttribute('row')) + 1;
                //     let nextCoord = column + '-' + nextRow;
                //     var next = document.querySelector("[coord="+"'"+nextCoord+"'"+"]")
                //     clickHandler({target: next})
                // }
        } else if (isDirection) {
            switch (e.which) {
                case keyboard.left:
                    move(activeCell, -1, 0);
                    break;
                case keyboard.up:
                    move(activeCell, 0, -1);
                    break;
                case keyboard.right:
                    move(activeCell, 1, 0);
                    break;
                case keyboard.down:
                    move(activeCell, 0, 1);
                    break;
              }
        }
    }
}

function clickHandler(e) {
    console.log(e);
    if (e.target !== null) {
        if (e.target === activeCell) {
            changeDirection();
        }
        activeCell = e.target;
    } else {
        activeCell = e;
    }
    if (previousElement !== null && previousElement !== undefined) {
        previousElement.style.background = "none";
    }
    activeCell.focus();
    highlightRowCol()
    activeCell.style.background = highlightColour;
    previousElement = activeCell;
    if (previousElement) { console.log(previousElement) };
}

function move(cell, spacesX, spacesY) {
    let row = parseInt(cell.getAttribute('row'));
    let col = parseInt(cell.getAttribute('column'));
    let nextRow = Math.max(Math.min((row + spacesY), xwGrid.rows), 1);
    let nextCol = Math.max(Math.min((col + spacesX), xwGrid.cols), 1);
    let nextCoord = nextCol + '-' + nextRow;
    var next = document.querySelector("[coord="+"'"+nextCoord+"'"+"]")
    clickHandler({target: next})
}

function clearAll() {
    let gridCells = Array.from(document.querySelectorAll(".grid-item"));
    gridCells.forEach(e => e.innerText = " ");

}

function highlightRowCol() {
    Array.from(document.querySelectorAll(".grid-item")).forEach(e => e.style.background = "none");
    var rowNum = parseInt(activeCell.getAttribute('row'));
    var colNum = parseInt(activeCell.getAttribute('column'));
    var thisRow = Array.from(document.querySelectorAll("[row="+"'"+rowNum+"'"+"]"));
    var thisCol = Array.from(document.querySelectorAll("[column="+"'"+colNum+"'"+"]"));
    if (direction === ACROSS) {
        thisRow.forEach(cell => cell.style.background = opacityPink);
    } else {
        thisCol.forEach(cell => cell.style.background = opacityAqua);
    }
}

function lel() {
    $(function() {
		$('#container').draggable('enable');
		$('#container').resizable('enable');
	});
}

function clearCanvas() {
    
  var c = document.getElementById("canvas");
  var ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.beginPath();

}


