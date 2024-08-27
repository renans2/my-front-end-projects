/**
 * @author Renan Silva (renans2 on GitHub)
 */

let turn = 0;
let selectedPiece = null;
let options = []
let board = [];
let boardCopy = [];
let gameIsOver = false;

let squareTo, squareToPiece, squareToPieceColor, squareToI, squareToJ;
fillBoardWithDivs();
setStartingPositions();
$(".white-piece").addClass("canHover");
$(".black-piece").addClass("cannotHover");

$(".square").on("click", function(){
    const square = $(this);
    const i = parseInt(square.attr("data-i"));
    const j = parseInt(square.attr("data-j"));

    if(triesToMove(square)){
        for (const option of options){
            if(squareIsInOptions(option, i, j)){
                const movingPieceColor = selectedPiece.hasClass("white-piece") ? "white" : "black";
                makeBoardCopyAndMakeMove(square);
                if(!leavesKingInCheck(movingPieceColor)){
                    makeMove(square);
                    verifyCheckMate();
                    toggleHighlightedSquares();
                    changeTurn();
                    break;
                }else{
                    console.log("cant do that");
                }
            }
        }
    } else if(selectedOtherPiece(square)){
        if(selectedPiece != null)
            toggleHighlightedSquares();

        selectedPiece = square;
        const piece = square.attr("data-piece");

        options = returnOptions(piece, i, j, board);
        toggleHighlightedSquares();
    }
});

function makeBoardCopyAndMakeMove(square){
    const iSquare = parseInt(square.attr("data-i"));
    const jSquare = parseInt(square.attr("data-j"));
    const iSelectedPiece = parseInt(selectedPiece.attr("data-i"));
    const jSelectedPiece = parseInt(selectedPiece.attr("data-j"));

    for(let i = 0; i < board.length; i++){
        boardCopy[i] = [];
        for (let j = 0; j < board[i].length; j++) {
            boardCopy[i][j] = board[i][j].clone();
        }
    }

    boardCopy[iSquare][jSquare].attr("data-piece", boardCopy[iSelectedPiece][jSelectedPiece].attr("data-piece"));
    boardCopy[iSelectedPiece][jSelectedPiece].removeAttr("data-piece");

    if(boardCopy[iSelectedPiece][jSelectedPiece].hasClass("white-piece")){
        boardCopy[iSelectedPiece][jSelectedPiece].removeClass("white-piece");
        boardCopy[iSquare][jSquare].addClass("white-piece");
        boardCopy[iSquare][jSquare].removeClass("black-piece");
    } else {
        boardCopy[iSelectedPiece][jSelectedPiece].removeClass("black-piece");
        boardCopy[iSquare][jSquare].addClass("black-piece");
        boardCopy[iSquare][jSquare].removeClass("white-piece");
    }
}

function leavesKingInCheck(movingPieceColor){
    const adversaryColor = movingPieceColor === "white" ? "black-piece" : "white-piece";
    const kingColor = movingPieceColor === "white" ? "king-white" : "king-black";
    let kingI, kingJ;

    for (let i = 0; i < boardCopy.length; i++) {
        for (let j = 0; j < boardCopy[i].length; j++) {
            if(boardCopy[i][j].attr("data-piece") === kingColor){
                kingI = i;
                kingJ = j;
            }
        }
    }

    for (let i = 0; i < boardCopy.length; i++) {
        for (let j = 0; j < boardCopy[i].length; j++) {
            if(boardCopy[i][j].hasClass(adversaryColor)){
                for (const option of returnOptions(boardCopy[i][j].attr("data-piece"),i,j,boardCopy)) {
                    if(option.i === kingI && option.j === kingJ)
                        return true;
                }
            }
        }
    }
}

function makeMove(square){
    square.attr("data-piece", selectedPiece.attr("data-piece"));
    selectedPiece.removeAttr("data-piece");

    if(selectedPiece.hasClass("white-piece")){
        selectedPiece.removeClass("white-piece");
        square.addClass("white-piece");
        square.removeClass("black-piece");
    } else {
        selectedPiece.removeClass("black-piece");
        square.addClass("black-piece");
        square.removeClass("white-piece");
    }

    squareTo = square;
    squareToPiece = square.attr("data-piece");
    squareToPieceColor = square.hasClass("white-piece") ? "white" : "black";
    squareToI = parseInt(square.attr("data-i"));
    squareToJ = parseInt(square.attr("data-j"));
}

function verifyCheckMate(){
    let allOptions = [];

    $(`.${squareToPieceColor}-piece`).each(function(){
        allOptions = allOptions.concat(returnOptions($(this).attr("data-piece"),
                                                     parseInt($(this).attr("data-i")),
                                                     parseInt($(this).attr("data-j")), board));
    });

    let kingOptions = [];
    let king;
    let piece;

    if(squareToPieceColor === "white"){
        piece = "king-black";
        king = $("[data-piece='king-black']").first();
    } else {
        piece = "king-white";
        king = $("[data-piece='king-white']").first();
    }

    const kingI = parseInt(king.attr("data-i"));
    const kingJ = parseInt(king.attr("data-j"));

    kingOptions.push({i: kingI, j: kingJ});
    kingOptions = kingOptions.concat(returnOptions(piece, kingI, kingJ, board));

    let hasSafeOption = false;

    for (const kingOption of kingOptions)
        if(kingOptionIsSafe(kingOption, allOptions)){
            hasSafeOption = true;
            break;
        }

    const defenderColor = squareToPieceColor === "white" ? "black" : "white";

    if(!hasSafeOption && cantStopCheck(kingI, kingJ, defenderColor)){
        gameIsOver = true;
        console.log("over");
    }
}

function cantStopCheck(kingI, kingJ, defenderColor){
    if(squareToPiece === `knight-${squareToPieceColor}` ||
       squareToPiece === `pawn-${squareToPieceColor}`   ||
       squareToPiece === `king-${squareToPieceColor}`){
        return true;
    } else {
        const checkerOptions = getOptionsUntilKing(kingI, kingJ);
        let defenderOptions = [];

        $(`.${defenderColor}-piece`).each(function(){
            if($(this).attr("data-piece") !== `king-${defenderColor}`){
                defenderOptions = defenderOptions.concat(returnOptions($(this).attr("data-piece"),
                    parseInt($(this).attr("data-i")),
                    parseInt($(this).attr("data-j")), board));
            }
        });

        for (const checkerOption of checkerOptions)
            for (const defenderOption of defenderOptions)
                if(checkerOption.i === defenderOption.i && checkerOption.j === defenderOption.j)
                    return false;

        return true;
    }
}

function getOptionsUntilKing(kingI, kingJ){
    let options = [];
    options.push({i: squareToI, j: squareToJ});
    const tempOptions = returnOptions(squareToPiece, squareToI, squareToJ, board);

    if(kingI === squareToI){
        if(kingJ > squareToJ){
            for (const option of tempOptions)
                if(option.i === kingI && option.j > squareToJ && option.j !== kingJ)
                    options.push(option);
        }else{
            for (const option of tempOptions)
                if(option.i === kingI && option.j < squareToJ && option.j !== kingJ)
                    options.push(option);
        }
    } else if(kingJ === squareToJ){
        if(kingI > squareToI){
            for (const option of tempOptions)
                if(option.j === kingJ && option.i > squareToI && option.i !== kingI)
                    options.push(option);
        }else{
            for (const option of tempOptions)
                if(option.j === kingJ && option.i < squareToI && option.i !== kingI)
                    options.push(option);
        }
    } else if(kingI < squareToI){
        if(kingJ < squareToJ){
            for (const option of tempOptions)
                if(option.i < squareToI && option.j < squareToJ && option.i !== kingI && option.j !== kingJ)
                    options.push(option);
        }else{
            for (const option of tempOptions)
                if(option.i < squareToI && option.j > squareToJ && option.i !== kingI && option.j !== kingJ)
                    options.push(option);
        }
    } else if(kingI > squareToI){
        if(kingJ < squareToJ){
            for (const option of tempOptions)
                if(option.i > squareToI && option.j < squareToJ && option.i !== kingI && option.j !== kingJ)
                    options.push(option);
        }else{
            for (const option of tempOptions)
                if(option.i > squareToI && option.j > squareToJ && option.i !== kingI && option.j !== kingJ)
                    options.push(option);
        }
    }

    return options;
}

function kingOptionIsSafe(kingPosition, allOptions){
    for (const option of allOptions) {
        if(option.i === kingPosition.i &&
           option.j === kingPosition.j)
            return false;
    }

    return true;
}

function triesToMove(square){
    return selectedPiece != null &&
           (blackTriesToCaptureWhite(square) || whiteTriesToCaptureBlack(square) || isFreeSquare(square));
}

function blackTriesToCaptureWhite(square){
    return square.hasClass("white-piece") && turn === 1;
}

function whiteTriesToCaptureBlack(square){
    return square.hasClass("black-piece") && turn === 0;
}

function isFreeSquare(square){
    return !square.hasClass("white-piece") && !square.hasClass("black-piece");
}

function squareIsInOptions(option, i, j){
    return option.i === i && option.j === j;
}

function selectedOtherPiece(square){
    return (square.hasClass("white-piece") && turn === 0) || (square.hasClass("black-piece") && turn === 1);
}

function fillBoardWithDivs(){
    for (let i = 0; i < 8; i++) {
        board[i] = [];

        for (let j = 0; j < 8; j++) {
            const square = $("<div class='square'>");
            $(square).attr("data-i", `${i}`);
            $(square).attr("data-j", `${j}`);

            if((i + j) % 2 === 0)
                square.addClass("black-square");
            else
                square.addClass("white-square");

            $(".container").append(square);
            board[i][j] = square;
        }
    }
}

function setStartingPositions(){
    // Pawns
    for (let j = 0; j < 8; j++){
        $(board[1][j]).attr("data-piece", "pawn-black");
        $(board[1][j]).addClass("black-piece");
        $(board[0][j]).addClass("black-piece");
        $(board[6][j]).attr("data-piece", "pawn-white");
        $(board[6][j]).addClass("white-piece");
        $(board[7][j]).addClass("white-piece");
    }

    // Rooks
    $(board[0][0]).attr("data-piece", "rook-black");
    $(board[0][7]).attr("data-piece", "rook-black");
    $(board[7][0]).attr("data-piece", "rook-white");
    $(board[7][7]).attr("data-piece", "rook-white");

    // Knights
    $(board[0][1]).attr("data-piece", "knight-black");
    $(board[0][6]).attr("data-piece", "knight-black");
    $(board[7][1]).attr("data-piece", "knight-white");
    $(board[7][6]).attr("data-piece", "knight-white");

    // Bishops
    $(board[0][2]).attr("data-piece", "bishop-black");
    $(board[0][5]).attr("data-piece", "bishop-black");
    $(board[7][2]).attr("data-piece", "bishop-white");
    $(board[7][5]).attr("data-piece", "bishop-white");

    // Queens
    $(board[0][3]).attr("data-piece", "queen-black");
    $(board[7][3]).attr("data-piece", "queen-white");

    // Kings
    $(board[0][4]).attr("data-piece", "king-black");
    $(board[7][4]).attr("data-piece", "king-white");
}

function changeTurn(){
    options = [];
    $(selectedPiece).removeClass("canHover");
    selectedPiece = null;
    turn = (turn + 1) % 2;

    if(turn === 1){
        $(".white-piece").removeClass("canHover");
        $(".white-piece").addClass("cannotHover");
        $(".black-piece").toggleClass("canHover cannotHover");
    } else {
        $(".black-piece").removeClass("canHover");
        $(".black-piece").addClass("cannotHover");
        $(".white-piece").toggleClass("canHover cannotHover");
    }
}

function toggleHighlightedSquares(){
    for (const option of options) {
        const tempI = option.i;
        const tempJ = option.j;
        const square = $(board[tempI][tempJ]);

        square.toggleClass("highlighted");
    }

    selectedPiece.toggleClass("highlighted");
}

function returnOptions(piece, i, j, board){
    switch(piece){
        case "pawn-black"  : return casePawn(i, j, "black", board);
        case "pawn-white"  : return casePawn(i, j, "white", board);
        case "knight-black": return caseKnight(i, j, "black", board);
        case "knight-white": return caseKnight(i, j, "white", board);
        case "rook-black"  : return caseRook(i, j, "black", board);
        case "rook-white"  : return caseRook(i, j, "white", board);
        case "bishop-black": return caseBishop(i, j, "black", board);
        case "bishop-white": return caseBishop(i, j, "white", board);
        case "queen-black" : return caseQueen(i, j, "black", board);
        case "queen-white" : return caseQueen(i, j, "white", board);
        case "king-black"  : return caseKing(i, j, "black", board);
        case "king-white"  : return caseKing(i, j, "white", board);
    }
}

function caseKnight(i, j, color, board){
    let options = [];

    if(i-2 >= 0 && j-1 >= 0 && ((color === "white" && !$(board[i-2][j-1]).hasClass("white-piece")) || (color === "black" && !$(board[i-2][j-1]).hasClass("black-piece"))))
        options.push({i: i-2, j: j-1});
    if(i-1 >= 0 && j-2 >= 0 && ((color === "white" && !$(board[i-1][j-2]).hasClass("white-piece")) || (color === "black" && !$(board[i-1][j-2]).hasClass("black-piece"))))
        options.push({i: i-1, j: j-2});
    if(i+1 <= 7 && j-2 >= 0 && ((color === "white" && !$(board[i+1][j-2]).hasClass("white-piece")) || (color === "black" && !$(board[i+1][j-2]).hasClass("black-piece"))))
        options.push({i: i+1, j: j-2});
    if(i+2 <= 7 && j-1 >= 0 && ((color === "white" && !$(board[i+2][j-1]).hasClass("white-piece")) || (color === "black" && !$(board[i+2][j-1]).hasClass("black-piece"))))
        options.push({i: i+2, j: j-1});
    if(i-2 >= 0 && j+1 <= 7 && ((color === "white" && !$(board[i-2][j+1]).hasClass("white-piece")) || (color === "black" && !$(board[i-2][j+1]).hasClass("black-piece"))))
        options.push({i: i-2, j: j+1});
    if(i-1 >= 0 && j+2 <= 7 && ((color === "white" && !$(board[i-1][j+2]).hasClass("white-piece")) || (color === "black" && !$(board[i-1][j+2]).hasClass("black-piece"))))
        options.push({i: i-1, j: j+2});
    if(i+1 <= 7 && j+2 <= 7 && ((color === "white" && !$(board[i+1][j+2]).hasClass("white-piece")) || (color === "black" && !$(board[i+1][j+2]).hasClass("black-piece"))))
        options.push({i: i+1, j: j+2});
    if(i+2 <= 7 && j+1 <= 7 && ((color === "white" && !$(board[i+2][j+1]).hasClass("white-piece")) || (color === "black" && !$(board[i+2][j+1]).hasClass("black-piece"))))
        options.push({i: i+2, j: j+1});

    return options;
}

function casePawn(i, j, color, board){
    let options = [];

    if(color === "white" && i > 0){
        if(j-1 >= 0 && $(board[i-1][j-1]).hasClass("black-piece"))
            options.push({i: i-1, j: j-1});
        if(j+1 <= 7 && $(board[i-1][j+1]).hasClass("black-piece"))
            options.push({i: i-1, j: j+1});
        if(isFreeSquare($(board[i-1][j])))
            options.push({i: i-1, j: j});
    } else if(color === "black" && i < 7){
        if(j-1 >= 0 && $(board[i+1][j-1]).hasClass("white-piece"))
            options.push({i: i+1, j: j-1});
        if(j+1 <= 7 && $(board[i+1][j+1]).hasClass("white-piece"))
            options.push({i: i+1, j: j+1});
        if(isFreeSquare($(board[i+1][j])))
            options.push({i: i+1, j: j});
    }

    if(color === "white" && i === 6 && isFreeSquare($(board[4][j])) && isFreeSquare($(board[5][j])))
        options.push({i: 4, j: j});
    else if(color === "black" && i === 1 && isFreeSquare($(board[3][j])) && isFreeSquare($(board[2][j])))
        options.push({i: 3, j: j});

    return options;
}

function caseRook(i, j, color, board){
    let options = [];

    let tempJ = j+1;
    // Right
    while(tempJ <= 7 && isFreeSquare($(board[i][tempJ]))){
        options.push({i: i, j: tempJ});
        tempJ += 1;
    }
    if(tempJ <= 7 && (($(board[i][tempJ]).hasClass("black-piece") && color === "white") ||
                      ($(board[i][tempJ]).hasClass("white-piece") && color === "black")))
        options.push({i: i, j: tempJ});

    tempJ = j-1;
    // Left
    while(tempJ >= 0 && isFreeSquare($(board[i][tempJ]))){
        options.push({i: i, j: tempJ});
        tempJ -= 1;
    }
    if(tempJ >= 0 && (($(board[i][tempJ]).hasClass("black-piece") && color === "white") ||
                      ($(board[i][tempJ]).hasClass("white-piece") && color === "black")))
        options.push({i: i, j: tempJ});

    let tempI = i-1;
    // Up
    while(tempI >= 0 && isFreeSquare($(board[tempI][j]))){
        options.push({i: tempI, j: j});
        tempI -= 1;
    }
    if(tempI >= 0 && (($(board[tempI][j]).hasClass("black-piece") && color === "white") ||
                      ($(board[tempI][j]).hasClass("white-piece") && color === "black")))
        options.push({i: tempI, j: j});

    tempI = i+1;
    // Down
    while(tempI <= 7 && isFreeSquare($(board[tempI][j]))){
        options.push({i: tempI, j: j});
        tempI += 1;
    }
    if(tempI <= 7 && (($(board[tempI][j]).hasClass("black-piece") && color === "white") ||
                      ($(board[tempI][j]).hasClass("white-piece") && color === "black")))
        options.push({i: tempI, j: j});

    return options;
}

function caseBishop(i, j, color, board){
    let options = [];

    let tempI = i-1;
    let tempJ = j+1;
    // Diagonal up-right
    while(tempI >= 0 && tempJ <= 7 && isFreeSquare($(board[tempI][tempJ]))){
        options.push({i: tempI, j: tempJ});
        tempI -= 1;
        tempJ += 1;
    }
    if(tempI >= 0 && tempJ <= 7 && (($(board[tempI][tempJ]).hasClass("black-piece") && color === "white") ||
                                    ($(board[tempI][tempJ]).hasClass("white-piece") && color === "black")))
        options.push({i: tempI, j: tempJ});

    tempI = i-1;
    tempJ = j-1;
    // Diagonal up-left
    while(tempI >= 0 && tempJ >= 0 && isFreeSquare($(board[tempI][tempJ]))){
        options.push({i: tempI, j: tempJ});
        tempI -= 1;
        tempJ -= 1;
    }
    if(tempI >= 0 && tempJ >= 0 && (($(board[tempI][tempJ]).hasClass("black-piece") && color === "white") ||
                                    ($(board[tempI][tempJ]).hasClass("white-piece") && color === "black")))
        options.push({i: tempI, j: tempJ});

    tempI = i+1;
    tempJ = j+1;
    // Diagonal down-right
    while(tempI <= 7 && tempJ <= 7 && isFreeSquare($(board[tempI][tempJ]))){
        options.push({i: tempI, j: tempJ});
        tempI += 1;
        tempJ += 1;
    }
    if(tempI <= 7 && tempJ <= 7 && (($(board[tempI][tempJ]).hasClass("black-piece") && color === "white") ||
                                    ($(board[tempI][tempJ]).hasClass("white-piece") && color === "black")))
        options.push({i: tempI, j: tempJ});

    tempI = i+1;
    tempJ = j-1;
    // Diagonal down-left
    while(tempI <= 7 && tempJ >= 0 && isFreeSquare($(board[tempI][tempJ]))){
        options.push({i: tempI, j: tempJ});
        tempI += 1;
        tempJ -= 1;
    }
    if(tempI <= 7 && tempJ >= 0 && (($(board[tempI][tempJ]).hasClass("black-piece") && color === "white") ||
                                    ($(board[tempI][tempJ]).hasClass("white-piece") && color === "black")))
        options.push({i: tempI, j: tempJ});

    return options;
}

function caseQueen(i, j, color, board){
    // The Queen is a mix of Rook and Bishop
    return caseRook(i, j, color, board).concat(caseBishop(i, j, color, board));
}

function caseKing(i, j, color, board){
    let options = [];

    for (let k = i-1; k <= i+1; k++)
        for (let l = j-1; l <= j+1; l++)
            if((k !== i || l !== j) &&
                0 <= k && k <= 7    &&
                0 <= l && l <= 7){
                if(color === "white" && !$(board[k][l]).hasClass("white-piece") ||
                   color === "black" && !$(board[k][l]).hasClass("black-piece"))
                        options.push({i: k, j: l});
            }

    return options;
}
