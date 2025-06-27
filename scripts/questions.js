async function loadQuestionsForLanguage() {
  questionsSuccessfullyLoaded = false;
  try {
    let dataToUse;
    // Determine which preloaded data to use based on selectedLanguage
    if (selectedLanguage === "en") {
      // Use the pre-assembled questions_en_data object
      dataToUse =
        typeof questions_en_data !== "undefined" ? questions_en_data : null;
    } else if (selectedLanguage === "zh") {
      // Use the pre-assembled questions_zh_data object
      dataToUse =
        typeof questions_zh_data !== "undefined" ? questions_zh_data : null;
    } else {
      throw new Error(`Unsupported language: ${selectedLanguage}`);
    }

    if (!dataToUse) {
      throw new Error(
        `Main question data (questions_${selectedLanguage}_data) for language '${selectedLanguage}' not found. Ensure questions_${selectedLanguage}.js and its dependent level-specific files are loaded correctly before questions.js.`
      );
    }

    // Reset/initialize the language-specific part of allQuestions
    if (selectedLanguage === "en") {
      allQuestions.english = {
        level1: [],
        level2: [],
        level3: [],
        level4: [],
        level5: [],
        level6: [],
      };
    } else {
      // Assuming 'zh'
      allQuestions.traditionalChinese = {
        level1: [],
        level2: [],
        level3: [],
        level4: [],
        level5: [],
        level6: [],
      };
    }

    const targetLangQuestions =
      selectedLanguage === "en"
        ? allQuestions.english
        : allQuestions.traditionalChinese;
    const levels = ["level1", "level2", "level3", "level4", "level5", "level6"];

    levels.forEach((level) => {
      if (dataToUse[level] && Array.isArray(dataToUse[level])) {
        // Create a deep copy of questions and shuffle
        targetLangQuestions[level] = dataToUse[level].map((q) => ({ ...q }));
        shuffleArray(targetLangQuestions[level]);
      } else {
        targetLangQuestions[level] = [];
        console.warn(
          `${
            selectedLanguage === "en" ? "English" : "Traditional Chinese"
          } questions for ${level} missing or malformed in preloaded data. Initialized as empty.`
        );
      }
    });

    const currentLangPools = targetLangQuestions;

    const neededCounts = {
      level1: 3,
      level2: 3,
      level3: 3,
      level4: 3,
      level5: 2,
      level6: 1,
    };

    levels.forEach((level) => {
      if (currentLangPools[level].length < neededCounts[level]) {
        console.warn(
          `Warning: Only ${currentLangPools[level].length} ${level} questions available for ${selectedLanguage}, ${neededCounts[level]} needed for a full game.`
        );
      }
    });

    const hasSomeQuestions = levels.some(
      (level) => currentLangPools[level] && currentLangPools[level].length > 0
    );

    if (hasSomeQuestions) {
      questionsSuccessfullyLoaded = true;
      initializeGame(); // This should be called after questions are confirmed loaded
    } else {
      throw new Error(
        `No questions found for any level in the selected language: ${selectedLanguage}. Check preloaded data.`
      );
    }
  } catch (error) {
    console.error("Failed to load questions:", error);
    gameOverWithError(`Could not load game questions: ${error.message}`);
    questionsSuccessfullyLoaded = false;
  }
}
