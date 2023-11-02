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
