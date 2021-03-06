const triviaApp = {};

// SELECTORS / VARIABLES
triviaApp.startButton = document.getElementById('startButton');
triviaApp.triviaCard = document.querySelector('div.welcomePage');
triviaApp.infoButton = document.getElementById('infoBubble');
triviaApp.aboutSection = document.getElementById('aboutBox');

triviaApp.baseUrl = 'https://opentdb.com/api.php';
triviaApp.allQuestions = [];
triviaApp.questionCounter = 0;
triviaApp.scoreCounter = 0;

// INITIALIZER FUNCTION
triviaApp.init = () => {
    triviaApp.addInfoListener();
    triviaApp.startGame();
}


triviaApp.addInfoListener = () => {
    triviaApp.infoButton.addEventListener('click', function() {
        triviaApp.aboutSection.classList.toggle('show')
    });
} 

// Add an event listener that will take the user's selected difficulty, and then run the getQuestions function when clicking 'Start Game':
triviaApp.startGame = () => {
    triviaApp.startButton.addEventListener('click', function() {
        const chosenDifficulty = document.querySelector('input[name="select"]:checked').value;
        const chosenCategory = document.getElementById('categorySelect').value;
        triviaApp.username = document.querySelector('input[id="name"]').value;

        triviaApp.startButton.classList.add('shrink');

        setTimeout(function() {
            triviaApp.getQuestions(chosenDifficulty, chosenCategory)
        }, 500);
        
    })
}


// Make an AJAX call to retrieve an array of questions from the API, then run the loadQuestion function:
triviaApp.getQuestions = (difficulty, topic) => {
    const url = new URL(triviaApp.baseUrl);
    url.search = new URLSearchParams({
        amount: 10,
        difficulty: difficulty,
        category: topic
    })

    // make API call with url:
    fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                // console.log('Error!!');
                // throw new Error('THROWN error')
            }
        })
        .then((triviaData) => {
            triviaApp.allQuestions = triviaData.results; 

            triviaApp.loadQuestion(0);
        })
        .catch((error) => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.innerText = 'There was an  issue with the API, please try again!' + error;
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


// Function to build the questions on the page
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

// Function to check the user's answer
triviaApp.checkAnswer = (rightAnswer, submitButton) => {
    const userAnswer = document.querySelector('input[name="triviaAnswer"]:checked');
    const userAnswerLabel = document.querySelector('input[name="triviaAnswer"]:checked + label');
    const questionForm = document.querySelector('form');
    
    // Response for an incorrect answer or an empty answer:
    const computerReply = document.createElement('p');


    // check if the user has selected an answer when they submit:
    if (!userAnswer) {
        computerReply.innerText = 'Please choose an answer!';
        triviaApp.triviaCard.append(computerReply);
        setTimeout(function(){
            computerReply.remove();
        }, 1500);

    } else if (userAnswer.value) {
    // Create the next question button:
    const nextQuestion = document.createElement('button');
    const nextSpan = document.createElement('span');
    nextSpan.innerText = 'Next Question!';
    nextSpan.classList.add('button_top');
    nextQuestion.append(nextSpan);

    // Response for a correct answer:
    const computerReplyCorrect = document.createElement('div');
    computerReplyCorrect.setAttribute('id', 'computerReply');
    computerReplyCorrect.classList.add('congrats');



    if (userAnswer.value === rightAnswer) {
        computerReply.textContent = '';
        triviaApp.scoreCounter++;
        
        userAnswerLabel.style.background = '#83BD75';

        // gif shows up overtop label:
        userAnswerLabel.append(computerReplyCorrect);
    } else {
        computerReply.innerText = '';
        computerReply.innerText = `???? Nope! The right answer was ${rightAnswer}`;

        triviaApp.triviaCard.append(computerReply);

        userAnswerLabel.style.background = '#DF6A6A';
    }

    triviaApp.questionCounter++;

    setTimeout(function(){
        triviaApp.triviaCard.append(nextQuestion);
    }, 1000)


    submitButton.remove();

    nextQuestion.addEventListener('click', function(){
        triviaApp.loadQuestion(triviaApp.questionCounter);
    })
}
}

// Function to display score and allow user to play again
triviaApp.endOfGame = () => {
    
    let endGameMessage;

    if ((triviaApp.scoreCounter / triviaApp.questionCounter) >= 0.8) {
        endGameMessage = '????  Great job, ';
    } else if ((triviaApp.scoreCounter / triviaApp.questionCounter) >= 0.5) {
        endGameMessage = '????  Well done, '
    } else if ((triviaApp.scoreCounter / triviaApp.questionCounter) < 0.5) {
        endGameMessage = '???? Pretty good,'
    }



    triviaApp.triviaCard.innerHTML = `
    <h2>${endGameMessage} <span id="userName"></span></h2>
    <h3>You scored ${triviaApp.scoreCounter} out of ${triviaApp.questionCounter}</h3>
    <button id="retry"><span class="button_top">Try again!</span></button>
    `;
    document.getElementById('userName').innerText = triviaApp.username;

    const retryButton = document.getElementById('retry');
    retryButton.addEventListener('click', function() {
        triviaApp.scoreCounter = 0;
        triviaApp.questionCounter = 0;
        document.location.reload();
    })
}


// HELPER FUNCTIONS

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
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

// Helper function to decode the html encoding that are present on some questions/answers. Solution found here: https://tertiumnon.medium.com/js-how-to-decode-html-entities-8ea807a140e5
triviaApp.decode = (text) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

// Initializer function
triviaApp.init()
