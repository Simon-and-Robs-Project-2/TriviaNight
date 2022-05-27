const triviaApp = {};

// SELECTORS / VARIABLES
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

// Add an event listener that will take the user's selected difficulty, and then run the getQuestions function when clicking 'Start Game':
triviaApp.startGame = () => {
    triviaApp.startButton.addEventListener('click', function() {
        const chosenDifficulty = document.querySelector('input[name="select"]:checked').value;
        triviaApp.username = document.querySelector('input[id="name"]').value;

        triviaApp.getQuestions(chosenDifficulty);
    })
}


// Make an AJAX call to retrieve an array of questions from the API, then run the loadQuestion function:
triviaApp.getQuestions = (difficulty) => {
    const url = new URL(triviaApp.baseUrl);
    url.search = new URLSearchParams({
        amount: 10,
        difficulty: difficulty,
    })

    // make API call with url:
    fetch(url)
        .then((response) => {
            return response.json();
            // ! add error handling
        })
        .then((triviaData) => {
            triviaApp.allQuestions = triviaData.results; 

            triviaApp.loadQuestion(0);
        });
}


// First check if the user has completed X number of questions - if not, load a question. If they have reached the limit, end the game:

triviaApp.loadQuestion = (indexNumber) => {

    if ( triviaApp.questionCounter <= 4) {
        // Get all the necessary data for the question from the allQuestions array:
        const question = triviaApp.decode(triviaApp.allQuestions[indexNumber].question)  ;
        const wrongAnswers = triviaApp.allQuestions[indexNumber].incorrect_answers;
        const rightAnswer = triviaApp.allQuestions[indexNumber].correct_answer;
        

        //Create a new array that will hold all the answers, adding the wrong answers:
        const allAnswers = wrongAnswers.map((answer) => {
            return answer;
        })
        // push the correct answer to the array allAnswers
        allAnswers.push(rightAnswer);
        // remove html encoding
        allAnswers.forEach((answer) => {
            return triviaApp.decode(answer);
        })
        // Randomly shuffle the order of the allAnswers array:
        triviaApp.shuffle(allAnswers);

        // Build the question & answers and put it on the page:
        triviaApp.buildQuestion(question, allAnswers);

        // An event listener that waits for the submit button to be clicked then runs the checkAnswer function:
        const submitButton = document.getElementById('submitAnswer');
        submitButton.addEventListener('click', function() {
            triviaApp.checkAnswer(rightAnswer, submitButton);
        });

        
        // If the user has gone through all the question, run endOfGame:
    } else { 
        triviaApp.endOfGame();
    }
}

// Randomizer helper function to shuffle the order of the all answers array:
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

// Helper function to decode the html encoding that are present on some questions/answers. Solution found here: https://tertiumnon.medium.com/js-how-to-decode-html-entities-8ea807a140e5
triviaApp.decode = (text) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

triviaApp.buildQuestion = (question, arrayOfAnswers) => {
    triviaApp.triviaCard.innerHTML = '';

    const newQuestion = document.createElement('h2');
    newQuestion.innerText = question;

    const newForm = document.createElement('form');

    const submit = document.createElement('button');
    const submitSpan = document.createElement('span');
    submitSpan.innerText = 'Submit!';
    submitSpan.classList.add('button_top');
    submit.append(submitSpan);
    // submit.innerText = 'Submit Answer';
    // submit.classList.add('submitAnswer');
    submit.setAttribute('id', 'submitAnswer');

    arrayOfAnswers.forEach((answer, i) => {
        const newInput = document.createElement('input');
        newInput.classList.add('sr-only');
        newInput.setAttribute('type', 'radio');
        newInput.setAttribute('id', `option${i}`);
        newInput.setAttribute('value', answer);
        newInput.setAttribute('name', 'triviaAnswer');

        const newLabel = document.createElement('label');
        newLabel.classList.add('answer');
        newLabel.setAttribute('for', `option${i}`);
        newLabel.innerText = answer;

        newForm.append(newInput, newLabel);
    })

    triviaApp.triviaCard.append(newQuestion, newForm, submit);

}

triviaApp.checkAnswer = (rightAnswer, submitButton) => {
    const userAnswer = document.querySelector('input[name="triviaAnswer"]:checked');
    const userAnswerLabel = document.querySelector('input[name="triviaAnswer"]:checked + label');

    const computerReply = document.createElement('p');
    computerReply.setAttribute('id', 'computerReply');

    
    // check if the user has selected an answer when they submit:
    if (!userAnswer) {
        computerReply.innerText = 'Please choose an answer!';
        triviaApp.triviaCard.append(computerReply);
        setTimeout(function(){
            computerReply.remove();
        }, 1500);

    } else if (userAnswer.value) {
    const nextQuestion = document.createElement('button')
    nextQuestion.innerHTML = 'Next Question';


    if (userAnswer.value === rightAnswer){
        computerReply.textContent = '';
        computerReply.innerText =`Great! ${rightAnswer} is correct!`;
        computerReply.classList.add('banana');
        triviaApp.scoreCounter++;
        
        // allAnswerLabels.style.background = 'red';
        userAnswerLabel.style.background = 'green';

    }else{
        computerReply.innerText = '';
        computerReply.innerText = `Nope! The right answer was ${rightAnswer}`;

        // allAnswerLabels.style.background = 'red';
        userAnswerLabel.style.background = 'red';
    }

    triviaApp.questionCounter++;

    setTimeout(function(){
        computerReply.append(nextQuestion);
    }, 1000)
    
    triviaApp.triviaCard.append(computerReply);

    submitButton.remove();

    nextQuestion.addEventListener('click', function(){
        triviaApp.loadQuestion(triviaApp.questionCounter);
    })
}
}

triviaApp.endOfGame = () => {
            // end the game, print score, etc..
            triviaApp.triviaCard.innerHTML = `
            <h2>Great job, <span id="userName"></span></h2>
            <h3>You scored ${triviaApp.scoreCounter} out of ${triviaApp.questionCounter}</h3>
            <button id="retry"> Try again </button>
            `;
            document.getElementById('userName').innerText = triviaApp.username;
    
            const retryButton = document.getElementById('retry');
            retryButton.addEventListener('click', function() {
                triviaApp.scoreCounter = 0;
                triviaApp.questionCounter = 0;
                console.log('Clicked retry!');
                document.location.reload();
            })
}





// //startGameFunction will make the API call to retrive the trivia questions
    //  //should the returned object/array be stored to a variable within the startGameFunction? If so, we should define an empty variable before making the API call, and then push the API response to the empty array. Or should we work directly from the returned object/array inside the .then()?

// Once we have the array of questions, maybe call a function like loadQuestion(#), where # would be the first question in the array so loadQuestion(array[0]), and then when the user submits their answer, we could have it run loadQuestion(array[1]), etc... so we would need a counter to keep track of what question they are on?





    // checkAnswerFunction will take the .value of whichever answer was chosen by the user and compare it against the original correct answer we got from the API. If correct, up a counter by 1 and visually show the user they were corect (another function or just write it in the if-statement?), if incorrect, score counter does not change but shows that user was incorrect. In both scenarios, we will still need to go to the next question, so clear all the current html elements and loadQuestion(array[whatever the next number is]) or some other way of moving to the next question?

    // Once the user has reached the last question, stop trying to load questions and show them a screen with their score. Not sure how we know if the user is on the last question yet. Maybe we need an if-statement somewhere to check what question they are on somewhere in the logic above.


// init function call
triviaApp.init()