'use strict';

$(document).ready(function(){
  render();
  handleStartQuiz();
  handleEvaluateAnswer();
  continueFromResult ();
  retakeQuiz();
});

// In-memory database of questions
const QUESTIONS = [
  {question: 'What is the character\'s name in Metroid?',
    answers: ['Justin Bailey', 'Samus Aran', 'Langden Olger', 'Mother Brain'],
    correctAnswer: 'Samus Aran'
  },
  {question: 'Which Triforce did Zelda posess?',
    answers: ['Wisdom', 'Power', 'Speed', 'Heart'],
    correctAnswer: 'Wisdom'
  },
  {question: 'Who do you fight before Mike Tyson in Mike Tyson\'s Punch Out?',
    answers: ['Sand Man', 'Soda Popinski', 'King Hippo', 'Super Macho Man'],
    correctAnswer: 'Super Macho Man'
  },
  {question: 'What year did Dr. Light create Mega Man?',
    answers: ['200Y', '200X', '200Z', '200M'],
    correctAnswer: '200X'
  },
  {question: 'What level do you reach after level 99 in Duck Hunt?',
    answers: [98, 0, 1, 100],
    correctAnswer: 0
  }
];

//store state at 1st question
let STORE = {       
  questions: QUESTIONS,
  currentIndex: null,
  ANSWERS: [],
  totalCorrect: 0
};

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

// Template generators
// displays question for current page 
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



