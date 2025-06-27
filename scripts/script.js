let welcomeScreen, gameContainer, resultScreen, transitionScreen;
let questionTextElement, answerButtonsContainer, answerButtons, prizeList;
let volumeSlider, gameMuteBtn, welcomeVolumeSlider, welcomeMuteBtn;
let logoContainer, logoEn, logoCh, logoInterval;
let restartBtn, resultMessage, resultPrize;
let cheatPrevQBtn, cheatNextQBtn, cheatRetryQBtn, cheatQuestionNavDiv;
let langEnButton, langZhButton;
let transitionMessage;
let lifeline5050Button;
let nextQuestionBtn;
let factsContainer; // Added factsContainer

// Audio related
const backgroundAudio = new Audio();
const sfxAudio = new Audio();
let currentBackgroundSound = "";
backgroundAudio.volume = 0.5;
sfxAudio.volume = 0.5;
let lastVolume = 0.5;
let isMuted = false;

// Game constants - THIS IS THE SINGLE SOURCE OF TRUTH
const prizeMoney = [
  "NT$1,000",
  "NT$2,000",
  "NT$5,000",
  "NT$10,000",
  "NT$30,000",
  "NT$50,000",
  "NT$80,000",
  "NT$150,000",
  "NT$300,000",
  "NT$1,000,000",
  "NT$1,500,000",
  "NT$3,000,000",
  "NT$5,000,000",
  "NT$10,000,000",
  "NT$30,000,000",
];
const safeHavens = [4, 9, 14]; // 0-indexed

// Game data structures - THIS IS THE SINGLE SOURCE OF TRUTH
let allQuestions = {
  english: {
    level1: [],
    level2: [],
    level3: [],
    level4: [],
    level5: [],
    level6: [],
  },
  traditionalChinese: {
    level1: [],
    level2: [],
    level3: [],
    level4: [],
    level5: [],
    level6: [],
  },
};
// These will be populated by questions_en.js and questions_zh.js
// Ensure questions_en.js defines 'questions_en_data' and questions_zh.js defines 'questions_zh_data' globally.

// Core Game State Variables - THIS IS THE SINGLE SOURCE OF TRUTH
let currentQuestionIndex = 0;
let gameActive = false;
let currentQuestion = null; // Will be an object from allQuestions
let fiftyFiftyUsed = false;
let selectedLanguage = "en"; // Default language
let questionsSuccessfullyLoaded = false;

function initializeElements() {
  // Welcome Screen
  welcomeScreen = document.getElementById("welcome-screen");
  langEnButton = document.getElementById("lang-en");
  langZhButton = document.getElementById("lang-zh");
  welcomeVolumeSlider = document.getElementById("welcome-volume-slider");
  welcomeMuteBtn = document.getElementById("welcome-mute-btn");
  logoContainer = document.getElementById("welcomeLogoContainer");
  logoEn = document.getElementById("logoEn");
  logoCh = document.getElementById("logoCh");

  // Transition Screen
  transitionScreen = document.getElementById("transition-screen");
  transitionMessage = document.getElementById("transition-message");

  // Game Container
  gameContainer = document.querySelector(".game-container");
  questionTextElement = document.getElementById("question-text");
  factsContainer = document.getElementById("facts-container"); // Initialized factsContainer
  answerButtonsContainer = document.querySelector(".answers-container");
  answerButtons = Array.from(
    answerButtonsContainer.getElementsByClassName("answer-btn")
  );
  prizeList = document.getElementById("prize-list");
  lifeline5050Button = document.getElementById("lifeline-5050");
  nextQuestionBtn = document.getElementById("next-question-btn");

  // Volume and Mute for Game Screen
  volumeSlider = document.getElementById("volume-slider");
  gameMuteBtn = document.getElementById("game-mute-btn");

  // Result Screen
  resultScreen = document.getElementById("result-screen");
  restartBtn = document.getElementById("restart-btn");
  resultMessage = document.getElementById("result-message");
  resultPrize = document.getElementById("result-prize");

  // Cheat Buttons
  cheatPrevQBtn = document.getElementById("cheat-prev-q-btn");
  cheatNextQBtn = document.getElementById("cheat-next-q-btn");
  cheatRetryQBtn = document.getElementById("cheat-retry-q-btn");
  cheatQuestionNavDiv = document.getElementById("cheat-question-nav");
}

function setupEventListeners() {
  if (langEnButton)
    langEnButton.addEventListener("click", () => handleLanguageSelection("en"));
  if (langZhButton)
    langZhButton.addEventListener("click", () => handleLanguageSelection("zh"));

  answerButtons.forEach((button) => {
    // Ensure selectAnswer is defined (it should be in game.js and globally accessible or imported)
    if (typeof selectAnswer === "function") {
      button.addEventListener("click", selectAnswer);
    } else {
      console.error(
        "selectAnswer function is not defined when setting up listeners for answerButtons"
      );
    }
  });

  if (lifeline5050Button) {
    // Ensure useFiftyFifty is defined (it should be in game.js or ui.js and globally accessible or imported)
    if (typeof useFiftyFifty === "function") {
      lifeline5050Button.addEventListener("click", useFiftyFifty);
    } else {
      console.error(
        "useFiftyFifty function is not defined when setting up listener for lifeline5050Button"
      );
    }
  }

  if (restartBtn) restartBtn.addEventListener("click", restartGame);

  if (volumeSlider) volumeSlider.addEventListener("input", handleVolumeChange);
  if (welcomeVolumeSlider)
    welcomeVolumeSlider.addEventListener("input", handleVolumeChange);
  if (gameMuteBtn) gameMuteBtn.addEventListener("click", toggleMute);
  if (welcomeMuteBtn) welcomeMuteBtn.addEventListener("click", toggleMute);

  if (cheatPrevQBtn) {
    cheatPrevQBtn.addEventListener("click", () => {
      if (typeof cheatPreviousQuestion === "function") cheatPreviousQuestion();
    });
  }
  if (cheatNextQBtn) {
    cheatNextQBtn.addEventListener("click", () => {
      if (typeof cheatNextQuestion === "function") cheatNextQuestion();
    });
  }
  if (cheatRetryQBtn)
    cheatRetryQBtn.addEventListener("click", handleCheatRetry);
  if (nextQuestionBtn) {
    nextQuestionBtn.addEventListener("click", handleNextQuestionClick);
  }
}

function handleLanguageSelection(lang) {
  selectedLanguage = lang;
  document.documentElement.lang = lang === "en" ? "en" : "zh-Hant";

  if (nextQuestionBtn) {
    nextQuestionBtn.textContent = lang === "en" ? "Next question" : "下一題";
  }
  if (currentBackgroundSound === audioSettings.BGM_WELCOME) {
    stopBackgroundSound();
  }
  if (typeof stopLogoCycling === "function") stopLogoCycling();

  welcomeScreen.classList.add("fade-out-effect");

  setTimeout(() => {
    welcomeScreen.style.display = "none";
    welcomeScreen.classList.remove("fade-out-effect");

    if (typeof buildPrizeLadder === "function" && prizeList) {
      buildPrizeLadder(); // Build ladder so LIs exist for animation
    }

    gameContainer.classList.remove("hidden");
    gameContainer.style.opacity = "0";
    gameContainer.classList.add("prepare-fly-in");

    transitionMessage.style.transition = "";
    transitionMessage.style.opacity = "1";
    transitionMessage.textContent =
      lang === "en" ? "Get ready to play..." : "準備開始遊戲...";
    transitionScreen.classList.remove("hidden");
    transitionScreen.classList.add("fade-in-effect");
    if (typeof playSoundEffect === "function") playSoundEffect("SFX_LETS_PLAY");

    setTimeout(() => {
      gameContainer.style.opacity = "1";
      gameContainer.classList.add("animate-fly-in");
      transitionMessage.style.transition = "opacity 2s ease-out 1s"; // Delay fade out of message
      transitionMessage.style.opacity = "0";
    }, 500);

    setTimeout(() => {
      transitionScreen.classList.remove("fade-in-effect");
      transitionScreen.classList.add("fade-out-effect");

      setTimeout(() => {
        transitionScreen.classList.add("hidden");
        transitionScreen.classList.remove("fade-out-effect");

        transitionMessage.style.transition = "";
        transitionMessage.style.opacity = "1";

        gameContainer.classList.remove("prepare-fly-in", "animate-fly-in");

        // Make volume and cheat controls visible now
        const gameVolumeControl = document.getElementById(
          "game-volume-control"
        ); // Specific ID for game's volume
        const cheatNav = document.getElementById("cheat-question-nav");
        if (gameVolumeControl) {
          gameVolumeControl.classList.add("visible");
        }
        if (cheatNav) {
          cheatNav.classList.add("visible");
        }

        if (typeof loadQuestionsForLanguage === "function") {
          loadQuestionsForLanguage();
        }
      }, globalGameSettings.uiFadeEffectDuration);
    }, globalGameSettings.getReadyMessageDisplayTime);
  }, globalGameSettings.uiFadeEffectDuration);
}

function handleNextQuestionClick() {
  if (nextQuestionBtn) {
    nextQuestionBtn.style.display = "none"; // Hide the button
  }

  // Call a function in game.js to handle the game logic progression
  if (typeof proceedToNextQuestionOrWin === "function") {
    proceedToNextQuestionOrWin();
  }
}

// Initial setup: Show welcome screen, hide game
document.addEventListener("DOMContentLoaded", () => {
  // Initialize elements once DOM is ready, though window.onload will re-run it.
  // It's generally better to pick one primary event for initialization.
  // For now, we'll let window.onload handle the main sequence.
  // This block can be used for things that absolutely must run before images etc. load.
  // However, ensure gameContainer and welcomeScreen are available if accessed here.
  // Let's defer these to showWelcomeScreen called from window.onload
});

function initializeWelcomeScreenAudio() {
  if (typeof playBackgroundSound === "function")
    playBackgroundSound("BGM_WELCOME"); // Use key from audioSettings.js
}

window.onload = () => {
  initializeElements(); // CRITICAL: Initialize all DOM element variables first
  setupEventListeners(); // CRITICAL: Setup event listeners after elements are known

  showWelcomeScreen();
  initializeWelcomeScreenAudio();
  // Any other setup that depends on elements being loaded and listeners attached
};

function showWelcomeScreen() {
  if (gameContainer) gameContainer.classList.add("hidden");
  if (resultScreen) resultScreen.classList.add("hidden");
  if (welcomeScreen) {
    welcomeScreen.style.display = "block";
    if (typeof startLogoCycling === "function") {
      startLogoCycling();
    }
  }
}

function showResultScreen(isWin, prizeAmount) {
  stopBackgroundSound(); // Stop any game BGM
  gameContainer.classList.add("hidden"); // Hide game
  resultScreen.classList.remove("hidden"); // Show result screen
  resultScreen.classList.remove("fade-out-effect");
  resultScreen.classList.add("fade-in-effect");

  if (isWin) {
    if (selectedLanguage === "en") {
      resultMessage.textContent = "Congratulations!";
      resultPrize.textContent = `You've won ${prizeAmount}!`;
    } else {
      resultMessage.textContent = "恭喜！";
      resultPrize.textContent = `你贏得了 ${prizeAmount}！`;
    }
    playSoundEffect("SFX_GAME_WON"); // Play win sound
    document.body.classList.add("game-won-glow");
  } else {
    if (selectedLanguage === "en") {
      resultMessage.textContent = "Game Over!";
      resultPrize.textContent = `You walk away with ${prizeAmount}.`;
    } else {
      resultMessage.textContent = "遊戲結束！";
      resultPrize.textContent = `你獲得了 ${prizeAmount}。`;
    }
    playSoundEffect("SFX_GAME_OVER"); // Play game over sound
  }

  // Show or hide cheat retry button
  if (
    cheatRetryQBtn &&
    questionToRetryIndex !== -1 &&
    questionToRetryIndex < prizeMoney.length // Ensure it's a valid question index
  ) {
    cheatRetryQBtn.style.display = "block";
  } else if (cheatRetryQBtn) {
    cheatRetryQBtn.style.display = "none";
  }
}

function handleCheatRetry() {
  if (typeof executeCheatRetry === "function" && executeCheatRetry()) {
    if (resultScreen) resultScreen.classList.add("hidden");
    if (resultScreen) resultScreen.classList.remove("fade-in-effect");
    if (gameContainer) gameContainer.classList.remove("hidden");
    if (cheatRetryQBtn) cheatRetryQBtn.style.display = "none";
  }
}

function restartGame() {
  stopBackgroundSound();
  stopSoundEffect();

  document.body.classList.remove("game-won-glow", "fanfare-correct");

  // Clear question and answer areas using UI module functions
  if (typeof clearQuestionText === "function") clearQuestionText();
  if (typeof resetAnswerStyles === "function") resetAnswerStyles();
  if (factsContainer) factsContainer.innerHTML = ""; // Clear facts container

  // Hide game container and result screen, show welcome screen
  if (gameContainer) {
    gameContainer.classList.add("hidden"); // Ensure it's hidden
    gameContainer.classList.remove("prepare-fly-in", "animate-fly-in"); // Remove animation classes
    gameContainer.style.opacity = "0"; // Reset opacity in case it was set directly
  }
  // Also ensure lifelines are reset if they show dynamic text, though current setup seems static
  // If lifelines had dynamic text that needed clearing, add a reset function for them here.

  showWelcomeScreen(); // This will also call startLogoCycling
  if (typeof playBackgroundSound === "function")
    playBackgroundSound("BGM_WELCOME"); // Use key from audioSettings.js
}

// Dummy handleVolumeChange and toggleMute if not defined elsewhere, or ensure they are
function handleVolumeChange(event) {
  const newVolume = parseFloat(event.target.value);
  lastVolume = newVolume;
  backgroundAudio.volume = newVolume;
  sfxAudio.volume = newVolume;

  // Update the other slider if they should be synced
  if (event.target.id === "welcome-volume-slider" && volumeSlider) {
    volumeSlider.value = newVolume;
  } else if (event.target.id === "volume-slider" && welcomeVolumeSlider) {
    welcomeVolumeSlider.value = newVolume;
  }

  if (newVolume > 0 && isMuted) {
    isMuted = false;
    if (gameMuteBtn)
      gameMuteBtn.textContent = selectedLanguage === "en" ? "Mute" : "靜音";
    if (welcomeMuteBtn)
      welcomeMuteBtn.textContent = selectedLanguage === "en" ? "Mute" : "靜音";
  } else if (newVolume === 0 && !isMuted) {
    isMuted = true;
    if (gameMuteBtn)
      gameMuteBtn.textContent =
        selectedLanguage === "en" ? "Unmute" : "取消靜音";
    if (welcomeMuteBtn)
      welcomeMuteBtn.textContent =
        selectedLanguage === "en" ? "Unmute" : "取消靜音";
  }
}

function toggleMute() {
  isMuted = !isMuted;
  const currentVolume = isMuted ? 0 : lastVolume;

  backgroundAudio.volume = currentVolume;
  sfxAudio.volume = currentVolume;
  if (volumeSlider) volumeSlider.value = currentVolume;
  if (welcomeVolumeSlider) welcomeVolumeSlider.value = currentVolume;

  const muteText = isMuted
    ? selectedLanguage === "en"
      ? "Unmute"
      : "取消靜音"
    : selectedLanguage === "en"
    ? "Mute"
    : "靜音";
  if (gameMuteBtn) gameMuteBtn.textContent = muteText;
  if (welcomeMuteBtn) welcomeMuteBtn.textContent = muteText;
}

// ... (ensure all other functions like loadQuestionsForLanguage, stopBackgroundSound, playSoundEffect,
//      startLogoCycling, stopLogoCycling, useFiftyFifty, selectAnswer, etc., are defined,
//      likely in their respective files like game.js, ui.js, audio.js and are globally accessible
//      or properly imported/exported if using modules)
