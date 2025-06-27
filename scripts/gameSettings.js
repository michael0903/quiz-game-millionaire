// filepath: /Users/michael_fu/Desktop/Coding/ForFun/Quizgame/gameSettings.js
const globalGameSettings = {
  // Logo Animations (from ui.js)
  logoSpinCompleteDelay: 1000, // ms, total duration for logo spin animation to complete
  logoCycleInterval: 3000, // ms, interval between automatic logo cycles on welcome screen

  // Screen Transitions (from script.js)
  uiFadeEffectDuration: 500, // ms, standard duration for screen fade-in/fade-out effects
  getReadyMessageDisplayTime: 10000, // ms, how long the "Get Ready..." message shows during transition

  // Question Presentation (from game.js)
  questionAloneDisplayDuration: 2000, // ms, time the question is displayed alone before answers start revealing
  answerRevealInterval: 1750, // ms, interval between revealing each answer option one by one

  // Answer Handling & Feedback (from game.js)
  answerLockInCountdownStartValue: 3, // seconds, initial value for the countdown after a player selects an answer (e.g., 5 seconds)
  countdownTickInterval: 1000, // ms, the interval for countdown ticks (typically 1000ms for 1 second)
  correctAnswerFanfareDuration: 3000, // ms, duration of the fanfare/pause after a correct answer (before the next question countdown begins)
  wrongAnswerToGameOverDelay: 2000, // ms, delay after a wrong answer is revealed before the game over screen appears
};
