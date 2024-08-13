/**
 * @author Renan Silva (renans2 on GitHub)
 */

let turn = 0;
let board = [];
fillBoardWithDivs();
setStartingPositions();

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
        $(board[1][j]).addClass("pawn-black black-piece");
        $(board[6][j]).addClass("pawn-white white-piece");
    }

    // Rooks
    $(board[0][0]).addClass("rook-black black-piece");
    $(board[0][7]).addClass("rook-black black-piece");
    $(board[7][0]).addClass("rook-white white-piece");
    $(board[7][7]).addClass("rook-white white-piece");

    // Knights
    $(board[0][1]).addClass("knight-black black-piece");
    $(board[0][6]).addClass("knight-black black-piece");
    $(board[7][1]).addClass("knight-white white-piece");
    $(board[7][6]).addClass("knight-white white-piece");

    // Bishops
    $(board[0][2]).addClass("bishop-black black-piece");
    $(board[0][5]).addClass("bishop-black black-piece");
    $(board[7][2]).addClass("bishop-white white-piece");
    $(board[7][5]).addClass("bishop-white white-piece");

    // Queens
    $(board[0][3]).addClass("queen-black black-piece");
    $(board[7][3]).addClass("queen-white white-piece");

    // Kings
    $(board[0][4]).addClass("king-black black-piece");
    $(board[7][4]).addClass("king-white white-piece");
}

$(".white-piece").on("click", function(){
   if(turn === 0){
       const i = $(this).attr("data-i");
       const j = $(this).attr("data-j");
   }
});

// $(".square").each(function(){
//     const i = $(this).attr("data-i");
//     const j = $(this).attr("data-j");
//     console.log(i + " " + j);
// });
