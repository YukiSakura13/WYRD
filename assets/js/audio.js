const AMBIENCE_TRACK = "./assets/audio/WYRD.m4a";

export function createForestAudioController() {
  let ambienceAudio = null;
  let rustleContext = null;
  let ambienceVolume = 0.58;

  function sync(options = {}) {
    const { enabled, allowInit = false, ambienceVolume: nextAmbienceVolume } = options;

    if (typeof nextAmbienceVolume === "number") {
      ambienceVolume = clamp(nextAmbienceVolume, 0, 1);
      applyVolume();
    }

    if (!enabled) {
      pauseAmbience();
      return;
    }

    if (!allowInit && !ambienceAudio) {
      return;
    }

    if (!ambienceAudio) {
      start();
      return;
    }

    applyVolume();
    playAmbience();
  }

  function stop() {
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

  function start() {
    if (!ambienceAudio) {
      ambienceAudio = new Audio(AMBIENCE_TRACK);
      ambienceAudio.loop = true;
      ambienceAudio.preload = "auto";
      ambienceAudio.playsInline = true;
    }

    applyVolume();
    playAmbience();
  }

  function playAmbience() {
    if (!ambienceAudio) {
      return;
    }

    const maybePromise = ambienceAudio.play();
    if (maybePromise && typeof maybePromise.catch === "function") {
      maybePromise.catch(function () {
        return undefined;
      });
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
