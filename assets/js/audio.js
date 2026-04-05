const AMBIENCE_TRACK_URL = new URL("../audio/WYRD.m4a", import.meta.url).href;

export function createForestAudioController() {
  let ambienceAudio = null;
  let rustleContext = null;
  let ambienceVolume = 0.58;
  let shouldPlay = false;
  let unlockListenersBound = false;

  function sync(options = {}) {
    const { enabled, allowInit = false, ambienceVolume: nextAmbienceVolume } = options;

    if (typeof nextAmbienceVolume === "number") {
      ambienceVolume = clamp(nextAmbienceVolume, 0, 1);
      applyVolume();
    }

    shouldPlay = Boolean(enabled);

    if (!enabled) {
      pauseAmbience();
      return;
    }

    if (!allowInit && !ambienceAudio) {
      return;
    }

    ensureAmbienceAudio();
    applyVolume();
    attemptPlayback();
  }

  function stop() {
    shouldPlay = false;
    pauseAmbience();
    if (ambienceAudio) {
      ambienceAudio.currentTime = 0;
    }
  }

  function playRustle(enabled) {
    if (!enabled) {
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    rustleContext = rustleContext || new AudioContextClass();

    if (rustleContext.state === "suspended") {
      rustleContext.resume().catch(function () {
        return undefined;
      });
    }

    const duration = 0.42;
    const sampleRate = rustleContext.sampleRate;
    const buffer = rustleContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let index = 0; index < data.length; index += 1) {
      const fade = 1 - index / data.length;
      data[index] = (Math.random() * 2 - 1) * fade * 0.18;
    }

    const source = rustleContext.createBufferSource();
    const filter = rustleContext.createBiquadFilter();
    const gain = rustleContext.createGain();

    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.value = 1200;
    gain.gain.value = 0.095;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(rustleContext.destination);
    source.start();
  }

  return {
    playRustle,
    stop,
    sync,
  };

  function ensureAmbienceAudio() {
    if (ambienceAudio) {
      return;
    }

    ambienceAudio = new Audio();
    ambienceAudio.src = AMBIENCE_TRACK_URL;
    ambienceAudio.loop = true;
    ambienceAudio.preload = "auto";
    ambienceAudio.playsInline = true;
    ambienceAudio.setAttribute("playsinline", "");

    ambienceAudio.addEventListener("canplay", function () {
      if (shouldPlay && ambienceAudio.paused) {
        attemptPlayback();
      }
    });

    ambienceAudio.addEventListener("error", function () {
      ambienceAudio.load();
      if (shouldPlay) {
        bindUnlockListeners();
      }
    });

    ambienceAudio.load();
  }

  function attemptPlayback() {
    if (!ambienceAudio || !shouldPlay) {
      return;
    }

    const maybePromise = ambienceAudio.play();
    if (maybePromise && typeof maybePromise.catch === "function") {
      maybePromise
        .then(function () {
          unbindUnlockListeners();
        })
        .catch(function () {
          bindUnlockListeners();
          return undefined;
        });
      return;
    }

    unbindUnlockListeners();
  }

  function bindUnlockListeners() {
    if (unlockListenersBound) {
      return;
    }

    unlockListenersBound = true;
    document.addEventListener("pointerdown", handleUnlock, true);
    document.addEventListener("touchend", handleUnlock, true);
    document.addEventListener("click", handleUnlock, true);
    document.addEventListener("keydown", handleUnlock, true);
    document.addEventListener("visibilitychange", handleVisibilityChange, true);
  }

  function unbindUnlockListeners() {
    if (!unlockListenersBound) {
      return;
    }

    unlockListenersBound = false;
    document.removeEventListener("pointerdown", handleUnlock, true);
    document.removeEventListener("touchend", handleUnlock, true);
    document.removeEventListener("click", handleUnlock, true);
    document.removeEventListener("keydown", handleUnlock, true);
    document.removeEventListener("visibilitychange", handleVisibilityChange, true);
  }

  function handleUnlock() {
    if (!shouldPlay) {
      return;
    }

    attemptPlayback();
  }

  function handleVisibilityChange() {
    if (document.visibilityState === "visible" && shouldPlay) {
      attemptPlayback();
    }
  }

  function pauseAmbience() {
    if (!ambienceAudio) {
      return;
    }

    ambienceAudio.pause();
  }

  function applyVolume() {
    if (!ambienceAudio) {
      return;
    }

    ambienceAudio.volume = ambienceVolume;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
}
