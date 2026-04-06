const SCENE_LEVELS = {
  deck: 0.028,
  result: 0.034,
  spread: 0.038,
  paywall: 0.024,
  profile: 0.02,
};

export function createForestAudioController() {
  let audioContext = null;
  let forestMasterGain = null;
  let noiseSource = null;
  let ambienceTimers = [];

  function sync(options = {}) {
    const { enabled, allowInit = false, scene = "deck" } = options;

    if (!enabled) {
      stop();
      return;
    }

    if (!allowInit && !audioContext) {
      return;
    }

    if (!audioContext) {
      startForestAudio(scene);
      return;
    }

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(function () {
        return undefined;
      });
    }

    setSceneLevel(scene);
  }

  function stop() {
    ambienceTimers.forEach(function clearTimer(timerId) {
      clearTimeout(timerId);
    });
    ambienceTimers = [];

    if (noiseSource) {
      try {
        noiseSource.stop();
      } catch (error) {
        void error;
      }
      noiseSource.disconnect();
      noiseSource = null;
    }

    if (audioContext) {
      audioContext.close().catch(function () {
        return undefined;
      });
      audioContext = null;
      forestMasterGain = null;
    }
  }

  function playSelect(enabled) {
    if (!enabled) {
      return;
    }

    withContext(function (context) {
      const now = context.currentTime;
      const osc = context.createOscillator();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.11);

      filter.type = "lowpass";
      filter.frequency.value = 1200;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.028, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    });
  }

  function playRustle(enabled) {
    if (!enabled) {
      return;
    }

    withContext(function (context) {
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
      filter.frequency.value = 1350;
      gain.gain.value = 0.14;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      source.start();
    });
  }

  function playReveal(enabled, options = {}) {
    if (!enabled) {
      return;
    }

    const { bright = false } = options;
    withContext(function (context) {
      const now = context.currentTime;
      const shimmer = context.createOscillator();
      const body = context.createOscillator();
      const shimmerGain = context.createGain();
      const bodyGain = context.createGain();
      const shimmerFilter = context.createBiquadFilter();

      body.type = "sine";
      body.frequency.setValueAtTime(bright ? 210 : 176, now);
      body.frequency.exponentialRampToValueAtTime(bright ? 320 : 248, now + 0.42);

      bodyGain.gain.setValueAtTime(0.0001, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.024, now + 0.08);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

      shimmer.type = "triangle";
      shimmer.frequency.setValueAtTime(bright ? 880 : 720, now + 0.06);
      shimmer.frequency.exponentialRampToValueAtTime(bright ? 1180 : 980, now + 0.34);

      shimmerFilter.type = "highpass";
      shimmerFilter.frequency.value = 640;

      shimmerGain.gain.setValueAtTime(0.0001, now + 0.03);
      shimmerGain.gain.exponentialRampToValueAtTime(0.014, now + 0.12);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);

      body.connect(bodyGain);
      shimmer.connect(shimmerFilter);
      shimmerFilter.connect(shimmerGain);
      bodyGain.connect(context.destination);
      shimmerGain.connect(context.destination);

      body.start(now);
      shimmer.start(now + 0.03);
      body.stop(now + 0.82);
      shimmer.stop(now + 0.68);
    });
  }

  function playWhisper(enabled, phrase = "лес шепчет") {
    if (!enabled || !("speechSynthesis" in window)) {
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = "ru-RU";
      utterance.volume = 0.16;
      utterance.rate = 0.74;
      utterance.pitch = 0.62;
      const voices = window.speechSynthesis.getVoices();
      const russianVoice = voices.find(function findVoice(voice) {
        return voice.lang && voice.lang.toLowerCase().startsWith("ru");
      });
      if (russianVoice) {
        utterance.voice = russianVoice;
      }
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      void error;
    }
  }

  return {
    playReveal,
    playRustle,
    playSelect,
    playWhisper,
    stop,
    sync,
  };

  function startForestAudio(scene) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    audioContext = new AudioContextClass();

    const buffer = createNoiseBuffer(audioContext, 7);
    noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const lowpass = audioContext.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 520;

    const highpass = audioContext.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 90;

    forestMasterGain = audioContext.createGain();
    forestMasterGain.gain.value = 0.0001;

    noiseSource.connect(lowpass);
    lowpass.connect(highpass);
    highpass.connect(forestMasterGain);
    forestMasterGain.connect(audioContext.destination);
    noiseSource.start();

    setSceneLevel(scene);
    scheduleForestAccents();
  }

  function scheduleForestAccents() {
    scheduleBirdLoop();
    scheduleWindLoop();
  }

  function scheduleBirdLoop() {
    ambienceTimers.push(
      setTimeout(function loopBird() {
        if (!audioContext) {
          return;
        }

        playBirdCall();
        scheduleBirdLoop();
      }, 7200 + Math.random() * 3600),
    );
  }

  function scheduleWindLoop() {
    ambienceTimers.push(
      setTimeout(function loopWindTone() {
        if (!audioContext) {
          return;
        }

        playWindTone();
        scheduleWindLoop();
      }, 2600 + Math.random() * 2400),
    );
  }

  function setSceneLevel(scene) {
    if (!forestMasterGain || !audioContext) {
      return;
    }

    const now = audioContext.currentTime;
    const target = SCENE_LEVELS[scene] ?? SCENE_LEVELS.deck;
    forestMasterGain.gain.cancelScheduledValues(now);
    forestMasterGain.gain.setValueAtTime(Math.max(forestMasterGain.gain.value, 0.0001), now);
    forestMasterGain.gain.exponentialRampToValueAtTime(target, now + 0.8);
  }

  function playBirdCall() {
    if (!audioContext) {
      return;
    }

    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const pan = audioContext.createStereoPanner ? audioContext.createStereoPanner() : null;

    osc.type = "sine";
    osc.frequency.setValueAtTime(980 + Math.random() * 120, now);
    osc.frequency.exponentialRampToValueAtTime(1420 + Math.random() * 180, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(1120 + Math.random() * 80, now + 0.24);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.009, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

    osc.connect(gain);
    if (pan) {
      pan.pan.value = Math.random() * 0.8 - 0.4;
      gain.connect(pan);
      pan.connect(audioContext.destination);
    } else {
      gain.connect(audioContext.destination);
    }

    osc.start(now);
    osc.stop(now + 0.42);
  }

  function playWindTone() {
    if (!audioContext) {
      return;
    }

    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(168 + Math.random() * 36, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.008, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + 2.5);
  }

  function withContext(callback) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    const context = audioContext || new AudioContextClass();
    if (context.state === "suspended") {
      context.resume().catch(function () {
        return undefined;
      });
    }

    callback(context);

    if (!audioContext) {
      window.setTimeout(function closeContext() {
        context.close().catch(function () {
          return undefined;
        });
      }, 900);
    }
  }
}

function createNoiseBuffer(context, seconds) {
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let index = 0; index < channel.length; index += 1) {
    channel[index] = (Math.random() * 2 - 1) * 0.35;
  }

  return buffer;
}
