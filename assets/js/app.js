(function () {
  const CARDS = Array.isArray(window.WYRD_CARDS) ? window.WYRD_CARDS : [];
  const STORAGE_KEY = "wyrd-local-state-v2";
  const defaultState = {
    profileName: "Странник",
    soundEnabled: true,
    dailyFreeUsedAt: null,
    history: [],
    currentReading: null,
    lastSpread: [],
  };

  const paywallCopy = {
    "extra-draw": {
      title: "Ещё одна карта",
      text: "Бесплатная карта на сегодня уже раскрыта. Если хочешь услышать лес снова, открой ещё один ритуал.",
      cta: "Открыть ещё карту",
    },
    "deep-reading": {
      title: "Углубить значение",
      text: "Тень уже сказала своё. Теперь можно спуститься глубже и услышать второй слой послания.",
      cta: "Открыть глубину",
    },
    "spread-3": {
      title: "Расклад на 3 карты",
      text: "Тройной узор покажет прошлое, настоящее и направление следующего шага.",
      cta: "Открыть расклад",
    },
    "spread-5": {
      title: "Расклад на 5 карт",
      text: "Пятикарточный расклад раскроет более глубокий узор и покажет скрытые связи.",
      cta: "Открыть расклад",
    },
  };

  let state = loadState();
  let currentOffer = null;
  let ritualTimer = null;
  let ritualMode = "free";
  let audioContext = null;
  let forestGain = null;
  let forestNoiseSource = null;
  let forestToneTimer = null;

  const cover = document.getElementById("cover");
  const main = document.getElementById("main");
  const ritualSection = document.getElementById("ritual");
  const resultSection = document.getElementById("result");
  const spreadResultSection = document.getElementById("spread-result");
  const paywallSection = document.getElementById("paywall");
  const profileSection = document.getElementById("profile");
  const deckTop = document.querySelector(".dc-top");
  const ritualCountdown = document.getElementById("ritual-countdown");
  const soundButton = document.querySelector('[data-action="toggle-sound"]');
  const profileName = document.getElementById("profile-name");
  const profileMeta = document.getElementById("profile-meta");
  const historyList = document.getElementById("history-list");
  const spreadGrid = document.getElementById("spread-grid");
  const spreadTitle = document.getElementById("spread-title");
  const paywallTitle = document.getElementById("paywall-title");
  const paywallCopyNode = document.getElementById("paywall-copy");
  const paywallCta = document.getElementById("paywall-cta");
  const deepWrap = document.getElementById("deep-wrap");
  const deepMessage = document.getElementById("deep-message");

  document.addEventListener("click", onClick);
  paywallCta.addEventListener("click", onPaywallConfirm);
  render();
  registerServiceWorker();

  function onClick(event) {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) {
      return;
    }

    const action = trigger.dataset.action;

    if (action === "enter") {
      enter();
      return;
    }

    if (action === "toggle-sound") {
      state.soundEnabled = !state.soundEnabled;
      syncForestAudio();
      persist();
      render();
      return;
    }

    if (action === "draw") {
      if (hasFreeDraw()) {
        startRitual("free");
      } else {
        openPaywall("extra-draw");
      }
      return;
    }

    if (action === "extra-draw" || action === "deep-reading" || action === "spread-3" || action === "spread-5") {
      openPaywall(action);
      return;
    }

    if (action === "open-profile") {
      closeTransient();
      profileSection.hidden = false;
      profileSection.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (action === "close-profile") {
      profileSection.hidden = true;
      if (state.lastSpread.length) {
        spreadResultSection.hidden = false;
      } else if (state.currentReading) {
        resultSection.hidden = false;
      }
      return;
    }

    if (action === "reset-local") {
      resetLocalState();
    }
  }

  function enter() {
    cover.classList.add("gone");
    setTimeout(function () {
      main.classList.add("on");
    }, 350);
    syncForestAudio(true);
  }

  function render() {
    ensureDayBoundary();
    soundButton.textContent = state.soundEnabled ? "Звук леса: вкл" : "Звук леса: выкл";
    profileName.textContent = state.profileName;
    profileMeta.textContent = hasFreeDraw()
      ? "Бесплатная карта ещё не раскрыта."
      : "Сегодняшняя бесплатная карта уже раскрыта.";

    renderCurrentReading();
    renderSpread();
    renderHistory();
  }

  function renderCurrentReading() {
    const reading = state.currentReading;
    if (!reading) {
      resultSection.hidden = true;
      return;
    }

    document.getElementById("card-image").src = reading.card.image;
    document.getElementById("card-image").alt = reading.card.name;
    document.getElementById("card-keyword").textContent = `✦ ${reading.card.keyword} ✦`;
    document.getElementById("card-name").textContent = reading.card.name;
    document.getElementById("card-subtitle").textContent = reading.card.subtitle;
    document.getElementById("card-message").textContent = `« ${reading.card.message} »`;
    document.getElementById("card-shadow").textContent = reading.card.shadow;

    if (reading.depthUnlocked) {
      deepWrap.hidden = false;
      deepMessage.textContent =
        `Этот знак просит не ответа, а внутренней тишины. Вернись к нему вечером и проверь, где в течение дня уже проявился образ "${reading.card.name}".`;
    } else {
      deepWrap.hidden = true;
    }
  }

  function renderSpread() {
    if (!state.lastSpread.length) {
      spreadResultSection.hidden = true;
      spreadGrid.innerHTML = "";
      return;
    }

    spreadResultSection.hidden = false;
    spreadTitle.textContent = `Расклад на ${state.lastSpread.length} карт`;
    spreadGrid.innerHTML = "";

    state.lastSpread.forEach(function (card) {
      const item = document.createElement("article");
      item.className = "spread-card";
      item.innerHTML = `
        <img src="${card.image}" alt="${escapeHtml(card.name)}" />
        <h3>${escapeHtml(card.name)}</h3>
        <p class="card-en">${escapeHtml(card.subtitle)}</p>
        <p>${escapeHtml(card.message)}</p>
      `;
      spreadGrid.appendChild(item);
    });
  }

  function renderHistory() {
    historyList.innerHTML = "";

    if (!state.history.length) {
      historyList.innerHTML = '<p class="history-empty">История пока молчит.</p>';
      return;
    }

    state.history.forEach(function (reading) {
      const item = document.createElement("article");
      item.className = "history-item";
      item.innerHTML = `
        <img src="${reading.card.image}" alt="${escapeHtml(reading.card.name)}" />
        <div>
          <p class="lbl">${escapeHtml(reading.card.keyword)}</p>
          <h3>${escapeHtml(reading.card.name)}</h3>
          <p>${escapeHtml(reading.card.message)}</p>
        </div>
      `;
      historyList.appendChild(item);
    });
  }

  function startRitual(mode) {
    ritualMode = mode;
    closeTransient();
    ritualSection.hidden = false;
    ritualCountdown.textContent = "3";

    clearInterval(ritualTimer);
    let value = 3;
    ritualTimer = setInterval(function () {
      value -= 1;
      ritualCountdown.textContent = String(Math.max(value, 0));

      if (value <= 0) {
        clearInterval(ritualTimer);
        resolveRitual();
      }
    }, 1000);
  }

  function resolveRitual() {
    ritualSection.hidden = true;
    playRustle();

    if (ritualMode === "free") {
      state.dailyFreeUsedAt = new Date().toISOString();
      revealCard(true);
      return;
    }

    if (ritualMode === "extra-draw") {
      revealCard(false);
      return;
    }

    if (ritualMode === "deep-reading") {
      if (state.currentReading) {
        state.currentReading.depthUnlocked = true;
        const latest = state.history.find(function (item) {
          return item.id === state.currentReading.id;
        });
        if (latest) {
          latest.depthUnlocked = true;
        }
        persist();
        render();
        resultSection.hidden = false;
      }
      return;
    }

    if (ritualMode === "spread-3" || ritualMode === "spread-5") {
      const count = ritualMode === "spread-3" ? 3 : 5;
      state.lastSpread = pickRandomCards(count);
      state.currentReading = null;
      persist();
      render();
      spreadResultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function revealCard(isFree) {
    const card = pickRandomCards(1)[0];
    const reading = {
      id: `${card.id}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      free: isFree,
      depthUnlocked: false,
      card: card,
    };

    state.currentReading = reading;
    state.lastSpread = [];
    state.history.unshift(reading);
    persist();
    render();
    animateDeck();
    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openPaywall(type) {
    currentOffer = type;
    closeTransient();
    paywallTitle.textContent = paywallCopy[type].title;
    paywallCopyNode.textContent = paywallCopy[type].text;
    paywallCta.textContent = paywallCopy[type].cta;
    paywallSection.hidden = false;
    paywallSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onPaywallConfirm() {
    if (!currentOffer) {
      return;
    }
    startRitual(currentOffer);
  }

  function animateDeck() {
    deckTop.style.transition = "all .5s ease";
    deckTop.style.transform = "translateY(-50px) rotate(12deg)";
    deckTop.style.opacity = "0";
    setTimeout(function () {
      deckTop.style.transform = "";
      deckTop.style.opacity = "1";
    }, 800);
  }

  function closeTransient() {
    ritualSection.hidden = true;
    paywallSection.hidden = true;
    profileSection.hidden = true;
    resultSection.hidden = state.currentReading ? false : true;
    spreadResultSection.hidden = state.lastSpread.length ? false : true;
  }

  function hasFreeDraw() {
    ensureDayBoundary();
    return !state.dailyFreeUsedAt;
  }

  function ensureDayBoundary() {
    if (!state.dailyFreeUsedAt) {
      return;
    }

    const usedAt = new Date(state.dailyFreeUsedAt);
    const now = new Date();

    if (usedAt.toDateString() !== now.toDateString()) {
      state.dailyFreeUsedAt = null;
      persist();
    }
  }

  function pickRandomCards(count) {
    return shuffle(CARDS.slice()).slice(0, count);
  }

  function shuffle(items) {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      const current = items[index];
      items[index] = items[swapIndex];
      items[swapIndex] = current;
    }

    return items;
  }

  function syncForestAudio(allowInit) {
    if (!state.soundEnabled) {
      stopForestAudio();
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

  function stopForestAudio() {
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

  function scheduleForestTones() {
    if (!audioContext) {
      return;
    }

    forestToneTimer = setInterval(function () {
      if (!audioContext || !state.soundEnabled) {
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

  function playRustle() {
    if (!state.soundEnabled) {
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
        context.close();
      };
    }
  }

  function resetLocalState() {
    clearInterval(ritualTimer);
    stopForestAudio();
    state = clone(defaultState);
    persist();
    resultSection.hidden = true;
    spreadResultSection.hidden = true;
    paywallSection.hidden = true;
    profileSection.hidden = true;
    cover.classList.remove("gone");
    main.classList.remove("on");
    render();
  }

  function loadState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return clone(defaultState);
      }

      return Object.assign(clone(defaultState), JSON.parse(raw));
    } catch (error) {
      return clone(defaultState);
    }
  }

  function persist() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || window.location.protocol === "file:") {
      return;
    }

    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {
        return undefined;
      });
    });
  }
})();
