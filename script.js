fetch('https://opentdb.com/api.php?amount=10&difficulty=easy')
    .then((response) => {
        return response.json()
    })
    .then((triviaData) => {
        console.log(triviaData);
    })


// namespace object
const triviaApp = {};


// saved variables / selectors?

// init function definition
triviaApp.init = () => {

}

// load welcome screen to the window (ask for user's name, difficulty level?)
    // event listener that listens to user clicking 'start game' -> clears the welcome screen off the page and runs a startGameFunction

// startGameFunction will make the API call to retrive the trivia questions
    // ? should the returned object/array be stored to a variable within the startGameFunction? If so, we should define an empty variable before making the API call, and then push the API response to the empty array. Or should we work directly from the returned object/array inside the .then()?

// Once we have the array of questions, maybe call a function like loadQuestion(#), where # would be the first question in the array so loadQuestion(array[0]), and then when the user submits their answer, we could have it run loadQuestion(array[1]), etc... so we would need a counter to keep track of what question they are on?
    // loadQuestion should go into a single question object, and take the question, wrong answers array, and right answer array and store them locally.
    // We should create a third array of allAnswerOptions, which would combine the right and wrong anwers.
    // we need a helper function that will randomize the order of the allAnswersOptions
    // Once the answers are randomized we build out the html of the question
    // add the question to a h2 or something, and the possible answers each to a radio input (?), and add a submit button
    // add an event listener to the submit button that will call a checkAnswerFunction

    // checkAnswerFunction will take the .value of whichever answer was chosen by the user and compare it against the original correct answer we got from the API. If correct, up a counter by 1 and visually show the user they were corect (another function or just write it in the if-statement?), if incorrect, score counter does not change but shows that user was incorrect. In both scenarios, we will still need to go to the next question, so clear all the current html elements and loadQuestion(array[whatever the next number is]) or some other way of moving to the next question?

    // Once the user has reached the last question, stop trying to load questions and show them a screen with their score. Not sure how we know if the user is on the last question yet. Maybe we need an if-statement somewhere to check what question they are on somewhere in the logic above.


// init function call
triviaApp.init()