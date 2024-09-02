/**
 * @author Renan Silva (renans2 on GitHub)
 */

// 10x10 board
// each square occupies 10% (0.1) of the width and height of the canvas
let board = [];
let turn = 0;
let selectedPiece;
let currOptions = [];
let movingPieceIsKing = false;
let optionSelected = [];
let gameIsOver = false;

function setup(){
    noStroke();
    windowResized();
    frameRate(20);

    resetBoard();
}

function draw(){
    background(0);
    drawBoardAndPieces();
}

function windowResized(){
    if(windowWidth > windowHeight)
        resizeCanvas(windowHeight, windowHeight);
    else
        resizeCanvas(windowWidth, windowWidth);
}

function resetBoard(){
    for (let i = 0; i < 10; i++) {
        board[i] = [];
        for (let j = 0; j < 10; j++) {
            if((i + j) % 2 === 0){
                if(0 <= i && i <= 3)
                    board[i][j] = {player: 1, piece: "pawn"};
                else if(6 <= i && i <= 9)
                    board[i][j] = {player: 0, piece: "pawn"};
                else
                    board[i][j] = "";
            } else {
                board[i][j] = "";
            }
        }
    }
}

function drawBoardAndPieces(){
    // the proportion of 1:1 is maintained so it doesn't matter
    // if is "width" or "height", because they have the same value
    const offset = 0.1 * width;

    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {

            if((row + col) % 2 === 0){
                if((hoveringPlayablePiece(row, col)) ||
                   (selectedPiece != null && isAnOption(row, col)) ||
                   (selectedPiece != null && selectedPiece.i === row && selectedPiece.j === col)){
                    fill(0,150,0);
                } else {
                    fill(0);
                }
            } else {
                fill(255);
            }

            rect(col * offset, row * offset, offset, offset);

            if(board[row][col].player === 0){
                if(board[row][col].piece === "pawn")
                    fill(255,0,0);
                else
                    fill(255,100,0);
            } else if(board[row][col].player === 1){
                if(board[row][col].piece === "pawn")
                    fill(0,0,255);
                else
                    fill(100,0,255);
            }

            circle(col * offset + offset/2, row * offset + offset/2, 0.8 * offset);
        }
    }
}

function isAnOption(i, j){
    for (const option of currOptions){
        const lastPlace = option[option.length - 1];
        if(lastPlace.i === i && lastPlace.j === j){
            optionSelected = option;
            return true;
        }
    }

    return false;
}

function hoveringPlayablePiece(row, col){
    const offset = 0.1 * width;
    const j = floor(mouseX / offset);
    const i = floor(mouseY / offset);

    return row === i && col === j &&
        ((board[row][col].player === turn) || (board[row][col].player === turn));
}

function mouseClicked(){
    if(insideTheCanvas()){
        const offset = 0.1 * width;
        const j = floor(mouseX / offset);
        const i = floor(mouseY / offset);

        if(board[i][j].player === turn){
            selectedPiece = {
                i: i,
                j: j
            };
            currOptions = [];
            setNoCaptureOptions(i, j);
            setCaptureOptions(i, j, [], board[i][j].piece === "king");
            let temp = [];
            currOptions.forEach(option => {
                if(temp.length === 0)
                    temp.push(option);
                else if(option.length > temp[0].length)
                    temp = [option];
                else if(option.length === temp[0].length)
                    temp.push(option);
            });
            currOptions = temp;
        } else if(board[i][j] === "" && isAnOption(i, j)){
            const piece = board[selectedPiece.i][selectedPiece.j].piece
            moveTo(i, j, piece);
            board[selectedPiece.i][selectedPiece.j] = "";
            updateGameStats();

            if(!gameIsOver){
                checkIfBecomesKing(i, j);
                changeTurn();
            }
        }
    }
}

function moveTo(i, j, piece){
    board[i][j] = {player: turn, piece: movingPieceIsKing ? "king" : piece};
    movingPieceIsKing = false;

    for (const place of optionSelected) {
        if(place.captureI)
            board[place.captureI][place.captureJ] = "";
    }
}

function updateGameStats(){

}

function setCaptureOptions(i, j, currentTrail, isKing){
    if(isKing){
        let hasTopRightCapture, hasTopLeftCapture, hasBottomRightCapture, hasBottomLeftCapture;

        if(i-2 >= 0){
            if(j-2 >= 0 && board[i-2][j-2] === "" && board[i-1][j-1].player === (turn + 1) % 2 && !hasBeenCaptured(i-1, j-1, currentTrail)){
                hasTopLeftCapture = true;
                setCaptureOptions(i-2, j-2, [...currentTrail, {i: i-2, j: j-2, captureI: i-1, captureJ: j-1}], true);
            }

            if(j+2 <= 9 && board[i-2][j+2] === "" && board[i-1][j+1].player === (turn + 1) % 2 && !hasBeenCaptured(i-1, j+1, currentTrail)){
                hasTopRightCapture = true;
                setCaptureOptions(i-2, j+2, [...currentTrail, {i: i-2, j: j+2, captureI: i-1, captureJ: j+1}], true);
            }

        }

        if(i+2 <= 9){
            if(j-2 >= 0 && board[i+2][j-2] === "" && board[i+1][j-1].player === (turn + 1) % 2 && !hasBeenCaptured(i+1, j-1, currentTrail)){
                hasBottomLeftCapture = true;
                setCaptureOptions(i+2, j-2, [...currentTrail, {i: i+2, j: j-2, captureI: i+1, captureJ: j-1}], true);
            }

            if(j+2 <= 9 && board[i+2][j+2] === "" && board[i+1][j+1].player === (turn + 1) % 2 && !hasBeenCaptured(i+1, j+1, currentTrail)){
                hasBottomRightCapture = true;
                setCaptureOptions(i+2, j+2, [...currentTrail, {i: i+2, j: j+2, captureI: i+1, captureJ: j+1}], true);
            }

        }

        if(!hasTopRightCapture && !hasTopLeftCapture && !hasBottomRightCapture && !hasBottomLeftCapture){
            currOptions.push([...currentTrail]);
        }
    } else if(turn === 0) {
        player1CaptureMovement(i, j, currentTrail);
    } else if(turn === 1) {
        player2CaptureMovement(i, j, currentTrail);
    }
}

function hasBeenCaptured(i, j, currentTrail){
    for (const pos of currentTrail) {
        if(pos.captureI === i && pos.captureJ === j)
            return true;
    }

    return false;
}

function player1CaptureMovement(i, j, currentTrail){
    if(i-2 >= 0){
        let hasRightCapture, hasLeftCapture;

        if(j-2 >= 0 && board[i-2][j-2] === "" && board[i-1][j-1].player === (turn + 1) % 2){
            hasLeftCapture = true;
            setCaptureOptions(i-2, j-2, [...currentTrail, {i: i-2, j: j-2, captureI: i-1, captureJ: j-1}], false);
        }

        if(j+2 <= 9 && board[i-2][j+2] === "" && board[i-1][j+1].player === (turn + 1) % 2){
            hasRightCapture = true;
            setCaptureOptions(i-2, j+2, [...currentTrail, {i: i-2, j: j+2, captureI: i-1, captureJ: j+1}], false);
        }

        if(!hasLeftCapture && !hasRightCapture){
            currOptions.push([...currentTrail]);
        }
    } else if(i === 0) {
        movingPieceIsKing = true;
        setCaptureOptions(i, j, [...currentTrail], true);
    } else {
        currOptions.push([...currentTrail]);
    }
}

function player2CaptureMovement(i, j, currentTrail){
    if(i+2 <= 9){
        let hasRightCapture, hasLeftCapture;

        if(j-2 >= 0 && board[i+2][j-2] === "" && board[i+1][j-1].player === (turn + 1) % 2){
            hasLeftCapture = true;
            setCaptureOptions(i+2, j-2, [...currentTrail, {i: i+2, j: j-2, captureI: i+1, captureJ: j-1}], false);
        }

        if(j+2 <= 9 && board[i+2][j+2] === "" && board[i+1][j+1].player === (turn + 1) % 2){
            hasRightCapture = true;
            setCaptureOptions(i+2, j+2, [...currentTrail, {i: i+2, j: j+2, captureI: i+1, captureJ: j+1}], false);
        }

        if(!hasLeftCapture && !hasRightCapture){
            currOptions.push([...currentTrail]);
        }
    } else if(i === 9) {
        movingPieceIsKing = true;
        setCaptureOptions(i, j, [...currentTrail], true);
    } else {
        currOptions.push([...currentTrail]);
    }
}

function checkIfBecomesKing(i, j){
    if(board[i][j].piece === "pawn"){
        if((turn === 0 && i === 0) || (turn === 1 && i === 9))
            board[i][j].piece = "king";
    }
}

function setNoCaptureOptions(i, j){
    if(board[i][j].piece === "pawn"){
        if(turn === 0){
            if(i-1 >= 0){
                if(j-1 >= 0 && board[i-1][j-1] === "")
                    currOptions.push([{i: i-1, j: j-1}]);
                if(j+1 <= 9 && board[i-1][j+1] === "")
                    currOptions.push([{i: i-1, j: j+1}]);
            }
        } else {
            if(i+1 <= 9){
                if(j-1 >= 0 && board[i+1][j-1] === "")
                    currOptions.push([{i: i+1, j: j-1}]);
                if(j+1 <= 9 && board[i+1][j+1] === "")
                    currOptions.push([{i: i+1, j: j+1}]);
            }
        }
    } else {

    }
}

// function pieceHasOptions(i, j){
//     return getOptions(i, j).length > 0;
// }

function changeTurn(){
    turn = (turn + 1) % 2;
    currOptions = [];
    selectedPiece = null;
}

function insideTheCanvas(){
    return 0 <= mouseX && mouseX <= width && 0 <= mouseY && mouseY <= height;
}
