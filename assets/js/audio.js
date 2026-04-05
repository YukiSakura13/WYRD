export function createForestAudioController() {
  let audioContext = null;
  let masterGain = null;
  let windGain = null;
  let windSource = null;
  let melodicTimer = null;
  let birdTimer = null;

  const MELODY_NOTES = [
    220,
    246.94,
    293.66,
    329.63,
    369.99,
    440,
    493.88,
    587.33,
  ];

  function sync(options = {}) {
    const { enabled, allowInit = false } = options;

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

    if (audioContext) {
      audioContext.close().catch(function () {
        return undefined;
      });
      audioContext = null;
      masterGain = null;
      windGain = null;
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
    gain.gain.value = 0.16;

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
    masterGain.gain.value = 0.34;
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
    windGain.gain.value = 0.018;

    windSource.connect(windLowpass);
    windLowpass.connect(windHighpass);
    windHighpass.connect(windGain);
    windGain.connect(masterGain);
    windSource.start();

    scheduleForestMelody();
    scheduleForestBirds();
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
    }, 7800);
  }

  function scheduleForestBirds() {
    if (!audioContext) {
      return;
    }

    birdTimer = setInterval(function () {
      if (!audioContext) {
        return;
      }

      if (Math.random() < 0.55) {
        playBirdCall();
      }
    }, 6200);
  }

  function playMelodicPhrase() {
    const start = audioContext.currentTime + 0.15;
    const phraseLength = 3 + Math.floor(Math.random() * 2);
    let cursor = start;

    for (let index = 0; index < phraseLength; index += 1) {
      const note = MELODY_NOTES[Math.floor(Math.random() * MELODY_NOTES.length)];
      const duration = 1.8 + Math.random() * 1.1;
      const gap = 0.55 + Math.random() * 0.45;
      playMistyNote(note, cursor, duration);
      cursor += gap;
    }
  }

  function playMistyNote(frequency, start, duration) {
    const carrier = audioContext.createOscillator();
    const shimmer = audioContext.createOscillator();
    const low = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    carrier.type = "triangle";
    carrier.frequency.value = frequency;
    shimmer.type = "sine";
    shimmer.frequency.value = frequency * 2;
    low.type = "sine";
    low.frequency.value = frequency / 2;

    filter.type = "lowpass";
    filter.frequency.value = 1400;
    filter.Q.value = 0.4;

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.022, start + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.011, start + duration * 0.62);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    carrier.connect(filter);
    shimmer.connect(filter);
    low.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    carrier.start(start);
    shimmer.start(start);
    low.start(start);
    carrier.stop(start + duration);
    shimmer.stop(start + duration);
    low.stop(start + duration);
  }

  function playBirdCall() {
    const now = audioContext.currentTime + 0.08;
    const chirpCount = 2 + Math.floor(Math.random() * 2);

    for (let index = 0; index < chirpCount; index += 1) {
      const start = now + index * (0.16 + Math.random() * 0.08);
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      const startFreq = 1100 + Math.random() * 700;
      const endFreq = startFreq + 260 + Math.random() * 220;

      osc.type = "sine";
      osc.frequency.setValueAtTime(startFreq, start);
      osc.frequency.exponentialRampToValueAtTime(endFreq, start + 0.11);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.92, start + 0.19);

      filter.type = "bandpass";
      filter.frequency.value = 1800;
      filter.Q.value = 1.4;

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.0055, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.19);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start(start);
      osc.stop(start + 0.21);
    }
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
}
