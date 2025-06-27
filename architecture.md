# Quiz Game Architecture

This document outlines the architecture of the "Who Wants To Be A Millionaire?" quiz game project.

## 1. Core Components

The game is structured into several key JavaScript files, each handling distinct responsibilities:

- **`scripts/script.js` (Main Orchestrator / Entry Point)**

  - **Responsibilities:**
    - Initializing DOM element references and setting up global event listeners (e.g., language selection, restart button).
    - Managing screen transitions (welcome, game, result) including animations, messages, and associated sound effects (e.g., `SFX_LETS_PLAY`).
    - Handling language selection:
      - Storing the selected language.
      - Triggering the loading of appropriate question sets via `scripts/questions.js`.
      - Updating UI text elements based on the selected language.
    - Orchestrating game initialization by calling `initializeGame()` in `scripts/game.js` after language selection and successful question loading.
    - Managing the game restart process (`restartGame()`).
    - Handling global audio controls like mute and volume changes, interfacing with `scripts/audio.js`.
    - Playing and stopping specific background music for welcome/transition states.
  - **Interactions:** `scripts/ui.js` (for UI setup/reset), `scripts/game.js` (to start/initialize game logic), `scripts/audio.js` (for all sound playback), `scripts/questions.js` (to load questions), `scripts/gameSettings.js` (for timings), `scripts/audioSettings.js` (for sound keys), DOM.
  - **Rationale:** Acts as the central point for starting the game, managing high-level UI flow, and coordinating setup between different modules.

- **`scripts/game.js` (Game Logic Engine)**

  - **Responsibilities:**
    - Managing the core game state (current question index, lifeline usage, `gameActive` flag, current question object).
    - Initializing a new game (`initializeGame`): resets state, prepares for the first question.
    - Displaying questions (`showQuestion`):
      - Retrieving the current question data from the loaded set.
      - Shuffling answer options for the current question.
      - Triggering question-specific background music via `scripts/audio.js`.
      - Calling `scripts/ui.js` (`displayQuestion`) to render the question and its answers.
      - Updating the prize ladder highlight via `scripts/ui.js`.
    - Handling answer selection (`selectAnswer`):
      - Disabling further input.
      - Playing "answer locked" sound.
      - Determining correctness after a delay.
      - Triggering correct/wrong answer sound effects via `scripts/audio.js`.
      - Updating UI for selected, correct, and incorrect answers (partially direct class manipulation, partially via `scripts/ui.js`).
      - If correct and not the final question, revealing the "Next Question" button.
      - If correct and the final question, calling `winGame()`.
      - If incorrect, calling `gameOver()`.
    - Implementing lifeline logic (e.g., `useFiftyFifty`), including disabling the lifeline button and updating UI.
    - Determining game over (`gameOver`) and win conditions (`winGame`):
      - Setting `gameActive` to `false`.
      - Stopping background music.
      - Populating and displaying the result screen content (message and prize).
      - In `winGame`, applying special effects like the `game-won-glow` to the `body`.
    - Advancing to the next question (`proceedToNextQuestion`).
  - **Interactions:** `scripts/ui.js` (for rendering and UI updates), `scripts/audio.js` (for game-related sounds), `scripts/questions.js` (accesses `allQuestions`), `scripts/gameSettings.js` (for timings like answer lock delay), `scripts/audioSettings.js` (for sound keys), DOM (e.g., `document.body` for win glow, `nextQuestionBtn` visibility).
  - **Rationale:** Centralizes all rules, state management, and progression logic of the quiz gameplay itself.

- **`scripts/ui.js` (User Interface Manager)**

  - **Responsibilities:**
    - Dynamically building UI elements: prize ladder (`buildPrizeLadder`).
    - Displaying question text and answer options (`displayQuestion`) based on data from `scripts/game.js`.
    - Updating the visual highlight on the prize ladder (`updatePrizeHighlight`).
    - Resetting UI elements to a clean state: clearing answer button styles and text (`resetAnswerStyles`), clearing the question display area (`clearQuestionText`).
    - Managing logo animations on the welcome screen (`startLogoCycling`, `stopLogoCycling`).
  - **Interactions:** `scripts/game.js` (receives data for display, is called for updates/resets), `scripts/script.js` (for initial screen setup like prize ladder build, logo cycling), DOM.
  - **Rationale:** Encapsulates most direct DOM manipulation for game-specific UI rendering and state representation, separating presentation concerns.

- **`scripts/audio.js` (Audio Manager)**

  - **Responsibilities:**
    - Providing core functions for playing (`playSoundEffect`, `playBackgroundSound`) and stopping (`stopBackgroundSound`, `stopSoundEffect`) audio.
    - Managing the actual HTML `<audio>` element instances, including setting their `src`, `volume`, `loop`, and playback state.
    - Tracking the currently playing background sound to avoid overlaps or manage transitions.
  - **Interactions:** Called by `scripts/game.js` and `scripts/script.js` for all audio playback needs. Uses `scripts/audioSettings.js` to resolve sound keys to file paths.
  - **Rationale:** Centralizes all low-level audio operations, making it easier to manage sound playback and configuration.

- **`scripts/questions.js` (Question Data Provider)**

  - **Responsibilities:**
    - Asynchronously loading question data from language-specific global variables (e.g., `questions_en_data`, `questions_zh_data`) which are defined in `scripts/questions_en.js` and `scripts/questions_zh.js` respectively.
    - Structuring the loaded questions into the `allQuestions` object, categorized by language and difficulty level.
    - Shuffling the pool of questions for each difficulty level upon loading.
    - After successful loading, triggers `initializeGame()` from `scripts/game.js`.
  - **Interactions:** `scripts/script.js` (initiates question loading), `scripts/game.js` (consumes the `allQuestions` object), `scripts/questions_en.js` & `scripts/questions_zh.js` (reads data from their global variables).
  - **Rationale:** Decouples question content and loading logic from the main game flow, allowing for easier updates, management, and localization of questions.

- **`scripts/questions_en.js`, `scripts/questions_zh.js` (Question Data Files)**

  - **Responsibilities:** Storing the actual question text, an array of answer options (each with its text, correctness flag, and translation), and overall question translations. This data is exposed via global variables (e.g., `questions_en_data`).
  - **Interactions:** `scripts/questions.js` (reads the global data variables).
  - **Rationale:** Clear separation of question content by language, making it easy to edit or add new questions.

- **`scripts/gameSettings.js` (Game Configuration)**

  - **Responsibilities:** Storing global game settings and parameters, primarily timing-related constants for animations, delays, and UI transitions (e.g., `logoCycleInterval`, `getReadyMessageDisplayTime`, `correctAnswerFanfareDuration`).
  - **Interactions:** Used by `scripts/script.js`, `scripts/game.js`, and `scripts/ui.js` to control behavior and timing.
  - **Rationale:** Centralizes configurable game parameters, making them easy to adjust without deep code changes.

- **`scripts/audioSettings.js` (Audio Configuration)**

  - **Responsibilities:** Storing a mapping of descriptive sound event keys (e.g., `BGM_WELCOME`, `SFX_CORRECT_Q5`) to their actual sound file paths.
  - **Interactions:** `scripts/audio.js` (uses these mappings to play sounds), also referenced by `scripts/script.js` and `scripts/game.js` when they need to specify a sound key.
  - **Rationale:** Centralizes sound file definitions, making it easy to change sound files or themes.

- **`scripts/utils.js` (Utility Functions)**
  - **Responsibilities:** Providing common helper functions (e.g., `shuffleArray`) that can be used across multiple modules.
  - **Interactions:** Any module requiring generic utility functions (e.g., `scripts/questions.js`).
  - **Rationale:** Promotes code reuse and keeps common, non-specific logic in one place.

## 2. Key Interactions & Flow Examples

- **Game Initialization & Transition to Game:**

  1.  `scripts/script.js` (`window.onload`): Calls `initializeElements()` to get DOM references, `setupEventListeners()` for global listeners, and then `showWelcomeScreen()`.
  2.  `scripts/script.js` (`showWelcomeScreen`): Displays the welcome UI. Calls `scripts/ui.js` (`startLogoCycling`) for logo animation. Calls `playBackgroundSound("BGM_WELCOME")` (which uses `scripts/audio.js`).
  3.  User clicks a language selection button (e.g., "English").
  4.  `scripts/script.js` (`handleLanguageSelection`):
      - Sets the `selectedLanguage` variable.
      - Calls `scripts/ui.js` (`stopLogoCycling`) and `stopBackgroundSound()` (via `scripts/audio.js`).
      - Fades out the welcome screen.
      - Calls `scripts/ui.js` (`buildPrizeLadder`) to prepare the prize display.
      - Prepares the main game container for a fly-in animation (sets initial opacity to 0, adds `prepare-fly-in` class).
      - Shows the transition screen with a "Get ready..." message and plays the `SFX_LETS_PLAY` sound effect (via `scripts/audio.js`).
      - After a short delay, starts the game container's fly-in animation (adds `animate-fly-in` class).
      - Fades out the transition message, then fades out and hides the transition screen.
      - Calls `scripts/questions.js` (`loadQuestionsForLanguage`) to load and prepare questions for the selected language.
  5.  `scripts/questions.js` (`loadQuestionsForLanguage`): After successfully loading and processing questions, it calls `initializeGame()` in `scripts/game.js`.
  6.  `scripts/game.js` (`initializeGame`):
      - Resets game state variables (e.g., `currentQuestionIndex = 0`, `gameActive = true`, lifelines).
      - Calls `showQuestion()` to display the first question.
  7.  `scripts/game.js` (`showQuestion`):
      - Retrieves the current question data.
      - Plays the appropriate background music for the question's difficulty level (via `scripts/audio.js`).
      - Shuffles the answer options for the current question.
      - Calls `scripts/ui.js` (`displayQuestion`) to render the question text and answer buttons.
      - Calls `scripts/ui.js` (`updatePrizeHighlight`) to highlight the current prize level.

- **Answering a Question:**

  1.  User clicks an answer button (DOM event).
  2.  `scripts/game.js` (`selectAnswer`):
      - Sets the clicked button as "selected" (adds class, potentially starts pulsing animation via CSS).
      - Disables all answer buttons.
      - Plays an "answer locked" sound effect (e.g., `SFX_ANSWER_LOCKED_Q1`) via `scripts/audio.js`.
      - After a delay (defined in `scripts/gameSettings.js`), checks if the answer is correct.
  3.  `scripts/game.js` (Post-delay in `selectAnswer`):
      - **If correct:**
        - Applies "correct" styling/animation to the button.
        - Plays the appropriate "correct answer" sound effect (e.g., `SFX_CORRECT_Q5`) via `scripts/audio.js`.
        - If it's the final question (e.g., index 14 for 15 questions):
          - Calls `winGame()`.
        - Else (correct, but not the final question):
          - After the correct answer sound/fanfare finishes, makes the "Next Question" button visible.
      - **If incorrect:**
        - Applies "incorrect" styling/animation to the selected button.
        - Highlights the actual correct answer button.
        - Plays the "wrong answer" sound effect (`SFX_WRONG_ANSWER`) via `scripts/audio.js`.
        - Calls `gameOver()`.
  4.  `scripts/game.js` (`winGame` or `gameOver`):
      - Sets `gameActive = false`.
      - Stops the current background music (via `scripts/audio.js`).
      - Updates the `resultMessage` and `resultPrize` elements on the result screen with appropriate text.
      - Makes the result screen visible.
      - If `winGame()` was called: adds the `game-won-glow` class to `document.body` for the full-window glow effect.
  5.  `scripts/game.js` (or `scripts/ui.js` called from `game.js`): `updatePrizeHighlight()` is called to reflect the current standing.

- **Using a Lifeline (e.g., 50/50):**

  1.  User clicks the 50/50 lifeline button.
  2.  `scripts/game.js` (`useFiftyFifty`):
      - Checks if the lifeline is available and game is active.
      - Marks the lifeline as used and disables its button.
      - Plays a lifeline sound effect (e.g., `SFX_LIFELINE_5050`) via `scripts/audio.js`.
      - Identifies two incorrect answers to remove.
      - Adds a `hide-lifeline` class to these two answer buttons (UI update handled by CSS).

- **Restarting the Game:**
  1.  User clicks the "Play again?" button on the result screen.
  2.  `scripts/script.js` (`restartGame`):
      - Stops any currently playing sounds (via `scripts/audio.js`).
      - Removes any special body classes like `game-won-glow` or `fanfare-correct`.
      - Calls `scripts/ui.js` (`clearQuestionText` and `resetAnswerStyles`) to clear the question and answer areas.
      - Hides the main game container and resets its animation classes and opacity.
      - Hides the result screen.
      - Calls `showWelcomeScreen()`:
        - Makes the welcome screen visible again.
        - Restarts logo cycling (via `scripts/ui.js`).
        - Plays welcome background music (via `scripts/audio.js`).

## 3. Design Rationales

- **Separation of Concerns (SoC):** Each module/file has a well-defined responsibility. For example, `scripts/game.js` handles game logic, `scripts/ui.js` handles presentation, and `scripts/audio.js` handles sound. This makes the code easier to understand, test, and maintain.
- **Modularity:** Components are designed to be as independent as possible, interacting through clear interfaces (function calls).
- **Configuration-Driven:**
  - Game parameters (prize values, timers) are in `scripts/gameSettings.js`.
  - Sound file paths are in `scripts/audioSettings.js`.
  - This allows for easier tweaking and updates without modifying core logic.
- **Data-Driven Questions:** Question content is stored separately in `scripts/questions_xx.js` files, making it easy to add, remove, or modify questions and support multiple languages.
- **Maintainability:** The clear structure and separation of concerns aim to make it easier for developers to locate and modify specific parts of the game logic or UI.
- **Scalability (for features):** The modular design should make it easier to add new features (e.g., more lifelines, different game modes) in the future by adding or extending existing modules.
