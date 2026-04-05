const AMBIENCE_SRC = "./assets/audio/forest-theme.m4a";

export function createForestAudioController() {
  let ambienceAudio = null;
  let rustleContext = null;
  let ambienceVolume = 0.58;

  function sync(options = {}) {
    const { enabled, allowInit = false, ambienceVolume: nextAmbienceVolume } = options;

    if (typeof nextAmbienceVolume === "number") {
      ambienceVolume = Math.max(0, Math.min(1, nextAmbienceVolume));
      applyAmbienceVolume();
    }

    if (!enabled) {
      stop();
      return;
    }

    if (!allowInit && !ambienceAudio) {
      return;
    }

    ensureAmbienceAudio();
    applyAmbienceVolume();
    resumeAmbience();
  }

  function stop() {
    if (ambienceAudio) {
      ambienceAudio.pause();
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
    gain.gain.value = 0.1;

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

    ambienceAudio = new Audio(AMBIENCE_SRC);
    ambienceAudio.loop = true;
    ambienceAudio.preload = "auto";
    ambienceAudio.playsInline = true;
    ambienceAudio.crossOrigin = "anonymous";
  }

  function applyAmbienceVolume() {
    if (!ambienceAudio) {
      return;
    }

    ambienceAudio.volume = 0.08 + ambienceVolume * 0.42;
  }

  function resumeAmbience() {
    if (!ambienceAudio) {
      return;
    }

    ambienceAudio
      .play()
      .catch(function () {
        return undefined;
      });
  }
}
