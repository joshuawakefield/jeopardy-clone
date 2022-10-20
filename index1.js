let cat = [], //array of category objcts served from web.  categoery object contain all q's and a's
    json = [], //local json mirror of that array
    currentPlayer = true,  //true means player one, false means player two
    playerOneScore = 0,
    playerTwoScore = 0,
    question = "",
    answer = "",
    // cell = null,
    // currentValue = 0,
    i = 0, j = 0,
    playedCellCount = 0;

function keepScore(score) {
    if (currentPlayer) { //player1 is active
        playerOneScore = playerOneScore + parseInt(score);
        if (playerOneScore < 0) {
            document.getElementsByClassName("p1Score")[0].style.color = "red";}
        else {
            document.getElementsByClassName("p1Score")[0].style.color = "black"}
        document.getElementsByClassName("p1Score")[0].innerText = playerOneScore;
    } else {             //player2 is active
        playerTwoScore = playerTwoScore + parseInt(score);
        if (playerTwoScore < 0) {
            document.getElementsByClassName("p2Score")[0].style.color = "red";}
        else {
            document.getElementsByClassName("p2Score")[0].style.color = "black"}
        document.getElementsByClassName("p2Score")[0].innerText = playerTwoScore;
    }
}

async function start()
{ 
    const score1Container = document.getElementsByClassName("score1Container")[0],
        score2Container = document.getElementsByClassName("score2Container")[0];
    
    for (i = 0; i < 6; i++){ //per category
        cat[i] = await fetch(`https://jservice.io/api/category?id=${Math.floor(Math.random() * 2775) + 1}`);
        json[i] = await cat[i].json();  //jsonify each category and store locally

        document.getElementsByClassName(`${i + 1}1`)[1].innerText = json[i].title.toUpperCase(); //catTitle

        for (j = 1; j < 6; j++) { //fill in 5 question for that category
            question = json[i].clues[j - 1].question,
            answer = json[i].clues[j - 1].answer; let
            cell = document.getElementsByClassName(`${i + 1}${j + 1}`),
            currentValue = parseInt(cell[1].innerText);

            document.getElementsByClassName(`${i + 1}${j + 1}`)[0].addEventListener("click", (e) => {

                let input = prompt(question),
                    
                    isAnswerAcceptable = `\nANSWER: ${answer}\n\nPLAYER: ${input}\n\nIs the answer acceptable?`,
                    otherPlayer = "Would otherPlayer like to answer?";
                
                if (empty(input)) {  //cp, no answer
                    if (confirm(otherPlayer)) { //oP jumping in for possible answer
                        currentPlayer = !currentPlayer; //switch
                        input = prompt(question);                        
                        if (empty(input)) {
                            currentPlayer = !currentPlayer; //oP, timed out, switch
                        } else {
                            if (confirm(isAnswerAcceptable)) {
                                keepScore(currentValue); //oP, right, add, cont's
                            } else {
                                keepScore(-currentValue); //oP, wrong, subtract
                                currentPlayer = !currentPlayer;  //switch
                    }   }   }
                } else {  //cp answered
                    if (confirm(isAnswerAcceptable)) {
                        keepScore(currentValue);  //cp, right, add, cont's
                    } else {
                        keepScore(-currentValue);  //cp, wrong, subtract, switch
                        currentPlayer = !currentPlayer; 
                }   }
                
                if (currentPlayer) {
                    score1Container.style.border = "2px solid black";
                    score2Container.style.border = "";
                } else {
                    score1Container.style.border = "";
                    score2Container.style.border = "2px solid black";
                }

            
                cell[1].innerText = ""; //erase from board
                playedCellCount++;
                cell[0].className = "empty"; //convert to an empty of same size so it disappears
                //cell[0].removeEventListener('click'); //deregister clickListen

                if (playedCellCount === 30) { //round complete.  save data.  load next round
                    localStorage.setItem("jepP1Score", playerOneScore);
                    localStorage.setItem("jepP2Score", playerTwoScore);
                    window.location = "./roundTwo.html"
                }
               

            }) //end eventListener
        } //end j for              
    } //end i for
} //end start()

function empty(input) {
    if (input === "" || input === null) {
        return true;
    } else {
        return false;
    }
}

start();
