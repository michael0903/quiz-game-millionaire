function playBackgroundSound(soundKey) {
  const soundFile = audioSettings[soundKey]; // Access directly using the key
  if (!soundFile) {
    console.error(`Sound key "${soundKey}" not found in audioSettings.`);
    return;
  }
  if (
    currentBackgroundSound === soundFile &&
    backgroundAudio &&
    backgroundAudio.src &&
    backgroundAudio.src.endsWith(soundFile) &&
    !backgroundAudio.paused
  ) {
    backgroundAudio.loop = true;
    return;
  }

  if (backgroundAudio && !backgroundAudio.paused) {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
  }

  if (sfxAudio && !sfxAudio.paused) {
    sfxAudio.pause();
    sfxAudio.currentTime = 0;
  }

  currentBackgroundSound = soundFile;

  if (backgroundAudio.src && backgroundAudio.src.endsWith(soundFile)) {
    backgroundAudio.loop = true;
    backgroundAudio.play().catch((e) => {
      console.error(`Error re-playing HTML background sound ${soundFile}:`, e);
    });
  } else {
    backgroundAudio.src = soundFile;
    backgroundAudio.loop = true;
    backgroundAudio.play().catch((e) => {
      console.error(`Error playing HTML background sound ${soundFile}:`, e);
      currentBackgroundSound = "";
    });
  }
}

function stopBackgroundSound() {
  if (backgroundAudio && !backgroundAudio.paused) {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
  }
  currentBackgroundSound = "";
}

function playSoundEffect(soundKey, onEndedCallback = null) {
  const soundFile = audioSettings[soundKey]; // Access directly using the key
  if (!soundFile) {
    console.error(`Sound key "${soundKey}" not found in audioSettings.`);
    if (typeof onEndedCallback === "function") {
      onEndedCallback();
    }
    return;
  }

  if (sfxAudio && !sfxAudio.paused) {
    sfxAudio.pause();
    sfxAudio.currentTime = 0;
  }
  sfxAudio.onended = null;

  sfxAudio.src = soundFile;
  sfxAudio.currentTime = 0;

  if (typeof onEndedCallback === "function") {
    sfxAudio.onended = onEndedCallback;
  }

  const playPromise = sfxAudio.play();
  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      console.error(`Error playing SFX ${soundFile}:`, error);
    });
  }
}

function stopSoundEffect() {
  if (sfxAudio && !sfxAudio.paused) {
    sfxAudio.pause();
    sfxAudio.currentTime = 0;
  }
  if (sfxAudio) {
    sfxAudio.onended = null;
  }
}
