export function createForestAudioController() {
  let audioContext = null;
  let forestGain = null;
  let forestNoiseSource = null;
  let forestToneTimer = null;

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
    if (forestToneTimer) {
      clearInterval(forestToneTimer);
      forestToneTimer = null;
    }

    if (forestNoiseSource) {
      try {
        forestNoiseSource.stop();
      } catch (error) {
        void error;
      }

      forestNoiseSource.disconnect();
      forestNoiseSource = null;
    }

    if (audioContext) {
      audioContext.close().catch(function () {
        return undefined;
      });
      audioContext = null;
      forestGain = null;
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
    const buffer = createNoiseBuffer(audioContext, 6);
    forestNoiseSource = audioContext.createBufferSource();
    forestNoiseSource.buffer = buffer;
    forestNoiseSource.loop = true;

    const filter = audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 480;

    const highpass = audioContext.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 90;

    forestGain = audioContext.createGain();
    forestGain.gain.value = 0.028;

    forestNoiseSource.connect(filter);
    filter.connect(highpass);
    highpass.connect(forestGain);
    forestGain.connect(audioContext.destination);
    forestNoiseSource.start();

    scheduleForestTones();
  }

  function scheduleForestTones() {
    if (!audioContext) {
      return;
    }

    forestToneTimer = setInterval(function () {
      if (!audioContext) {
        return;
      }

      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = "sine";
      osc.frequency.value = 180 + Math.random() * 80;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.012, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);

      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(now);
      osc.stop(now + 2.7);
    }, 9000);
  }

  function createNoiseBuffer(context, seconds) {
    const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
    const channel = buffer.getChannelData(0);

    for (let index = 0; index < channel.length; index += 1) {
      channel[index] = (Math.random() * 2 - 1) * 0.4;
    }

    return buffer;
  }
}
