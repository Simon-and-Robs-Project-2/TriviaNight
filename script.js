// fetch('https://opentdb.com/api.php?amount=10&difficulty=easy')
//     .then((response) => {
//         return response.json()
//     })
//     .then((triviaData) => {
//         console.log(triviaData);
//     })




// namespace object
const triviaApp = {};


// saved variables / selectors?
triviaApp.startButton = document.getElementById('startButton');
triviaApp.triviaCard = document.querySelector('div.welcomePage');

triviaApp.baseUrl = 'https://opentdb.com/api.php';

triviaApp.allQuestions = [];

triviaApp.questionCounter = 0;

triviaApp.scoreCounter = 0;

// init function definition
triviaApp.init = () => {
    triviaApp.startGame();
}


    // event listener that listens to user clicking 'start game' -> clears the welcome screen off the page and runs a startGameFunction

triviaApp.startGame = () => {
    triviaApp.startButton.addEventListener('click', function() {
        const chosenDifficulty = document.querySelector('input[name="select"]:checked').value;
        console.log(chosenDifficulty);

        // make the API call
        triviaApp.getQuestions(chosenDifficulty);

        // clear out card html so theres room to load the questions
        // triviaApp.triviaCard.innerHTML = '';

    })
}

triviaApp.getQuestions = (chosenDifficulty) => {
    // create new url object
    const url = new URL(triviaApp.baseUrl);

    // add search paramters:
    url.search = new URLSearchParams({
        amount: 10,
        difficulty: chosenDifficulty
    })

    // make API call with url:

    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((triviaData) => {
            triviaApp.allQuestions = triviaData.results; // store questions array in namespace object
            // call a function to load a question 
            triviaApp.loadQuestion(0);
        });

}

// // loadQuestion should go into a single question object, and take the question, wrong answers array, and right answer array and store them locally.
// //We should create a third array of allAnswerOptions, which would combine the right and wrong anwers.
// we need a helper function that will randomize the order of the allAnswersOptions
// Once the answers are randomized we build out the html of the question
// add the question to a h2 or something, and the possible answers each to a radio input (?), and add a submit button
// add an event listener to the submit button that will call a checkAnswerFunction


triviaApp.loadQuestion = (indexNumber) => {

    if ( triviaApp.questionCounter <= 3) {
        const question = triviaApp.allQuestions[indexNumber].question;
        const wrongAnswers = triviaApp.allQuestions[indexNumber].incorrect_answers;
        const rightAnswer = triviaApp.allQuestions[indexNumber].correct_answer;
        // create a new array that will hold all the answers, adding the wrong answers:
        const allAnswers = wrongAnswers.map((answer) => {
            return answer;
        })
        // push the correct answer to the array allAnswers
        allAnswers.push(rightAnswer);

        // RANDOMIZE THE ARRAY OF ANSWERS - DEAL WITH LATER
        triviaApp.shuffle(allAnswers);

        // ADD stuff to the DOM

        if (allAnswers.length === 4) {

        triviaApp.triviaCard.innerHTML = `
            <h2 id="question">${question}</h2>
    
            <form action="">
                <input type="radio" name="triviaAnswer" value="${allAnswers[0]}" id="option1" class="sr-only" >
                <label for="option1" class="answer">${allAnswers[0]}</label>
        
                <input type="radio" name="triviaAnswer" value="${allAnswers[1]}" id="option2" class="sr-only" >
                <label for="option2" class="answer">${allAnswers[1]}</label>
                
                <input type="radio" name="triviaAnswer" value="${allAnswers[2]}" id="option3" class="sr-only" >
                <label for="option3" class="answer">${allAnswers[2]}</label>
        
                <input type="radio" name="triviaAnswer" value="${allAnswers[3]}" id="option4" class="sr-only" >
                <label for="option4" class="answer">${allAnswers[3]}</label>
        
            </form>

            <button class="submitAnswer" id="submitAnswer">Submit!</button>

            <div id="areYouRight"></div>
        `;

        } else if (allAnswers.length === 2) {

            triviaApp.triviaCard.innerHTML = `
            <h2 id="question">${question}</h2>
    
            <form action="">

                <input type="radio" name="triviaAnswer" value="${allAnswers[0]}" id="option1" class="sr-only" >
                <label for="option1" class="answer">${allAnswers[0]}</label>
        
                <input type="radio" name="triviaAnswer" value="${allAnswers[1]}" id="option2" class="sr-only" >
                <label for="option2" class="answer">${allAnswers[1]}</label>
        
            </form>

            <button class="submitAnswer" id="submitAnswer">Submit!</button>
            
            <div id="areYouRight"></div>
        `;
        }
        const submitButton = document.getElementById('submitAnswer');
        submitButton.addEventListener('click', function () {
            const userAnswer = document.querySelector('input[name="triviaAnswer"]:checked');
            const computerReply = document.getElementById('areYouRight');
            const nextQuestion = document.createElement('button')
            nextQuestion.innerHTML = 'Next Question';
            console.log(userAnswer);
            if (userAnswer.value === rightAnswer){
                computerReply.innerText =`you are right ${rightAnswer}`;
                computerReply.classList.add('banana');
                triviaApp.scoreCounter++;

            }else{
                computerReply.innerText = `you are wrong, the right answer was ${rightAnswer}`;
                console.log("you are wrong");
            }

            triviaApp.questionCounter++;

            computerReply.append(nextQuestion);

            nextQuestion.addEventListener('click', function(){
                triviaApp.loadQuestion(triviaApp.questionCounter);
            })
        });


        // const nextQuestion = document.createElement('button')
        // nextQuestion.addEventListener('click')
        // nextQuestion.innerHTML = 'Next Question';


    } else { 
        // end the game, print score, etc..
        alert('game over');
    }

    


    // when the submit button is pressed i++, loadQuestion(i)
}


// RANDOMIZER Helper function to shuffle the order of the all answers array:
// Solution found from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

triviaApp.shuffle = (array) => {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}





// function shuffle(array) {
//     let currentIndex = array.length,  randomIndex;
  
//     // While there remain elements to shuffle.
//     while (currentIndex != 0) {
  
//       // Pick a remaining element.
//       randomIndex = Math.floor(Math.random() * currentIndex);
//       currentIndex--;
  
//       // And swap it with the current element.
//       [array[currentIndex], array[randomIndex]] = [
//         array[randomIndex], array[currentIndex]];
//     }
  
//     return array;
//   }



// //startGameFunction will make the API call to retrive the trivia questions
    //  //should the returned object/array be stored to a variable within the startGameFunction? If so, we should define an empty variable before making the API call, and then push the API response to the empty array. Or should we work directly from the returned object/array inside the .then()?

// Once we have the array of questions, maybe call a function like loadQuestion(#), where # would be the first question in the array so loadQuestion(array[0]), and then when the user submits their answer, we could have it run loadQuestion(array[1]), etc... so we would need a counter to keep track of what question they are on?





    // checkAnswerFunction will take the .value of whichever answer was chosen by the user and compare it against the original correct answer we got from the API. If correct, up a counter by 1 and visually show the user they were corect (another function or just write it in the if-statement?), if incorrect, score counter does not change but shows that user was incorrect. In both scenarios, we will still need to go to the next question, so clear all the current html elements and loadQuestion(array[whatever the next number is]) or some other way of moving to the next question?

    // Once the user has reached the last question, stop trying to load questions and show them a screen with their score. Not sure how we know if the user is on the last question yet. Maybe we need an if-statement somewhere to check what question they are on somewhere in the logic above.


// init function call
triviaApp.init()