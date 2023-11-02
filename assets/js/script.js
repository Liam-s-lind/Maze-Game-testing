// This function generates a random integer between 0 (inclusive) and 'max' (exclusive).
function rand(max) {
    return Math.floor(Math.random() * max);
}

// This function shuffles the elements in an array 'a'.
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        // Generate a random index 'j' within the current range of 'i'.
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements at indices 'i' and 'j' in the array.
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// This function changes the brightness of an image ('sprite') by a 'factor'.
function changeBrightness(factor, sprite) {
    // Create a virtual canvas to manipulate the image.
    var virtCanvas = document.createElement("canvas");
    virtCanvas.width = 500;
    virtCanvas.height = 500;
    var context = virtCanvas.getContext("2d");
    context.drawImage(sprite, 0, 0, 500, 500);

    // Get image data from the virtual canvas.
    var imgData = context.getImageData(0, 0, 500, 500);

    // Adjust the brightness of each pixel in the image data.
    for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = imgData.data[i] * factor;
        imgData.data[i + 1] = imgData.data[i + 1] * factor;
        imgData.data[i + 2] = imgData.data[i + 2] * factor;
    }

    // Put the modified image data back on the canvas.
    context.putImageData(imgData, 0, 0);

    // Create a new image from the modified canvas and return it.
    var spriteOutput = new Image();
    spriteOutput.src = virtCanvas.toDataURL();
    virtCanvas.remove();
    return spriteOutput;
}

// Display a victory message with the number of moves taken.
function displayVictoryMess(moves) {
    document.getElementById("moves").innerHTML = "You Moved " + moves + " Steps.";
    toggleVisablity("Message-Container");
}

// Toggle the visibility of an element with the given 'id'.
function toggleVisablity(id) {
    if (document.getElementById(id).style.visibility == "visible") {
        document.getElementById(id).style.visibility = "hidden";
    } else {
        document.getElementById(id).style.visibility = "visible";
    }
}

// Define a Maze class constructor.
function Maze(Width, Height) {
    var mazeMap;
    var width = Width;
    var height = Height;
    var startCoord, endCoord;
    var dirs = ["n", "s", "e", "w"];

    // Define directional modifications for movement.
    var modDir = {
        n: { y: -1, x: 0, o: "s" },
        s: { y: 1, x: 0, o: "n" },
        e: { y: 0, x: 1, o: "w" },
        w: { y: 0, x: -1, o: "e" }
    };
}

// This method returns the maze map, which is a 2D array representing the maze's structure.
this.map = function() {
    return mazeMap;
};

// This method returns the starting coordinates of the maze.
this.startCoord = function() {
    return startCoord;
};

// This method returns the ending coordinates of the maze.
this.endCoord = function() {
    return endCoord;
};

// This function generates the maze structure. It initializes the 'mazeMap' array
// with cells that have properties to represent walls (n, s, e, w), visited status,
// and prior position.
function genMap() {
    mazeMap = new Array(height);
    for (y = 0; y < height; y++) {
        mazeMap[y] = new Array(width);
        for (x = 0; x < width; ++x) {
            mazeMap[y][x] = {
                n: false,    // Indicates whether there's a wall to the north.
                s: false,    // Indicates whether there's a wall to the south.
                e: false,    // Indicates whether there's a wall to the east.
                w: false,    // Indicates whether there's a wall to the west.
                visited: false,  // Indicates whether this cell has been visited.
                priorPos: null  // Stores the prior position when exploring the maze.
            };
        }
    }
}

// This function generates a maze using a randomized Prim's algorithm.
function defineMaze() {
    var isComp = false;
    var move = false;
    var cellsVisited = 1;
    var numLoops = 0;
    var maxLoops = 0;
    var pos = {
        x: 0,
        y: 0
    };
    var numCells = width * height;

    // Continue generating the maze until it's complete.
    while (!isComp) {
        move = false;
        // Mark the current cell as visited.
        mazeMap[pos.x][pos.y].visited = true;

        if (numLoops >= maxLoops) {
            // Shuffle the directions and reset loop counters.
            shuffle(dirs);
            maxLoops = Math.round(rand(height / 8));
            numLoops = 0;
        }
        numLoops++;

        // Iterate through the shuffled directions.
        for (index = 0; index < dirs.length; index++) {
            var direction = dirs[index];
            var nx = pos.x + modDir[direction].x;
            var ny = pos.y + modDir[direction].y;

            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                // Check if the neighboring cell is unvisited.
                if (!mazeMap[nx][ny].visited) {
                    // Carve a path through walls from the current cell to the neighboring cell.
                    mazeMap[pos.x][pos.y][direction] = true;
                    mazeMap[nx][ny][modDir[direction].o] = true;

                    // Set the neighboring cell as the current cell's prior visited.
                    mazeMap[nx][ny].priorPos = pos;
                    // Update the current cell's position to the newly visited location.
                    pos = {
                        x: nx,
                        y: ny
                    };
                    cellsVisited++;
                    // Recursively call this method on the next cell.
                    move = true;
                    break;
                }
            }
        }

        // Check if the maze generation is complete all cells are visited.
        if (cellsVisited === numCells) {
            isComp = true;
        }
    }
}

// If 'move' is still false, it means that the algorithm failed to find a valid direction to move.
// In this case, move the current position back to the prior cell and recall the method.
if (!move) {
    pos = mazeMap[pos.x][pos.y].priorPos;
}

// Check if the generation of the maze is complete.
if (numCells === cellsVisited) {
    isComp = true;
}

// This function defines the start and end coordinates for the maze.
function defineStartEnd() {
    // Generates a random number (0, 1, 2, or 3) to choose a starting and ending position.
    switch (rand(4)) {
        case 0:
            startCoord = {
                x: 0,
                y: 0
            };
            endCoord = {
                x: height - 1,
                y: width - 1
            };
            break;
        case 1:
            startCoord = {
                x: 0,
                y: width - 1
            };
            endCoord = {
                x: height - 1,
                y: 0
            };
            break;
        case 2:
            startCoord = {
                x: height - 1,
                y: 0
            };
            endCoord = {
                x: 0,
                y: width - 1
            };
            break;
        case 3:
            startCoord = {
                x: height - 1,
                y: width - 1
            };
            endCoord = {
                x: 0,
                y: 0
            };
            break;
    }
}

// This function takes a maze ('Maze'), a canvas context ('ctx'), a cell size ('cellsize'), and an optional end sprite ('endSprite') and draws the maze on the canvas.
function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
    var map = Maze.map();
    var cellSize = cellsize;
    var drawEndMethod;
    ctx.lineWidth = cellSize / 40;

    // This function allows redrawing the maze with a different cell size.
    this.redrawMaze = function(size) {
        cellSize = size;
        ctx.lineWidth = cellSize / 50;
        drawMap();
        drawEndMethod();
    };

    // This function draws the walls and paths of individual cells.
    function drawCell(xCord, yCord, cell) {
        var x = xCord * cellSize;
        var y = yCord * cellSize;
        ctx.lineWidth =3;

        // Draw walls based on cell properties (n, s, e, w).
        if (cell.n == false) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + cellSize, y);
            ctx.stroke();
        }
        if (cell.s === false) {
            ctx.beginPath();
            ctx.moveTo(x, y + cellSize);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        if (cell.e === false) {
            ctx.beginPath();
            ctx.moveTo(x + cellSize, y);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        if (cell.w === false) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + cellSize);
            ctx.stroke();
        }
    }

    // This function draws the entire maze by iterating through cells and drawing each one.
    function drawMap() {
        for (x = 0; x < map.length; x++) {
            for (y = 0; y < map[x].length; y++) {
                drawCell(x, y, map[x][y]);
            }
        }
    }

    // This function draws an end flag at the maze's exit point.
    function drawEndFlag() {
        var coord = Maze.endCoord();
        var gridSize = 4;
        var fraction = cellSize / gridSize - 2;
        var colorSwap = true;
        for (let y = 0; y < gridSize; y++) {
            if (gridSize % 2 == 0) {
                colorSwap = !colorSwap;
            }
            for (let x = 0; x < gridSize; x++) {
                ctx.beginPath();
                ctx.rect(
                    coord.x * cellSize + x * fraction + 4.5,
                    coord.y * cellSize + y * fraction + 4.5,
                    fraction,
                    fraction
                );
                if (colorSwap) {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                } else {
                    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                }
                ctx.fill();
                colorSwap = !colorSwap;
            }
        }
    }

    // This function draws an end sprite at the maze's exit point if provided.
    function drawEndSprite() {
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        var coord = Maze.endCoord();
        ctx.drawImage(
            endSprite,
            2,
            2,
            endSprite.width,
            endSprite.height,
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
    }
}


// This function clears the canvas by specifying its size and using 'clearRect' to erase its content.
function clear() {
    var canvasSize = cellSize * map.length;
    ctx.clearRect(0, 0, canvasSize, canvasSize);
}

// Determine which method to use for drawing the end point (end flag) based on the provided 'endSprite'.
if (endSprite != null) {
    drawEndMethod = drawEndSprite;
} else {
    drawEndMethod = drawEndFlag;
}
clear();  // Clear the canvas.
drawMap();  // Draw the maze.
drawEndMethod();  // Draw the end point.

// Constructor function 'Player' for creating a player object within the maze.
function Player(maze, c, _cellsize, onComplete, sprite = null) {
    var ctx = c.getContext("2d");
    var drawSprite;
    var moves = 0;
    drawSprite = drawSpriteCircle;

    // Use an image sprite for drawing if provided, else use a circle.
    if (sprite != null) {
        drawSprite = drawSpriteImg;
    }

    var player = this;
    var map = maze.map();
    var cellCoords = {
        x: maze.startCoord().x,
        y: maze.startCoord().y
    };
    var cellSize = _cellsize;
    var halfCellSize = cellSize / 2;

    // This function allows redrawing the player with a different cell size.
    this.redrawPlayer = function(_cellsize) {
        cellSize = _cellsize;
        drawSpriteImg(cellCoords);
    };

    // Draw the player as a colored circle at the specified coordinates.
    function drawSpriteCircle(coord) {
        // Draw a yellow circle representing the player.
        ctx.beginPath();
        ctx.fillStyle = "yellow";
        ctx.arc(
            (coord.x + 1) * cellSize - halfCellSize,
            (coord.y + 1) * cellSize - halfCellSize,
            halfCellSize - 2,
            0,
            2 * Math.PI
        );
        ctx.fill();

        // Check if the player has reached the end point and trigger 'onComplete' callback.
        if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
            onComplete(moves);
            player.unbindKeyDown();
        }
    }

    // Draw the player using an image sprite at the specified coordinates.
    function drawSpriteImg(coord) {
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;

        // Draw the player using the provided image sprite.
        ctx.drawImage(
            sprite,
            0,
            0,
            sprite.width,
            sprite.height,
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );

        // Check if the player has reached the end point and trigger 'onComplete' callback.
        if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
            onComplete(moves);
            player.unbindKeyDown();
        }
    }
}

// This function removes a sprite at the specified coordinates by clearing the corresponding area on the canvas.
function removeSprite(coord) {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    ctx.clearRect(
        coord.x * cellSize + offsetLeft,
        coord.y * cellSize + offsetLeft,
        cellSize - offsetRight,
        cellSize - offsetRight
    );
}

// This function handles keyboard and swipe input to move the player within the maze.
function check(e) {
    var cell = map[cellCoords.x][cellCoords.y];
    moves++;
    switch (e.keyCode) {
        case 65:
        case 37: // west
            if (cell.w == true) {
                removeSprite(cellCoords);
                cellCoords = {
                    x: cellCoords.x - 1,
                    y: cellCoords.y
                };
                drawSprite(cellCoords);
            }
            break;
        case 87:
        case 38: // north
            if (cell.n == true) {
                removeSprite(cellCoords);
                cellCoords = {
                    x: cellCoords.x,
                    y: cellCoords.y - 1
                };
                drawSprite(cellCoords);
            }
            break;
        case 68:
        case 39: // east
            if (cell.e == true) {
                removeSprite(cellCoords);
                cellCoords = {
                    x: cellCoords.x + 1,
                    y: cellCoords.y
                };
                drawSprite(cellCoords);
            }
            break;
        case 83:
        case 40: // south
            if (cell.s == true) {
                removeSprite(cellCoords);
                cellCoords = {
                    x: cellCoords.x,
                    y: cellCoords.y + 1
                };
                drawSprite(cellCoords);
            }
            break;
    }
}

// This function binds keyboard and swipe events to move the player within the maze.
this.bindKeyDown = function() {
    // Bind the 'keydown' event to the 'check' function to handle keyboard input.
    window.addEventListener("keydown", check, false);

    // Bind swipe events to handle touch-based input for moving the player.
    $("#view").swipe({
        swipe: function (
            event,
            direction,
            distance,
            duration,
            fingerCount,
            fingerData
        ) {
            switch (direction) {
                case "up":
                    check({
                        keyCode: 38
                    });
                    break;
                case "down":
                    check({
                        keyCode: 40
                    });
                    break;
                case "left":
                    check({
                        keyCode: 37
                    });
                    break;
                case "right":
                    check({
                        keyCode: 39
                    });
                    break;
            }
        },
        threshold: 0
    });
};

// This function unbinds keyboard and swipe events to stop handling player input.
this.unbindKeyDown = function() {
    window.removeEventListener("keydown", check, false);
    $("#view").swipe("destroy");
};

// Draw the player sprite at the maze's starting coordinates.
drawSprite(maze.startCoord());

// Bind keyboard and swipe events for player input.
this.bindKeyDown();

// Obtain a reference to the 'mazeCanvas' element and create a 2D rendering context for drawing on it.
var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var sprite; 
var finishSprite;
var maze, draw, player;
var cellSize;
var difficulty;

// This function sets up event handlers when the window loads.
window.onload = function() {
    // Determine the dimensions of the 'view' element and adjust the canvas size accordingly.
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();
    if (viewHeight < viewWidth) {
        ctx.canvas.width = viewHeight - viewHeight / 100;
        ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
        ctx.canvas.width = viewWidth - viewWidth / 100;
        ctx.canvas.height = viewWidth - viewWidth / 100;
    }

    // Load and modify sprites, ensuring both are complete before proceeding.
    var completeOne = false;
    var completeTwo = false;
    var isComplete = () => {
        if (completeOne === true && completeTwo === true) {
            console.log("Runs");
            setTimeout(function(){
                makeMaze();
            }, 500);
        }
    };
    
    sprite = new Image();
    sprite.src = "./key.png" + "?" + new Date().getTime();
    sprite.setAttribute("crossOrigin", " ");
    sprite.onload = function() {
        sprite = changeBrightness(1.2, sprite);
        completeOne = true;
        console.log(completeOne);
        isComplete();
    };

    finishSprite = new Image();
    finishSprite.src = "./home.png" + "?" + new Date().getTime();
    finishSprite.setAttribute("crossOrigin", " ");
    finishSprite.onload = function() {
        finishSprite = changeBrightness(1.1, finishSprite);
        completeTwo = true;
        console.log(completeTwo);
        isComplete();
    };
};

// This function adjusts canvas size when the window is resized.
window.onresize = function() {
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();
    if (viewHeight < viewWidth) {
        ctx.canvas.width = viewHeight - viewHeight / 100;
        ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
        ctx.canvas.width = viewWidth - viewWidth / 100;
        ctx.canvas.height = viewWidth - viewWidth / 100;
    }
    cellSize = mazeCanvas.width / difficulty;
    if (player != null) {
        draw.redrawMaze(cellSize);
        player.redrawPlayer(cellSize);
    }
};

// This function creates the maze and initializes game elements.
function makeMaze() {
    if (player != undefined) {
        player.unbindKeyDown();
        player = null;
    }
    var e = document.getElementById("diffSelect");
    difficulty = e.options[e.selectedIndex].value;
    cellSize = mazeCanvas.width / difficulty;
    maze = new Maze(difficulty, difficulty);
    draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
    player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);
    if (document.getElementById("mazeContainer").style.opacity < "100") {
        document.getElementById("mazeContainer").style.opacity = "100";
    }
}
