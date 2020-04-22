const startButton = document.querySelector("#startButton");
const extraButton = document.querySelector("#extraButton");
const form = document.querySelector(".form");
const formPlayer1 = document.querySelector("#fPlayer1");
const formPlayer2 = document.querySelector("#fPlayer2");
const player2Choice = document.querySelector("#player2Choice");
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
    const playComputer = () =>{
        const fieldArray = []
        gameField.forEach(e => {
            if(e.innerHTML == "Choose"){
                fieldArray.push(e)
            }
        });
        const pick = fieldArray[Math.floor(Math.random() * fieldArray.length)];
        return pick;
    }
    return{getName, getType, addCounter, getCounter, resetCounter, playComputer}
};


// Module for gameBoard, here we check for game logic and general Board
//setNewBoard for restarting the game
//StopGame for not accepting new moves
//checkForWinner for game logic
const gameBoard = (() => {
    'use strict';
    let playingStatus = false;
    const gameField = document.querySelectorAll(".gameField");
    let player1Turn = true;
    
    const setNewBoard = () =>{

        displayController.updateNames();
        playingStatus = true;
        player1Turn = true;
        gameField.forEach(e =>{
            e.innerHTML = "Choose";
            e.style.color = "green";
            e.onclick = e =>{
                //check if we are playing, if not, we play.
                if(playingStatus == false) return;
                if(e.target.innerHTML != "Choose") return;
                //playing the turn, and checking wether player 2 is human or computer
                if(player1Turn == true){
                    displayController.dlog(player1.getName() + " picked: "+ e.target.id)
                    e.target.innerHTML = "X"

                    //checking for human player2 or computer or AI
                    if(player2.getType() == "Human"){
                        player1Turn = false;
                        displayController.dlog(player1.getName() + " picked: "+ e.target.id,
                                                player2.getName() + " turn.")
                    }else if (player2.getType() == "Computer"){
                        console.log("computer plays");
                        const pick = player2.playComputer()
                        if (pick != undefined){
                            pick.innerHTML = "O";
                            displayController.dlog(player1.getName() + " picked: "+ e.target.id,
                                                    player2.getName() + " is a computer",
                                                    player2.getName() + " picked: " + pick.id,
                                                    "It's " + player1.getName() + " turn.")
                        };
                    };
                } else{
                    displayController.dlog(player2.getName() + " picked: "+ e.target.id,
                                            player1.getName() + " turn.");
                    e.target.innerHTML = "O";
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
        const t1 = document.querySelector("#t1"); 
        const t2 = document.querySelector("#t2");
        const t3 = document.querySelector("#t3");
        const c1 = document.querySelector("#c1");
        const c2 = document.querySelector("#c2");
        const c3 = document.querySelector("#c3");
        const b1 = document.querySelector("#b1");
        const b2 = document.querySelector("#b2");
        const b3 = document.querySelector("#b3");

        const winningCombos =[
            [t1,t2,t3],
            [c1,c2,c3],
            [b1,b2,b3],
            [t1,c1,b1],
            [t2,c2,b2],
            [t3,c3,b3],
            [t3,c2,b1],
            [t1,c2,b3]
        ]
        
        winningCombos.forEach((e,index)=>{
            if(e[0].innerHTML == "Choose" || e[1].innerHTML == "Choose" || e[2].innerHTML == "Choose"){
                //Do nothing
            }else if (e[0].innerHTML == e[1].innerHTML && e[1].innerHTML == e[2].innerHTML){
                playingStatus = false;
                newWin(e[0], e[1], e[2]);
                console.log("we have a winner")
            }

        });
    }
    const newWin = (f1,f2,f3) =>{
        let color = "blue";
        let winner = player1;
        if (f1.innerHTML == "O") {
            color = "red"
            winner = player2;
        };
        f1.style.color = color;
        f2.style.color = color;
        f3.style.color = color;

        displayController.dlog(winner.getName() + " has won");
        winner.addCounter();
        displayController.updateCounters();
    }
    return {setNewBoard,
            stopGame, 
            checkForWinner}
  })();


// Module for displayController, here we update or render according to plays
//dlog for putting messages on a div
//start so the game plays and we can choose a tictactoe field
//changePlayers, so we can restart our Player objects

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
            }else player2 = Player(formPlayer2.value, "Computer")

            gameBoard.setNewBoard();
            dlog("Let the Games Begin!",
                    player1.getName() +
                    " vs " + 
                    player2.getName() + player2.getType(),
                    player1.getName()+ " Starts!");

        } else {
            gameBoard.setNewBoard();
            dlog("New Round!",
                    player1.getName() +
                    " vs " + 
                    player2.getName() + player2.getType(),
                    player1.getName()+ " Starts!");
        }
        

        
    };
    const changePlayers = () => {
        form.style.display = "block";
        startButton.innerHTML = "Start Game";
        extraButton.style.display = "none";
        gameBoard.stopGame();
        player1.resetCounter();
        player2.resetCounter();
        updateCounters();

        dlog("will change players...",
            "Scores set to 0!")
    }
    const updateCounters = () => {
        document.querySelector("#player1Counter").innerHTML = player1.getCounter();
        document.querySelector("#player2Counter").innerHTML = player2.getCounter();
    };
    const updateNames = () => {
        document.querySelector("#player1Name").innerHTML = formPlayer1.value;
        document.querySelector("#player1Name").innerHTML = formPlayer1.value;
    }
    return {start, 
            changePlayers,
            updateCounters,
            updateNames,
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
}