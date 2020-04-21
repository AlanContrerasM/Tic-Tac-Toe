const startButton = document.querySelector("#startButton");
const extraButton = document.querySelector("#extraButton");
const form = document.querySelector(".form");
const formPlayer1 = document.querySelector("#fPlayer1");
const formPlayer2 = document.querySelector("#fPlayer2");
const player2Choice = document.querySelector("#player2Choice");
const formAI = document.querySelector("#fAi");
const gameField = document.querySelectorAll(".gameField");

// we'll be creating modules for game
// and function factories for the players
let player1;
let player2;
// factory for players, wether human, computer, their move, etc.
const Player = (name, type) => {
    let counter = 0;
    const getName = () => name;
    const getType = () => type;
    // we can also do it by functions
    function addCounter(){
        counter++;
    }
    const getCounter = () => counter;
    const resetCounter = () => counter = 0;
    const choose = field => {
        //player picked a square
        console.log("player picked " + field)
    };
    return{getName, getType, addCounter, getCounter, choose}
};


// Module for gameBoard, here we check for game logic and general Board
const gameBoard = (() => {
    'use strict';
    let playingStatus = false;
    const gameField = document.querySelectorAll(".gameField");
    let player1Turn = true;
    
    const setNewBoard = () =>{
        playingStatus = true;
        gameField.forEach(e =>{
            e.innerHTML = "Choose"
            e.onclick = e =>{
                //check if we are playing, if not, we play.
                if(playingStatus == false) return;
                if(e.target.innerHTML != "Choose") return;
                //playing the turn, and checking wether player 2 is human or computer
                if(player1Turn == true){
                    displayController.dlog(player1.getName() + " picked: "+ e.target.id)
                    e.target.innerHTML = "X"

                    //checking for human player2 or computer
                    if(player2.getType() == "Human"){
                        console.log("player 2 turn")
                        player1Turn = false;
                    } else console.log("computer plays");  
                } else{
                    displayController.dlog(player2.getName() + " picked: "+ e.target.id)
                    e.target.innerHTML = "O"
                    player1Turn = true;
                };
                checkForWinner();
            };
        })
    };
    const stopGame = () => {
        playingStatus = false;
        gameField.forEach(e => e.innerHTML = "");
    }
    const checkForWinner = () => {

    }
    return {setNewBoard,
            stopGame}
  })();




// Module for displayController, here we update or render according to plays

const displayController =(() => {
    'use strict';

    const dlog = (...str) => {
        let strJoin = "";
        str.forEach( e => strJoin += e + "<br><br>");
        document.querySelector(".log").innerHTML = strJoin;
    };

    const start = () => {
        if(formPlayer1.value.trim() == "" || 
        formPlayer2.value.trim() == ""){
            alert("You need to give valid names to players brah!");
            return ;
        }

        if(startButton.innerHTML == "Start Game"){
            console.log("pressed start button");
            form.style.display = "none";
            extraButton.style.display = "block";
            startButton.innerHTML = "Restart GameBoard";
            player1 = Player(formPlayer1.value, "Human")
            
            //check if we are playing against human, computer or AI
            if(player2Choice.value == "Human"){
                player2 = Player(formPlayer2.value, "Human")
            }else{
                if(formAI.checked){
                    player2 = Player(formPlayer2.value, "AI")
                } else player2 = Player(formPlayer2.value, "Computer")
            }
            gameBoard.setNewBoard();
            dlog("Let the Games Begin!",
                    player1.getName() +
                    " vs " + 
                    player2.getName() + player2.getType());

        } else {
            gameBoard.setNewBoard();
            dlog("New Round!",
                "Player1 vs Player2");
        }
        

        
    };
    const changePlayers = () => {
        form.style.display = "block";
        startButton.innerHTML = "Start Game";
        extraButton.style.display = "none";
        gameBoard.stopGame();

        dlog("will change players...",
            "Scores set to 0!")
    }
    return {start, 
            changePlayers,
            dlog};

})();


//Event handlers for buttons


startButton.onclick = function(e) {
    displayController.start();
};

extraButton.onclick = e => {
    displayController.changePlayers();
};

formPlayer1.onchange = e => {
    console.log("changed player1")
    document.querySelector("#player1Name").innerHTML = e.target.value;
};

formPlayer2.onchange = e => {
    console.log("changed player2")
    document.querySelector("#player2Name").innerHTML = e.target.value;
};

player2Choice.onchange = e => {
    console.log("changed player2 race" + e.target.value);
    if(e.target.value == "Computer"){
        document.querySelector(".formAi").style.display = "block";
    } else document.querySelector(".formAi").style.display = "none";
}