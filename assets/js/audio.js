export function createForestAudioController() {
  let ambienceContext = null;
  let rustleContext = null;
  let masterGain = null;
  let windSource = null;
  let windGain = null;
  let droneSource = null;
  let droneGain = null;
  let phraseTimer = null;
  let birdTimer = null;
  let ambienceVolume = 0.58;
  let phraseIndex = 0;

  const PHRASES = [
    {
      root: 174.61,
      notes: [349.23, 392.0, 466.16, 523.25, 466.16, 392.0],
      harmonies: [174.61, 196.0, 233.08, 261.63, 233.08, 196.0],
      starts: [0.0, 0.95, 1.85, 3.0, 4.15, 5.15],
      lengths: [2.6, 2.15, 2.1, 2.35, 2.1, 2.9],
    },
    {
      root: 196.0,
      notes: [392.0, 466.16, 523.25, 587.33, 523.25, 440.0],
      harmonies: [196.0, 233.08, 261.63, 293.66, 261.63, 220.0],
      starts: [0.0, 0.85, 1.75, 2.85, 4.0, 5.0],
      lengths: [2.25, 2.15, 2.1, 2.35, 2.15, 2.85],
    },
    {
      root: 155.56,
      notes: [311.13, 349.23, 415.3, 466.16, 415.3, 349.23],
      harmonies: [155.56, 174.61, 207.65, 233.08, 207.65, 174.61],
      starts: [0.0, 1.0, 1.95, 3.1, 4.2, 5.25],
      lengths: [2.8, 2.2, 2.15, 2.35, 2.2, 3.0],
    },
  ];

  function sync(options = {}) {
    const { enabled, allowInit = false, ambienceVolume: nextAmbienceVolume } = options;

    if (typeof nextAmbienceVolume === "number") {
      ambienceVolume = clamp(nextAmbienceVolume, 0, 1);
      applyVolume();
    }

    if (!enabled) {
      stop();
      return;
    }

    if (!allowInit && !ambienceContext) {
      return;
    }

    if (!ambienceContext) {
      start();
      return;
    }

    if (ambienceContext.state === "suspended") {
      ambienceContext.resume().catch(function () {
        return undefined;
      });
    }

    applyVolume();
  }

  function stop() {
    if (phraseTimer) {
      clearInterval(phraseTimer);
      phraseTimer = null;
    }

    if (birdTimer) {
      clearInterval(birdTimer);
      birdTimer = null;
    }

    stopSource(windSource);
    stopSource(droneSource);
    windSource = null;
    droneSource = null;

    if (ambienceContext) {
      ambienceContext.close().catch(function () {
        return undefined;
      });
      ambienceContext = null;
      masterGain = null;
      windGain = null;
      droneGain = null;
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
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    ambienceContext = new AudioContextClass();
    masterGain = ambienceContext.createGain();
    masterGain.gain.value = 0.0001;
    masterGain.connect(ambienceContext.destination);

    startWindLayer();
    startDroneLayer();
    scheduleMelody();
    scheduleBirds();
    applyVolume();
  }

  function startWindLayer() {
    const buffer = createNoiseBuffer(ambienceContext, 7);
    windSource = ambienceContext.createBufferSource();
    windSource.buffer = buffer;
    windSource.loop = true;

    const lowpass = ambienceContext.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 620;

    const highpass = ambienceContext.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 120;

    windGain = ambienceContext.createGain();
    windGain.gain.value = 0.0001;

    windSource.connect(lowpass);
    lowpass.connect(highpass);
    highpass.connect(windGain);
    windGain.connect(masterGain);
    windSource.start();
  }

  function startDroneLayer() {
    droneSource = ambienceContext.createOscillator();
    droneSource.type = "sine";
    droneSource.frequency.value = 87.31;

    const filter = ambienceContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 180;

    droneGain = ambienceContext.createGain();
    droneGain.gain.value = 0.0001;

    droneSource.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(masterGain);
    droneSource.start();
  }

  function scheduleMelody() {
    playPhrase();

    phraseTimer = setInterval(function () {
      if (!ambienceContext) {
        return;
      }

      playPhrase();
    }, 9000);
  }

  function playPhrase() {
    const phrase = PHRASES[phraseIndex % PHRASES.length];
    const start = ambienceContext.currentTime + 0.15;

    playPhraseRoot(phrase.root, start, 7.8);

    for (let index = 0; index < phrase.notes.length; index += 1) {
      playVoice({
        frequency: phrase.notes[index],
        harmony: phrase.harmonies[index],
        start: start + phrase.starts[index],
        duration: phrase.lengths[index],
      });
    }

    phraseIndex += 1;
  }

  function playVoice({ frequency, harmony, start, duration }) {
    const main = ambienceContext.createOscillator();
    const airy = ambienceContext.createOscillator();
    const low = ambienceContext.createOscillator();
    const harmonyOsc = ambienceContext.createOscillator();
    const bell = ambienceContext.createOscillator();

    const mainGain = ambienceContext.createGain();
    const airyGain = ambienceContext.createGain();
    const bellGain = ambienceContext.createGain();
    const filter = ambienceContext.createBiquadFilter();

    main.type = "triangle";
    airy.type = "sine";
    low.type = "sine";
    harmonyOsc.type = "triangle";
    bell.type = "sine";

    main.frequency.value = frequency;
    airy.frequency.value = frequency * 2;
    low.frequency.value = frequency / 2;
    harmonyOsc.frequency.value = harmony;
    bell.frequency.value = frequency * 3.2;

    filter.type = "lowpass";
    filter.frequency.value = 1850;
    filter.Q.value = 0.4;

    mainGain.gain.setValueAtTime(0.0001, start);
    mainGain.gain.exponentialRampToValueAtTime(0.018, start + 0.5);
    mainGain.gain.exponentialRampToValueAtTime(0.0105, start + duration * 0.55);
    mainGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    airyGain.gain.setValueAtTime(0.0001, start);
    airyGain.gain.exponentialRampToValueAtTime(0.0036, start + 0.18);
    airyGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    bellGain.gain.setValueAtTime(0.0001, start);
    bellGain.gain.exponentialRampToValueAtTime(0.0028, start + 0.06);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.68);

    main.connect(filter);
    low.connect(filter);
    harmonyOsc.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(masterGain);

    airy.connect(airyGain);
    airyGain.connect(masterGain);

    bell.connect(bellGain);
    bellGain.connect(masterGain);

    main.start(start);
    airy.start(start);
    low.start(start);
    harmonyOsc.start(start);
    bell.start(start);

    main.stop(start + duration);
    airy.stop(start + duration);
    low.stop(start + duration);
    harmonyOsc.stop(start + duration);
    bell.stop(start + 0.72);
  }

  function playPhraseRoot(frequency, start, duration) {
    const osc = ambienceContext.createOscillator();
    const gain = ambienceContext.createGain();
    const filter = ambienceContext.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.value = frequency / 2;
    filter.type = "lowpass";
    filter.frequency.value = 250;

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.0055, start + 0.55);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    osc.start(start);
    osc.stop(start + duration);
  }

  function scheduleBirds() {
    birdTimer = setInterval(function () {
      if (!ambienceContext) {
        return;
      }

      if (Math.random() < 0.62) {
        playBirdCluster();
      }
    }, 6100);
  }

  function playBirdCluster() {
    const base = ambienceContext.currentTime + 0.1;
    const count = 2 + Math.floor(Math.random() * 2);

    for (let index = 0; index < count; index += 1) {
      const start = base + index * (0.15 + Math.random() * 0.08);
      const osc = ambienceContext.createOscillator();
      const gain = ambienceContext.createGain();
      const filter = ambienceContext.createBiquadFilter();
      const startFreq = 1500 + Math.random() * 700;
      const peakFreq = startFreq + 220 + Math.random() * 200;

      osc.type = "sine";
      osc.frequency.setValueAtTime(startFreq, start);
      osc.frequency.exponentialRampToValueAtTime(peakFreq, start + 0.07);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.96, start + 0.16);

      filter.type = "bandpass";
      filter.frequency.value = 2200;
      filter.Q.value = 1.2;

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.0032, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start(start);
      osc.stop(start + 0.18);
    }
  }

  function createNoiseBuffer(context, seconds) {
    const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
    const channel = buffer.getChannelData(0);

    for (let index = 0; index < channel.length; index += 1) {
      const white = Math.random() * 2 - 1;
      const shimmer = Math.sin(index / 1400) * 0.12;
      channel[index] = white * 0.18 + shimmer;
    }

    return buffer;
  }

  function applyVolume() {
    if (!ambienceContext || !masterGain) {
      return;
    }

    const now = ambienceContext.currentTime;
    const masterTarget = Math.max(0.12 * ambienceVolume, 0.0001);
    const windTarget = Math.max(0.055 * ambienceVolume, 0.0001);
    const droneTarget = Math.max(0.024 * ambienceVolume, 0.0001);

    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setTargetAtTime(masterTarget, now, 0.8);

    if (windGain) {
      windGain.gain.cancelScheduledValues(now);
      windGain.gain.setTargetAtTime(windTarget, now, 0.8);
    }

    if (droneGain) {
      droneGain.gain.cancelScheduledValues(now);
      droneGain.gain.setTargetAtTime(droneTarget, now, 0.8);
    }
  }

  function stopSource(source) {
    if (!source) {
      return;
    }

    try {
      source.stop();
    } catch (error) {
      void error;
    }

    source.disconnect();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
}
