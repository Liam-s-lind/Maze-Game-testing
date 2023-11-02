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
