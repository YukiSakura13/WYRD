export function createForestAudioController() {
  let audioContext = null;
  let masterGain = null;
  let windGain = null;
  let windSource = null;
  let melodicTimer = null;
  let birdTimer = null;
  let droneOscillator = null;
  let droneGain = null;
  let ambienceVolume = 0.58;

  const MELODY_NOTES = [
    220,
    246.94,
    293.66,
    329.63,
    369.99,
    440,
    523.25,
    587.33,
  ];

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

    if (!allowInit && !audioContext) {
      return;
    }

    if (!audioContext) {
      startForestAudio();
      return;
    }

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(function () {
        return undefined;
      });
    }

    applyAmbienceVolume();
  }

  function stop() {
    if (melodicTimer) {
      clearInterval(melodicTimer);
      melodicTimer = null;
    }

    if (birdTimer) {
      clearInterval(birdTimer);
      birdTimer = null;
    }

    if (windSource) {
      try {
        windSource.stop();
      } catch (error) {
        void error;
      }

      windSource.disconnect();
      windSource = null;
    }

    if (droneOscillator) {
      try {
        droneOscillator.stop();
      } catch (error) {
        void error;
      }
      droneOscillator.disconnect();
      droneOscillator = null;
    }

    if (audioContext) {
      audioContext.close().catch(function () {
        return undefined;
      });
      audioContext = null;
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

    const context = audioContext || new AudioContextClass();
    const duration = 0.42;
    const sampleRate = context.sampleRate;
    const buffer = context.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let index = 0; index < data.length; index += 1) {
      const fade = 1 - index / data.length;
      data[index] = (Math.random() * 2 - 1) * fade * 0.18;
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.value = 1200;
    gain.gain.value = 0.11;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start();

    if (!audioContext) {
      source.onended = function () {
        context.close().catch(function () {
          return undefined;
        });
      };
    }
  }

  return {
    playRustle,
    stop,
    sync,
  };

  function startForestAudio() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.001;
    masterGain.connect(audioContext.destination);

    const buffer = createNoiseBuffer(audioContext, 8);
    windSource = audioContext.createBufferSource();
    windSource.buffer = buffer;
    windSource.loop = true;

    const windLowpass = audioContext.createBiquadFilter();
    windLowpass.type = "lowpass";
    windLowpass.frequency.value = 540;

    const windHighpass = audioContext.createBiquadFilter();
    windHighpass.type = "highpass";
    windHighpass.frequency.value = 130;

    windGain = audioContext.createGain();
    windGain.gain.value = 0.001;

    windSource.connect(windLowpass);
    windLowpass.connect(windHighpass);
    windHighpass.connect(windGain);
    windGain.connect(masterGain);
    windSource.start();

    startDrone();
    scheduleForestMelody();
    scheduleForestBirds();
    applyAmbienceVolume();
  }

  function scheduleForestMelody() {
    if (!audioContext) {
      return;
    }

    playMelodicPhrase();
    melodicTimer = setInterval(function () {
      if (!audioContext) {
        return;
      }

      playMelodicPhrase();
    }, 7200);
  }

  function scheduleForestBirds() {
    if (!audioContext) {
      return;
    }

    birdTimer = setInterval(function () {
      if (!audioContext) {
        return;
      }

      if (Math.random() < 0.68) {
        playBirdCall();
      }
    }, 5600);
  }

  function playMelodicPhrase() {
    const start = audioContext.currentTime + 0.15;
    const phraseLength = 4 + Math.floor(Math.random() * 2);
    let cursor = start;
    let previousIndex = Math.floor(Math.random() * MELODY_NOTES.length);

    for (let index = 0; index < phraseLength; index += 1) {
      const nextIndex = clampNoteIndex(previousIndex + randomStep());
      const note = MELODY_NOTES[nextIndex];
      const harmony = MELODY_NOTES[clampNoteIndex(nextIndex + 2)] / 2;
      const duration = 2 + Math.random() * 1.25;
      const gap = 0.72 + Math.random() * 0.52;
      playMistyNote(note, harmony, cursor, duration);
      cursor += gap;
      previousIndex = nextIndex;
    }
  }

  function playMistyNote(frequency, harmonyFrequency, start, duration) {
    const carrier = audioContext.createOscillator();
    const shimmer = audioContext.createOscillator();
    const low = audioContext.createOscillator();
    const harmony = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const shimmerGain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    carrier.type = "sine";
    carrier.frequency.value = frequency;
    shimmer.type = "sine";
    shimmer.frequency.value = frequency * 1.5;
    low.type = "sine";
    low.frequency.value = frequency / 2;
    harmony.type = "triangle";
    harmony.frequency.value = harmonyFrequency;

    filter.type = "lowpass";
    filter.frequency.value = 1700;
    filter.Q.value = 0.35;

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.018, start + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.0105, start + duration * 0.64);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    shimmerGain.gain.setValueAtTime(0.0001, start);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0045, start + 0.45);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    carrier.connect(filter);
    low.connect(filter);
    harmony.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    shimmer.connect(shimmerGain);
    shimmerGain.connect(masterGain);

    carrier.start(start);
    shimmer.start(start);
    low.start(start);
    harmony.start(start);
    carrier.stop(start + duration);
    shimmer.stop(start + duration);
    low.stop(start + duration);
    harmony.stop(start + duration);
  }

  function playBirdCall() {
    const now = audioContext.currentTime + 0.08;
    const chirpCount = 2 + Math.floor(Math.random() * 2);

    for (let index = 0; index < chirpCount; index += 1) {
      const start = now + index * (0.16 + Math.random() * 0.08);
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      const startFreq = 1450 + Math.random() * 900;
      const endFreq = startFreq + 220 + Math.random() * 240;

      osc.type = "sine";
      osc.frequency.setValueAtTime(startFreq, start);
      osc.frequency.exponentialRampToValueAtTime(endFreq, start + 0.08);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.95, start + 0.16);

      filter.type = "bandpass";
      filter.frequency.value = 2100;
      filter.Q.value = 1.25;

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.0038, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start(start);
      osc.stop(start + 0.18);
    }
  }

  function startDrone() {
    droneOscillator = audioContext.createOscillator();
    droneGain = audioContext.createGain();
    const droneFilter = audioContext.createBiquadFilter();

    droneOscillator.type = "sine";
    droneOscillator.frequency.value = 110;
    droneFilter.type = "lowpass";
    droneFilter.frequency.value = 220;
    droneGain.gain.value = 0.001;

    droneOscillator.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(masterGain);
    droneOscillator.start();
  }

  function createNoiseBuffer(context, seconds) {
    const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
    const channel = buffer.getChannelData(0);

    for (let index = 0; index < channel.length; index += 1) {
      const white = Math.random() * 2 - 1;
      const shaped = Math.sin(index / 1200) * 0.15;
      channel[index] = white * 0.22 + shaped;
    }

    return buffer;
  }

  function applyAmbienceVolume() {
    if (!masterGain) {
      return;
    }

    const now = audioContext.currentTime;
    const masterTarget = 0.16 * ambienceVolume;
    const windTarget = 0.06 * ambienceVolume;
    const droneTarget = 0.028 * ambienceVolume;

    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setTargetAtTime(Math.max(masterTarget, 0.0001), now, 0.8);

    if (windGain) {
      windGain.gain.cancelScheduledValues(now);
      windGain.gain.setTargetAtTime(Math.max(windTarget, 0.0001), now, 0.8);
    }

    if (droneGain) {
      droneGain.gain.cancelScheduledValues(now);
      droneGain.gain.setTargetAtTime(Math.max(droneTarget, 0.0001), now, 0.8);
    }
  }

  function randomStep() {
    const steps = [-2, -1, 1, 2];
    return steps[Math.floor(Math.random() * steps.length)];
  }

  function clampNoteIndex(index) {
    return Math.max(0, Math.min(MELODY_NOTES.length - 1, index));
  }
}
