// These variables are specific to game.js internal logic or temporary state per question
let shuffledAnswers = [];
let questionToRetryIndex = -1; // Stores the index of the question if a retry is allowed

function showQuestion() {
  resetAnswerStyles();
  gameActive = false;
  if (factsContainer) {
    factsContainer.innerHTML = ""; // Clear facts from previous question
    factsContainer.style.display = "none"; // Hide facts container
  }
  if (nextQuestionBtn) nextQuestionBtn.style.display = "none"; // Hide next question button

  answerButtons.forEach((btn) => {
    btn.classList.remove("revealed");
  });

  let questionPoolsForLang;
  if (selectedLanguage === "en") {
    questionPoolsForLang = allQuestions.english;
  } else if (selectedLanguage === "zh") {
    questionPoolsForLang = allQuestions.traditionalChinese;
  } else {
    gameOverWithError("Error: Invalid language selected.");
    return;
  }

  let questionPool;
  let questionPoolIndex;
  let currentLevelKey = "";
  let difficultyForErrorMsg = "";

  // Determine currentLevelKey and questionPoolIndex based on currentQuestionIndex
  if (currentQuestionIndex >= 0 && currentQuestionIndex <= 2) {
    currentLevelKey = "level1";
    questionPoolIndex = currentQuestionIndex;
    difficultyForErrorMsg = "Level 1";
  } else if (currentQuestionIndex >= 3 && currentQuestionIndex <= 5) {
    currentLevelKey = "level2";
    questionPoolIndex = currentQuestionIndex - 3;
    difficultyForErrorMsg = "Level 2";
  } else if (currentQuestionIndex >= 6 && currentQuestionIndex <= 8) {
    currentLevelKey = "level3";
    questionPoolIndex = currentQuestionIndex - 6;
    difficultyForErrorMsg = "Level 3";
  } else if (currentQuestionIndex >= 9 && currentQuestionIndex <= 11) {
    currentLevelKey = "level4";
    questionPoolIndex = currentQuestionIndex - 9;
    difficultyForErrorMsg = "Level 4";
  } else if (currentQuestionIndex >= 12 && currentQuestionIndex <= 13) {
    currentLevelKey = "level5";
    questionPoolIndex = currentQuestionIndex - 12;
    difficultyForErrorMsg = "Level 5";
  } else if (currentQuestionIndex === 14) {
    currentLevelKey = "level6";
    questionPoolIndex = currentQuestionIndex - 14;
    difficultyForErrorMsg = "Level 6";
  } else {
    console.error(
      "Invalid currentQuestionIndex in showQuestion:",
      currentQuestionIndex
    );
    gameOverWithError("Error: Unexpected game progression state.");
    return;
  }

  questionPool = questionPoolsForLang[currentLevelKey];

  if (!questionPool || !questionPool[questionPoolIndex]) {
    gameOverWithError(
      `Error: Not enough ${difficultyForErrorMsg} questions loaded for this stage in ${selectedLanguage}.`
    );
    return;
  }

  currentQuestion = questionPool[questionPoolIndex];

  // Play background music based on current question index
  let bgmKey = "";
  if (currentQuestionIndex >= 0 && currentQuestionIndex <= 4) {
    bgmKey = "BGM_Q1_Q5";
  } else if (currentQuestionIndex === 5) {
    bgmKey = "BGM_Q6";
  } else if (currentQuestionIndex === 6) {
    bgmKey = "BGM_Q7";
  } else if (currentQuestionIndex === 7) {
    bgmKey = "BGM_Q8";
  } else if (currentQuestionIndex === 8) {
    bgmKey = "BGM_Q9";
  } else if (currentQuestionIndex === 9) {
    bgmKey = "BGM_Q10";
  } else if (currentQuestionIndex === 10) {
    bgmKey = "BGM_Q11";
  } else if (currentQuestionIndex === 11) {
    bgmKey = "BGM_Q12";
  } else if (currentQuestionIndex === 12) {
    bgmKey = "BGM_Q13";
  } else if (currentQuestionIndex === 13) {
    bgmKey = "BGM_Q14";
  } else if (currentQuestionIndex === 14) {
    bgmKey = "BGM_Q15";
  }

  if (bgmKey && typeof playBackgroundSound === "function") {
    playBackgroundSound(bgmKey);
  } else {
    if (typeof stopBackgroundSound === "function") {
      stopBackgroundSound();
    }
  }

  const questionTranslationElement = document.createElement("p");
  questionTranslationElement.classList.add("translation");

  if (selectedLanguage === "en") {
    questionTextElement.innerHTML = currentQuestion.question;
    if (currentQuestion.translation) {
      questionTranslationElement.textContent = currentQuestion.translation;
      questionTextElement.appendChild(questionTranslationElement);
    }
  } else {
    questionTextElement.innerHTML = currentQuestion.question;
    if (currentQuestion.englishTranslation) {
      questionTranslationElement.textContent =
        currentQuestion.englishTranslation;
      questionTextElement.appendChild(questionTranslationElement);
    }
  }

  // Prepare answers but don't show them yet
  shuffledAnswers = [...currentQuestion.answers].sort(
    () => Math.random() - 0.5
  );

  answerButtons.forEach((button, index) => {
    const optionPrefixSpan = button.querySelector(".option-prefix");
    // No need for || document.createElement("span") if it's guaranteed by HTML
    if (optionPrefixSpan) {
      // Check if found, though it should be
      optionPrefixSpan.textContent = `${String.fromCharCode(65 + index)}: `;
    }

    const answerTextSpan = button.querySelector(".answer-text");
    // No need for || document.createElement("span") if it's guaranteed by HTML

    if (answerTextSpan) {
      // Check if found
      answerTextSpan.textContent = ""; // Clear existing content
    } else {
      console.error("Answer text span not found in button:", button);
      // If it's critical, you might want to create and append it here as a fallback,
      // but the HTML change should prevent this.
    }

    // Remove old translation span if it exists directly under the button
    const oldTranslationSpan = button.querySelector("span.translation");
    if (oldTranslationSpan) {
      button.removeChild(oldTranslationSpan);
    }

    if (index < shuffledAnswers.length) {
      const answerData = shuffledAnswers[index];
      let mainText, translationText;

      if (selectedLanguage === "en") {
        mainText = answerData.text;
        translationText = answerData.translation;
      } else {
        mainText = answerData.text;
        translationText = answerData.englishTranslation;
      }

      if (answerTextSpan) {
        // Ensure span exists before setting text
        answerTextSpan.textContent = mainText;
      }

      if (translationText) {
        const answerTranslationSpan = document.createElement("span");
        answerTranslationSpan.classList.add("translation");
        answerTranslationSpan.textContent = ` (${translationText})`;
        button.appendChild(answerTranslationSpan);
      }

      button.dataset.correct = answerData.correct;
      button.disabled = true;
      button.classList.remove("hide-lifeline");
    } else {
      button.classList.remove("revealed");
      // Optionally clear or hide buttons if there are more buttons than answers
      if (optionPrefixSpan) optionPrefixSpan.textContent = "";
      if (answerTextSpan) answerTextSpan.textContent = "";
      button.disabled = true;
    }
  });

  updatePrizeHighlight();

  // Display question alone
  setTimeout(() => {
    // Reveal answers one by one
    let revealIndex = 0;
    const revealIntervalTimer = setInterval(() => {
      // Renamed to avoid conflict if revealInterval is a global
      if (revealIndex < answerButtons.length) {
        const buttonToReveal = answerButtons[revealIndex];
        if (revealIndex < shuffledAnswers.length) {
          // Check if button corresponds to an actual answer
          buttonToReveal.classList.add("revealed");
          buttonToReveal.disabled = false;
        }
        revealIndex++;
      } else {
        clearInterval(revealIntervalTimer);
        gameActive = true;
      }
    }, globalGameSettings.answerRevealInterval);
  }, globalGameSettings.questionAloneDisplayDuration);
}

function displayAnswerFacts(playerWasCorrect) {
  if (!factsContainer) return;
  factsContainer.innerHTML = ""; // Clear previous facts
  if (!currentQuestion || !shuffledAnswers || shuffledAnswers.length === 0)
    return;

  // Make facts container visible before adding content
  factsContainer.style.display = "block";

  shuffledAnswers.forEach((answerData, index) => {
    const optionLetter = String.fromCharCode(65 + index);

    let displayFact,
      displayCorrectFact,
      translationFact,
      translationCorrectFact;

    if (selectedLanguage === "en") {
      displayFact = answerData.fact;
      displayCorrectFact = answerData.correctFact;
      translationFact = answerData.fact_zh;
      translationCorrectFact = answerData.correctFact_zh;
    } else {
      // selectedLanguage === "zh"
      displayFact = answerData.fact_zh;
      displayCorrectFact = answerData.correctFact_zh;
      translationFact = answerData.fact; // English is the "other" language
      translationCorrectFact = answerData.correctFact; // English is the "other" language
    }

    let primaryCombinedText = "";
    if (displayFact) {
      primaryCombinedText = displayFact;
    }

    let translationCombinedText = "";
    if (translationFact) {
      translationCombinedText = translationFact;
    }

    if (answerData.correct && playerWasCorrect) {
      if (displayCorrectFact) {
        if (primaryCombinedText) primaryCombinedText += " "; // Add space if fact was present
        primaryCombinedText += displayCorrectFact;
      }
      if (translationCorrectFact) {
        if (translationCombinedText) translationCombinedText += " "; // Add space if translated fact was present
        translationCombinedText += translationCorrectFact;
      }
    }

    let fullFactString = `${optionLetter}: ${primaryCombinedText.trim()}`;
    if (translationCombinedText.trim()) {
      fullFactString += ` (${translationCombinedText.trim()})`;
    }

    const p = document.createElement("p");
    p.textContent = fullFactString;

    if (answerData.correct) {
      p.classList.add("correct-answer-fact-line");
    }
    factsContainer.appendChild(p);
  });
}

function proceedToNextQuestionOrWin() {
  // Stop any currently playing sound effect
  stopSoundEffect();
  if (factsContainer) {
    factsContainer.innerHTML = ""; // Clear facts before next question
    factsContainer.style.display = "none"; // Hide facts container
  }

  document.body.classList.remove("fanfare-correct"); // Remove fanfare visual

  // currentQuestionIndex is 0-based for the question just completed.
  // prizeMoney.length - 1 is the index of the last question (e.g., 14 for Q15).

  // If the question just completed is Q5 (index 4) up to Q14 (index 13)
  // These questions will play a specific "next question" sound.
  if (
    currentQuestionIndex >= 4 &&
    currentQuestionIndex < prizeMoney.length - 1
  ) {
    const questionNumberForSfx = currentQuestionIndex + 1; // Q5, Q6, ..., Q14
    const sfxKey = `SFX_NEXT_QUESTION_Q${questionNumberForSfx}`;

    playSoundEffect(sfxKey, () => {
      currentQuestionIndex++; // Move to the next question's index
      // This will show the next question (Q6 up to Q15)
      showQuestion();
    });
  } else {
    // This handles:
    // 1. Q1-Q4 completed (currentQuestionIndex 0-3): No specific "next question" sound.
    // 2. Q15 completed (currentQuestionIndex 14): Leads to winning the game.
    currentQuestionIndex++;
    if (currentQuestionIndex < prizeMoney.length) {
      showQuestion(); // For Q1-Q4 leading to Q2-Q5
    } else {
      winGame(); // For Q15 leading to win
    }
  }
}

function selectAnswer(e) {
  if (!gameActive) return;
  gameActive = false;

  const selectedButton = e.target.closest(".answer-btn");
  if (!selectedButton) {
    gameActive = true;
    return;
  }

  selectedButton.classList.add("selected");
  answerButtons.forEach((btn) => (btn.disabled = true));

  if (currentQuestionIndex >= 0 && currentQuestionIndex <= 4) {
    // Questions 1-5: Skip countdown, play correct sound/wrong after 1s delay
    setTimeout(() => {
      const isCorrect = selectedButton.dataset.correct === "true";
      selectedButton.classList.remove("selected"); // Remove general selection style

      if (isCorrect) {
        selectedButton.classList.add("correct");
        document.body.classList.add("fanfare-correct"); // Apply fanfare visual
        displayAnswerFacts(true);

        if (currentQuestionIndex === 4) {
          // Q5 (index 4) is correct
          stopBackgroundSound(); // Stop BGM_Q1_Q5 as Q5 is now resolved
          playSoundEffect("SFX_CORRECT_Q5"); // Use key from audioSettings.js
        } else {
          // Q1-Q4 (indices 0-3) are correct
          playSoundEffect("SFX_CORRECT_Q1_Q4"); // Use key from audioSettings.js
        }

        if (nextQuestionBtn) {
          nextQuestionBtn.style.display = "block";
        }
      } else {
        // Incorrect answer for Q1-Q5
        selectedButton.classList.add("incorrect");
        answerButtons.forEach((btn) => {
          if (btn.dataset.correct === "true") {
            btn.classList.add("correct");
          }
        });
        displayAnswerFacts(false);
        playSoundEffect("SFX_WRONG_ANSWER", () => {
          // Use key from audioSettings.js
          questionToRetryIndex = currentQuestionIndex;
          gameOver(false);
        });
      }
    }, 1000); // 1-second delay
  } else {
    // Questions 6 onwards: Existing logic with answerlocked.mp3 and countdown
    if (currentQuestionIndex >= 5 && currentQuestionIndex <= 14) {
      stopBackgroundSound();
    }

    const originalQuestionHTML = questionTextElement.innerHTML;
    let countdownValue = globalGameSettings.answerLockInCountdownStartValue;
    const tempCountdownText = document.createElement("p");
    tempCountdownText.style.fontWeight = "bold";
    tempCountdownText.style.marginTop = "10px";
    questionTextElement.appendChild(tempCountdownText);

    const updateCountdownDisplay = () => {
      if (selectedLanguage === "en") {
        tempCountdownText.textContent = `Revealing in ${countdownValue}...`;
      } else {
        tempCountdownText.textContent = `${countdownValue} 秒後揭曉...`;
      }
    };
    updateCountdownDisplay();

    // Play answer locked sound for Q6-Q15
    const answerLockedSoundKey = `SFX_ANSWER_LOCKED_Q${
      currentQuestionIndex + 1
    }`;
    playSoundEffect(answerLockedSoundKey); // Use dynamic key

    const countdownIntervalTimer = setInterval(() => {
      countdownValue--;
      if (countdownValue > 0) {
        updateCountdownDisplay();
      } else {
        clearInterval(countdownIntervalTimer);
        questionTextElement.innerHTML = originalQuestionHTML;

        const isCorrect = selectedButton.dataset.correct === "true";
        selectedButton.classList.remove("selected");

        if (isCorrect) {
          selectedButton.classList.add("correct");
          document.body.classList.add("fanfare-correct");
          displayAnswerFacts(true);

          if (nextQuestionBtn) {
            nextQuestionBtn.style.display = "block";
          }
          // Play correct answer sound for Q6-Q15
          const correctAnswerSoundKey = `SFX_CORRECT_Q${
            currentQuestionIndex + 1
          }`;
          playSoundEffect(correctAnswerSoundKey, () => {
            if (currentQuestionIndex === prizeMoney.length - 1) {
              // If it's the LAST question (index 14)
              winGame(); // Directly go to win sequence
            } else {
              // For Q6-Q14 (non-final questions in this block)
              if (nextQuestionBtn) {
                nextQuestionBtn.style.display = "block";
              }
            }
          }); // Use dynamic key
        } else {
          // Incorrect answer for Q6+
          playSoundEffect("SFX_WRONG_ANSWER"); // Use key from audioSettings.js
          selectedButton.classList.add("incorrect");
          answerButtons.forEach((btn) => {
            if (btn.dataset.correct === "true") {
              btn.classList.add("correct");
            }
          });
          displayAnswerFacts(false);
          questionToRetryIndex = currentQuestionIndex;
          setTimeout(
            () => gameOver(false),
            globalGameSettings.wrongAnswerToGameOverDelay
          );
        }
      }
    }, globalGameSettings.countdownTickInterval);
  }
}

function useFiftyFifty() {
  if (fiftyFiftyUsed || !gameActive) return;
  fiftyFiftyUsed = true;
  lifeline5050Button.disabled = true;
  // playSoundEffect("BGM_LIFELINE"); // Assuming BGM_LIFELINE is an SFX key, e.g., "SFX_LIFELINE_USED"

  const correctButton = Array.from(answerButtons).find(
    (btn) =>
      btn.dataset.correct === "true" &&
      !btn.classList.contains("hide-lifeline") &&
      btn.style.display !== "none"
  );

  const incorrectButtons = Array.from(answerButtons).filter(
    (btn) =>
      btn.dataset.correct === "false" &&
      !btn.classList.contains("hide-lifeline") &&
      btn.style.display !== "none"
  );

  incorrectButtons.sort(() => Math.random() - 0.5);

  let removedCount = 0;
  for (let i = 0; i < incorrectButtons.length && removedCount < 2; i++) {
    incorrectButtons[i].classList.add("hide-lifeline");
    removedCount++;
  }
}

function getGuaranteedPrize() {
  let guaranteedAmount = "NT$0"; // Default to NT$0
  // Ensure safeHavens is defined. If it's from gameSettings.js, it should be global or passed.
  // Assuming safeHavens is globally available like prizeMoney
  for (let i = safeHavens.length - 1; i >= 0; i--) {
    if (currentQuestionIndex > safeHavens[i]) {
      // Note: currentQuestionIndex is 0-based
      guaranteedAmount = prizeMoney[safeHavens[i]];
      break;
    }
  }
  return guaranteedAmount;
}

function gameOver(won = false) {
  gameActive = false;
  stopBackgroundSound();

  if (won) {
    // This case is typically handled by winGame(), which directly shows the result screen.
    // If gameOver(true) is ever called directly, it should behave like winGame().
    questionToRetryIndex = -1; // No retry if they won the game
    const topPrize = prizeMoney[prizeMoney.length - 1];
    // showResultScreen is in script.js and should be globally accessible
    if (typeof showResultScreen === "function") {
      showResultScreen(true, topPrize);
    } else {
      console.error(
        "showResultScreen function not found, cannot display win screen from gameOver."
      );
      // Fallback: directly manipulate if necessary, though showResultScreen is preferred
      if (resultScreen) resultScreen.classList.remove("hidden");
      // Set messages directly if showResultScreen is unavailable
    }
  } else {
    // Player answered incorrectly or game ended for other non-win reasons
    const guaranteedAmount = getGuaranteedPrize();
    questionToRetryIndex = currentQuestionIndex; // Keep for potential retry

    // showResultScreen is in script.js and should be globally accessible
    if (typeof showResultScreen === "function") {
      showResultScreen(false, guaranteedAmount);
    } else {
      console.error(
        "showResultScreen function not found, cannot display game over screen."
      );
      // Fallback: directly manipulate if necessary
      if (resultScreen) resultScreen.classList.remove("hidden");
      // Set messages directly if showResultScreen is unavailable
    }
  }
}

function gameOverWithError(message) {
  gameActive = false;
  stopBackgroundSound();
  if (selectedLanguage === "en") {
    resultMessage.textContent = "Game Error";
  } else {
    resultMessage.textContent = "遊戲錯誤";
  }
  resultPrize.textContent = message;
  resultScreen.classList.remove("hidden");
  answerButtons.forEach((btn) => (btn.disabled = true));
  if (lifeline5050Button) lifeline5050Button.disabled = true;
}

function winGame() {
  gameActive = false;
  if (typeof stopBackgroundSound === "function") stopBackgroundSound();
  document.body.classList.remove("fanfare-correct"); // Clean up previous fanfare if any

  const topPrize = prizeMoney[prizeMoney.length - 1];
  if (selectedLanguage === "en") {
    resultMessage.textContent = "Congratulations!";
    resultPrize.textContent = `You've won ${topPrize}!`;
  } else {
    resultMessage.textContent = "恭喜！";
    resultPrize.textContent = `你贏得了 ${topPrize}！`;
  }

  if (resultScreen) {
    // Ensure resultScreen element exists
    resultScreen.classList.remove("hidden");
  }

  currentQuestionIndex = prizeMoney.length - 1; // Ensure it's set to the last question index
  if (typeof updatePrizeHighlight === "function") updatePrizeHighlight(); // Highlights the final prize

  document.body.classList.add("game-won-glow"); // Add new full window glow
}

function initializeGame() {
  welcomeScreen.style.display = "none";
  gameContainer.classList.remove("hidden");
  if (factsContainer) {
    factsContainer.innerHTML = ""; // Clear facts on new game start
    factsContainer.style.display = "none"; // Hide facts container
  }
  if (nextQuestionBtn) nextQuestionBtn.style.display = "none";

  currentQuestionIndex = 0;
  fiftyFiftyUsed = false;
  if (lifeline5050Button) lifeline5050Button.disabled = false;
  resultScreen.classList.add("hidden");

  buildPrizeLadder();

  if (questionsSuccessfullyLoaded) {
    showQuestion();
  } else {
    console.error(
      "Attempted to initialize game, but questions were not loaded successfully for the selected language."
    );
    if (resultScreen.classList.contains("hidden")) {
      gameOverWithError(
        `Failed to load questions for ${selectedLanguage}. Please try refreshing.`
      );
    }
  }
}

// Cheat function to go to the next question
function cheatNextQuestion() {
  if (currentQuestionIndex < prizeMoney.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    console.log("Cheat: Already at the last question.");
    // Optionally, trigger win condition if at max question and cheating "up"
    // winGame();
  }
}

// Cheat function to go to the previous question
function cheatPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  } else {
    console.log("Cheat: Already at the first question.");
  }
}

// Cheat function to set up and execute a retry of the last failed question
function executeCheatRetry() {
  if (questionToRetryIndex !== -1) {
    currentQuestionIndex = questionToRetryIndex;
    // questionToRetryIndex = -1; // Reset after use, or let script.js hide the button
    showQuestion();
    return true; // Indicate retry was successful
  }
  return false; // No question to retry
}

function updatePrizeHighlight() {
  const prizeItems = prizeList.getElementsByTagName("li"); // This is an HTMLCollection

  // First, remove all existing .current and .next-prize-pulse classes from all prize items
  for (let i = 0; i < prizeItems.length; i++) {
    prizeItems[i].classList.remove("current", "next-prize-pulse");
  }

  // currentQuestionIndex is the 0-based index of the current question/prize level (0 for Q1, 14 for Q15).
  // Each li element in prizeItems has a 'data-level' attribute storing its 0-based prize level.

  for (let i = 0; i < prizeItems.length; i++) {
    const li = prizeItems[i];
    const itemLevel = parseInt(li.dataset.level);

    // Highlight the current prize level
    if (itemLevel === currentQuestionIndex) {
      li.classList.add("current");
    }

    // Highlight the next prize level to be pulsed (if it exists)
    // The "next prize" is the one for currentQuestionIndex + 1
    if (currentQuestionIndex < prizeMoney.length - 1) {
      // Ensure there is a next prize level
      if (itemLevel === currentQuestionIndex + 1) {
        li.classList.add("next-prize-pulse");
      }
    }
  }

  // Note: winGame() sets currentQuestionIndex to prizeMoney.length - 1 (the last valid index).
  // In this case, currentQuestionIndex + 1 would be prizeMoney.length, so the inner 'if' for
  // next-prize-pulse (itemLevel === currentQuestionIndex + 1) would not match any item,
  // which is correct as there's no "next" prize beyond the top one.
}
