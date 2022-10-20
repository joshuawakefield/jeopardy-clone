let category, //array of category objcts served from web.  categoery object contain all q's and a's
    finalCategory, //local json mirror of that array
    currentPlayer = true,  //true means player one, false means player two
    playerOneScore = 0,
    playerTwoScore = 0,
    question = "",
    answer = "",

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
    //get score from roundTwo
    playerOneScore = localStorage.getItem("jepP1Score");
    playerTwoScore = localStorage.getItem("jepP2Score");
    
    const score1Container = document.getElementsByClassName("score1Container")[0],
        score2Container = document.getElementsByClassName("score2Container")[0];
     
    const category = await fetch(`https://jservice.io/api/category?id=${Math.floor(Math.random() * 2775) + 1}`);
    const finalCategory = await category.json();
    document.getElementsByClassName('final')[0].innerText
        = finalCategory.title.toUpperCase(); //catTitle

    const question = finalCategory.clues[0].question,
        answer = finalCategory.clues[0].answer;
    
    document.getElementsByClassName(`start`)[0].addEventListener("click", (e) => {
   
        let p1wager = prompt("Player 1 Final Bet"),
            p2wager = prompt("Player 2 Final Bet");
        
        p1wager = parseInt(p1wager),
        p2wager = parseInt(p2wager);

        let input1 = prompt(question),
            input2 = prompt(question);
        
        let isAnswerAcceptable = `\nPLAYER1\n\nANSWER: ${answer}\n\nPLAYER: ${input1}\n\nIs the answer acceptable?`;
        if (confirm(isAnswerAcceptable)) {
            keepScore(p1wager);
        } else {
            keepScore(-p1wager);
        }

        currentPlayer = !currentPlayer;
        isAnswerAcceptable = `\nPLAYER2\n\nANSWER: ${answer}\n\nPLAYER: ${input2}\n\nIs the answer acceptable?`;
        if (confirm(isAnswerAcceptable)) {
            keepScore(p2wager);
        } else {
            keepScore(-p2wager);
        }

        //highlight winning score
        if (playerOneScore === playerOneScore) {
            score1Container.style.border = "2px solid black";
            score2Container.style.border = "2px solid black";
        } else if (playerOneScore > playerTwoScore) {
            score1Container.style.border = "2px solid black";
            score2Container.style.border = "";
        } else {
            score1Container.style.border = "";
            score2Container.style.border = "2px solid black";
        }

        //nested ternary to output final text
        const winner = playerOneScore === playerTwoScore ? "ties" :
            playerOneScore > playerTwoScore ? "beats" : "loses to";
        
        document.getElementsByClassName("statusMessage")[0].innerText =
            `Player 1 ${winner} Player 2!`;

        //clear local storage
        localStorage.removeItem("jepP1Score");
        localStorage.removeItem("jepP2Score");
                
    }); //end eventListener

} //end start()

function empty(input) {
    if (input === "" || input === null) {
        return true;
    } else {
        return false;
    }
}

start();