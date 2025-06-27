function cycleLogos() {
  if (!logoContainer || !logoEn || !logoCh) return;

  const enWasVisibleInitially = logoEn.classList.contains("visible-logo");

  // Add .spinning to trigger CSS animations.
  // The animations will run based on which image currently has .visible-logo or .hidden-logo
  logoContainer.classList.add("spinning");

  // This timeout is to remove the .spinning class and update logical classes
  // AFTER the CSS animation has completed.
  setTimeout(() => {
    logoContainer.classList.remove("spinning");

    // Now update the classes to reflect the new logical state.
    // The CSS animations with 'forwards' should have left the elements
    // in their visually correct post-spin state.
    if (enWasVisibleInitially) {
      // logoEn was visible, it spun to become hidden (handled by spin-logo-face)
      // logoCh was hidden, it spun to become visible (handled by spin-logo-back)
      logoEn.classList.remove("visible-logo");
      logoEn.classList.add("hidden-logo");
      logoCh.classList.remove("hidden-logo");
      logoCh.classList.add("visible-logo");
    } else {
      // logoCh was visible, it spun to become hidden
      // logoEn was hidden, it spun to become visible
      logoCh.classList.remove("visible-logo");
      logoCh.classList.add("hidden-logo");
      logoEn.classList.remove("hidden-logo");
      logoEn.classList.add("visible-logo");
    }
  }, globalGameSettings.logoSpinCompleteDelay); // This delay MUST match CSS animation duration
}

function startLogoCycling() {
  if (logoInterval) clearInterval(logoInterval);
  if (welcomeScreen.style.display !== "none") {
    cycleLogos();
    // ADJUSTABLE TIMING: Interval between automatic logo cycles on the welcome screen.
    // Currently 3000ms (3 seconds).
    logoInterval = setInterval(
      cycleLogos,
      globalGameSettings.logoCycleInterval
    ); // MODIFIED
  }
}

function stopLogoCycling() {
  clearInterval(logoInterval);
}

function buildPrizeLadder() {
  if (!prizeList) {
    // Add a check to ensure prizeList is available
    console.error("Error in buildPrizeLadder: prizeList element not found.");
    return;
  }
  prizeList.innerHTML = ""; // MODIFIED: Use prizeList instead of prizeListElement
  prizeMoney
    .slice()
    .reverse()
    .forEach((amount, index) => {
      const li = document.createElement("li");
      const levelIndex = prizeMoney.length - 1 - index;
      li.dataset.level = levelIndex;
      const levelNumSpan = document.createElement("span");
      levelNumSpan.textContent = `${levelIndex + 1}`;
      const amountSpan = document.createElement("span");
      amountSpan.textContent = amount;
      li.appendChild(levelNumSpan);
      li.appendChild(amountSpan);
      if (safeHavens.includes(levelIndex)) {
        li.classList.add("safe-haven");
      }
      prizeList.appendChild(li); // MODIFIED: Use prizeList instead of prizeListElement
    });
}

function updatePrizeHighlight() {
  if (!prizeList) {
    // Add a check
    console.error(
      "Error in updatePrizeHighlight: prizeList element not found."
    );
    return;
  }
  document.querySelectorAll("#prize-list li").forEach((li) => {
    // Assuming prizeList is the ul with id="prize-list"
    li.classList.remove("current");
    if (parseInt(li.dataset.level) === currentQuestionIndex) {
      li.classList.add("current");
    }
  });
}

function resetAnswerStyles() {
  answerButtons.forEach((button) => {
    button.classList.remove(
      "correct",
      "incorrect",
      "selected",
      "hide-lifeline",
      "revealed"
    );
    button.disabled = false;

    // Clear text content from answer buttons
    const optionPrefixSpan = button.querySelector(".option-prefix");
    const answerTextSpan = button.querySelector(".answer-text");
    const translationSpan = button.querySelector("span.translation");

    if (optionPrefixSpan) {
      optionPrefixSpan.textContent = "";
    }
    if (answerTextSpan) {
      answerTextSpan.textContent = "";
    }
    if (translationSpan) {
      // Remove the dynamically added translation span
      button.removeChild(translationSpan);
    }
  });
}

function clearQuestionText() {
  if (questionTextElement) {
    questionTextElement.innerHTML = ""; // Clear any previous question and translation
  }
}

function displayQuestion(question) {
  resetAnswerStyles();
  questionTextElement.textContent = question.question;
  answerButtons.forEach((button, index) => {
    const option = String.fromCharCode(65 + index); // A, B, C, D
    // Clear previous content
    button.innerHTML = "";

    // Create span for the option prefix (A:, B:, etc.)
    const optionPrefixSpan = document.createElement("span");
    optionPrefixSpan.classList.add("option-prefix");
    optionPrefixSpan.textContent = `${option}: `;

    // Create span for the answer text
    const answerTextSpan = document.createElement("span");
    answerTextSpan.classList.add("answer-text");
    answerTextSpan.textContent = question.options[option];

    // Append spans to the button
    button.appendChild(optionPrefixSpan);
    button.appendChild(answerTextSpan);

    button.dataset.option = option;
    // Stagger the appearance of answer buttons
    setTimeout(() => {
      button.classList.add("revealed");
    }, index * 150); // 150ms delay between each button
  });
  updatePrizeHighlight();
  playAudio("startRound"); // Or a specific question intro sound
}
