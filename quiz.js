'use strict';

$(document).ready(function(){
  getToken();
  render();
  handleStartQuiz();
  handleEvaluateAnswer();
  continueFromResult ();
  retakeQuiz();
});

//store state at 1st question
let STORE = {      
  categories: [], 
  // questions: QUESTIONS,
  currentIndex: null,
  ANSWERS: [],
  totalCorrect: 0
};

const QUESTIONS = [];

//API call
const BASE_URL = 'https://opentdb.com/';
const QUESTION_PATH = '/api.php';
const SESSION_TOKEN = '';

function getToken() {
  $.getJSON('https://opentdb.com/api_token.php?command=request', logToken);
}

function logToken(response) {
  if(response.response_code !== 0){
    alert('Sorry, Open Trivia API is down. Please try again later!');
  } 
  const token =  response.token;
  let SESSION_TOKEN = token;
  console.log(SESSION_TOKEN);
  getCategories();
}

function getCategories() {
  $.getJSON('https://opentdb.com/api_category.php', logCategories);
}

function logCategories(response) {
  let arr = [];
  const categories = response.trivia_categories.map(function(category){
    let obj = {
      id: category.id,
      name: category.name
    };
    arr.push(obj);
  });
  STORE.categories = arr;
  console.log(STORE.categories);
  generateForm();
}

// In-memory database of questions
const templateQuestions = [
  {question: 'What is the character\'s name in Metroid?',
    answers: ['Justin Bailey', 'Samus Aran', 'Langden Olger', 'Mother Brain'],
    correctAnswer: 'Samus Aran'
  },];



function render(){
  //shows start page
  if (STORE.currentIndex === null){
    $('.start').removeClass('hidden');
    $('.question-page').addClass('hidden');
    $('.question-result-page').addClass('hidden');
    $('.final-result-page').addClass('hidden');
  //shows question pages
  } else if (STORE.currentIndex < 5 && (STORE.ANSWERS.length-1) !== STORE.currentIndex) {
    $('.start').addClass('hidden');
    $('.question-page').removeClass('hidden');
    $('.question-result-page').addClass('hidden');
    $('.final-result-page').addClass('hidden');
  }
  else if (STORE.currentIndex < 5 && (STORE.ANSWERS.length-1) === STORE.currentIndex) {
    $('.start').addClass('hidden');
    $('.question-page').addClass('hidden');
    $('.question-result-page').removeClass('hidden');
    $('.final-result-page').addClass('hidden');
  //shows final result page
  } else {
    $('.start').addClass('hidden');
    $('.question-page').addClass('hidden');
    $('.question-result-page').addClass('hidden');
    $('.final-result-page').removeClass('hidden');
  }
}

function generateForm(){
  $('.user-choice').html(userInputTemplate());
}

// Template generators
// displays question for current page 
function userInputTemplate() {
  const possibleCategories = STORE.categories.map(function(category){
    return `<option value="${category.id}">${category.name}</option>`;
  }).join();
  return `<form>
  <select name="categories"><option value="select">Select Your Category</option>${possibleCategories}
  </select>
  <input type="text" name="number">
  </form>`;
}

function template() { 
  
  const possibleAnswers = QUESTIONS[STORE.currentIndex].answers.map(function(val, index){
    return `
      <div><input type='radio' name='answer' value='${val}' data-index-attr='${index}' required />
        <span class='possible-answers'>
         ${val}
        </span>
      </div>
    `;
  }).join('');
  return `
      <div class="question-container">
        <h1 class="question-title">${QUESTIONS[STORE.currentIndex].question}</h1>
        <form id="answer-options">
          ${possibleAnswers}
          <div><input type="submit" value="Next"></div>
          
          <div>
          <p>Current Score:${STORE.totalCorrect} / ${QUESTIONS.length}</p>
          <p>Question:${STORE.currentIndex+1} / ${QUESTIONS.length}</p> 
      </div>
      </form>
    </div>`; 
}

function resultTemplate(){
  if (STORE.ANSWERS[STORE.ANSWERS.length-1] === QUESTIONS[STORE.currentIndex].correctAnswer) {
    return `
      <div>
        <h1>Congratulations!</h1>
        <div class="message">
           You got it right!
         <div>
         <button type="submit" class="next continue">Continue</button>
      </div>
  `;
  }
  else {
    return `
      <div>
        <h1>Sorry, that's incorrect!</h1>
        <div class="message">
        The correct answer was ${QUESTIONS[STORE.currentIndex].correctAnswer}
        <div>
        <button type="submit" class="next continue">Continue</button>
      </div>
    `;
  }
} 

function finalResultTempalte(){
  return `
    <h1>You scored ${STORE.totalCorrect} / ${QUESTIONS.length}</h1>
    <div class="image">
      <img src="" alt="alt image text  DONT FORGET to update">
    </div>
    <div>
      <button type="submit" class="next retake-quiz" >Retake Quiz</button>
    </div>`;
}

function resetStore(){
  Object.assign(STORE,({currentIndex:null, ANSWERS:[], totalCorrect: 0} ));
  
}

function retakeQuiz (){
  $('.final-result-page').on('click', '.retake-quiz', function(e){
    e.preventDefault();
    console.log('firing');
    resetStore();
    render();
  });
}

function continueFromResult (){
  $('.question-result-page').on('click', '.continue', function(){
    nextQuestion();
    ///if at end, call finalresult tempalte
    if (STORE.currentIndex < 5){
      generateNextQuestion();
      render();
    } else {
      generateFinalResult();
      render();
    }
  });
}

//runs render at null state index (start page)
function handleStartQuiz() {
  $('#start-button').on('click', function(){
    //e.preventDefault();
    STORE.currentIndex=STORE.currentIndex++;
    render();
    generateNextQuestion();
  });
}

function generateNextQuestion(){ 
  $('.question-page').html(template());
}

function generateFinalResult(){ 
  $('.final-result-page').html(finalResultTempalte());
}
 
function nextQuestion(){
  currentScore();
  STORE.currentIndex++;
}

function handleEvaluateAnswer() {
  $('.question-page').on('submit', '#answer-options', function(event){
    event.preventDefault();
    STORE.ANSWERS.push($('input[name="answer"]:checked').val());
    //checkAnswer();
    generateResult();
    render();
  });
}

function generateResult(){
  $('.question-result-page').html(resultTemplate());
  console.log('result template firing');  
}

function currentScore(){
  if (STORE.ANSWERS[STORE.ANSWERS.length-1] === QUESTIONS[STORE.currentIndex].correctAnswer) {
    STORE.totalCorrect++;
  }
}



