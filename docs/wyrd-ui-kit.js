const MOON_SOURCE_COLOR = "#c9a14a";
let moonIconId = 0;

function createSvgNode(name, attributes = {}) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", name);

  Object.entries(attributes).forEach(([key, value]) => {
    node.setAttribute(key, value);
  });

  return node;
}

function createMoonCircle(attributes = {}) {
  return createSvgNode("circle", { cx: "9", cy: "9", r: "7", ...attributes });
}

function createMoonIcon(type) {
  const id = `kit-moon-clip-${moonIconId}`;
  moonIconId += 1;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "44");
  svg.setAttribute("height", "44");
  svg.setAttribute("viewBox", "0 0 18 18");
  svg.setAttribute("aria-hidden", "true");

  const defs = createSvgNode("defs");
  const clipPath = createSvgNode("clipPath", { id });
  clipPath.append(createSvgNode("circle", { cx: "9", cy: "9", r: "7" }));
  defs.append(clipPath);
  svg.append(defs);

  if (type === "fm") {
    svg.append(createMoonCircle({ fill: MOON_SOURCE_COLOR }));
    return svg;
  }

  if (type === "fq" || type === "lq") {
    const group = createSvgNode("g", { "clip-path": `url(#${id})` });
    group.append(
      createSvgNode("rect", {
        x: type === "fq" ? "9" : "2",
        y: "2",
        width: "7",
        height: "14",
        fill: MOON_SOURCE_COLOR,
      }),
    );
    group.append(
      createMoonCircle({ fill: "none", stroke: MOON_SOURCE_COLOR, "stroke-width": "0.9" }),
    );
    svg.append(group);
    return svg;
  }

  if (type === "wc" || type === "wac") {
    const group = createSvgNode("g", { "clip-path": `url(#${id})` });
    group.append(
      createSvgNode("ellipse", {
        cx: type === "wc" ? "12.2" : "5.8",
        cy: "9",
        rx: "5.4",
        ry: "7",
        fill: MOON_SOURCE_COLOR,
      }),
    );
    group.append(
      createMoonCircle({ fill: "none", stroke: MOON_SOURCE_COLOR, "stroke-width": "0.9" }),
    );
    svg.append(group);
    return svg;
  }

  if (type === "wg" || type === "wag") {
    const group = createSvgNode("g", { "clip-path": `url(#${id})` });
    group.append(createMoonCircle({ fill: MOON_SOURCE_COLOR }));
    group.append(
      createSvgNode("ellipse", {
        cx: type === "wg" ? "5.2" : "12.8",
        cy: "9",
        rx: "3.8",
        ry: "7",
        fill: "#12121c",
      }),
    );
    group.append(
      createMoonCircle({ fill: "none", stroke: MOON_SOURCE_COLOR, "stroke-width": "0.9" }),
    );
    svg.append(group);
    return svg;
  }

  svg.append(createMoonCircle({ fill: "none", stroke: MOON_SOURCE_COLOR, "stroke-width": "1.1" }));
  return svg;
}

(() => {
  const status = document.querySelector("[data-action-status]");
  const actionButtons = [...document.querySelectorAll(".wyrd-action-frame")];
  const actionSamples = [...document.querySelectorAll("[data-action-sample]")];
  const stateSelect = document.querySelector("[data-action-state]");
  const stateDescription = document.querySelector("[data-action-state-description]");
  const stateClasses = ["is-demo-hover", "is-demo-pressed", "is-demo-focus"];
  const stateCopy = {
    default: "Спокойный серебряный контур; геометрия и размер не меняются.",
    hover: "Контур, текст и ромб становятся яснее; внутри появляется тихий серебряный свет.",
    pressed: "Свет собирается внутрь, а вся кнопка опускается на 1 px за 140 ms — без bounce.",
    focus: "Серебряный силуэт и ромб читаются заметно яснее без прямоугольной focus-рамки.",
    disabled: "Силуэт сохраняется, но материал и текст становятся тише; действие недоступно.",
  };

  document.querySelectorAll("[data-moon-icon]").forEach((slot) => {
    const icon = createMoonIcon(slot.dataset.moonType);
    icon.classList.add("wyrd-moon-glyph");
    slot.replaceChildren(icon);
  });

  actionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (status) {
        status.textContent = `Проверено действие: ${button.textContent.trim()}`;
      }
    });
  });

  const coverInvitation = document.querySelector("[data-cover-invitation]");
  coverInvitation?.addEventListener("click", () => {
    if (status) {
      status.textContent = "Проверено приглашение: Войти в лес";
    }
  });

  if (coverInvitation && window.location.protocol !== "file:") {
    import("../assets/js/ui/cover-cta.js")
      .then(({ createCoverCtaAnimation }) => {
        createCoverCtaAnimation(coverInvitation);
      })
      .catch(() => {
        if (status) {
          status.textContent = "Статическая геометрия доступна; motion-модуль не загрузился.";
        }
      });
  }

  document.querySelectorAll("[data-action-family]").forEach((filter) => {
    filter.addEventListener("click", () => {
      const family = filter.dataset.actionFamily;

      document.querySelectorAll("[data-action-family]").forEach((candidate) => {
        candidate.setAttribute("aria-pressed", String(candidate === filter));
      });

      actionSamples.forEach((sample) => {
        sample.hidden = family !== "all" && sample.dataset.actionSample !== family;
      });
    });
  });

  stateSelect?.addEventListener("change", () => {
    const state = stateSelect.value;

    actionButtons.forEach((button) => {
      button.classList.remove(...stateClasses);
      button.disabled = state === "disabled";

      if (state === "hover") button.classList.add("is-demo-hover");
      if (state === "pressed") button.classList.add("is-demo-pressed");
      if (state === "focus") button.classList.add("is-demo-focus");
    });

    if (stateDescription) {
      stateDescription.textContent = stateCopy[state] ?? stateCopy.default;
    }
  });

  const shareAction = document.querySelector("[data-share-action]");
  shareAction?.addEventListener("click", () => {
    if (status) {
      status.textContent = "Карта подготовлена к отправке — размер кнопки не изменился.";
    }
  });

  const cardReveal = document.querySelector("[data-card-reveal]");
  const cardRevealTrigger = document.querySelector("[data-card-reveal-trigger]");
  const cardRevealStatus = document.querySelector("[data-card-reveal-status]");

  function setCardReveal(nextState) {
    if (!cardReveal) return;

    cardReveal.classList.toggle("is-revealed", nextState);
    cardReveal.setAttribute("aria-pressed", String(nextState));
    cardReveal.setAttribute(
      "aria-label",
      nextState ? "Скрыть карту «Искра Леса»" : "Раскрыть карту «Искра Леса»",
    );

    if (cardRevealTrigger) {
      cardRevealTrigger.textContent = nextState ? "Скрыть карту" : "Раскрыть карту";
    }

    if (cardRevealStatus) {
      cardRevealStatus.textContent = nextState
        ? "Карта раскрыта за 800 ms."
        : "Карта скрыта.";
    }
  }

  function toggleCardReveal() {
    setCardReveal(cardReveal?.getAttribute("aria-pressed") !== "true");
  }

  cardReveal?.addEventListener("click", toggleCardReveal);
  cardRevealTrigger?.addEventListener("click", toggleCardReveal);

  const resultRevealDemo = document.querySelector("[data-result-reveal-demo]");
  const resultRevealTrigger = document.querySelector("[data-result-reveal-trigger]");
  const resultRevealStatus = document.querySelector("[data-result-reveal-status]");
  const resultRevealMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let resultRevealTimer = 0;

  function replayResultReveal() {
    if (!resultRevealDemo) return;

    window.clearTimeout(resultRevealTimer);
    resultRevealDemo.classList.remove("is-playing");
    resultRevealDemo.classList.add("is-reset");
    void resultRevealDemo.offsetWidth;
    resultRevealDemo.classList.remove("is-reset");
    resultRevealDemo.classList.add("is-playing");

    if (resultRevealStatus) {
      resultRevealStatus.textContent = resultRevealMotion.matches
        ? "Reduced motion: финальное состояние показано сразу."
        : "Артефакт раскрывается; затем появляются Послание и Тень.";
    }

    resultRevealTimer = window.setTimeout(() => {
      if (resultRevealStatus) {
        resultRevealStatus.textContent = "Раскрытие завершено; сцена полностью неподвижна.";
      }
    }, resultRevealMotion.matches ? 80 : 1600);
  }

  resultRevealTrigger?.addEventListener("click", replayResultReveal);

  const questionInput = document.querySelector("[data-question-input]");
  const questionCount = document.querySelector("[data-question-count]");
  const questionStatus = document.querySelector("[data-question-status]");

  function updateQuestionField() {
    if (!questionInput) return;

    const currentLength = questionInput.value.length;
    const maximumLength = questionInput.maxLength;

    if (questionCount) {
      questionCount.textContent = `${currentLength} / ${maximumLength}`;
    }

    if (questionStatus) {
      questionStatus.textContent = currentLength
        ? "Вопрос сохранится до раскрытия карты."
        : "Можно оставить поле пустым — карта всё равно придёт.";
    }
  }

  questionInput?.addEventListener("input", updateQuestionField);
  updateQuestionField();

  const deckComposition = document.querySelector("[data-deck-composition]");
  const deckCompositionInput = document.querySelector("[data-deck-composition-input]");
  const deckCompositionCard = document.querySelector("[data-deck-composition-card]");
  const deckCompositionTouch = document.querySelector("[data-deck-composition-touch]");
  const deckCompositionStatus = document.querySelector("[data-deck-composition-status]");
  let deckCompositionTimer = 0;

  function syncDeckIntentDistance() {
    if (!deckCompositionInput || !deckCompositionCard) return;

    const field =
      deckCompositionInput.closest(".wyrd-question-field__shell") ?? deckCompositionInput;
    const fieldRect = field.getBoundingClientRect();
    const cardRect = deckCompositionCard.getBoundingClientRect();
    const distance = Math.max(16, Math.round(cardRect.top - fieldRect.bottom));

    deckCompositionCard.style.setProperty("--deck-intent-distance", `${distance}px`);
  }

  function replayDeckIntent() {
    if (!deckComposition || !deckCompositionCard) return;

    window.clearTimeout(deckCompositionTimer);
    syncDeckIntentDistance();
    deckComposition.classList.remove("is-intent-transferred");
    void deckComposition.offsetWidth;
    deckComposition.classList.add("is-intent-transferred");
    deckCompositionCard.focus({ preventScroll: true });

    if (deckCompositionStatus) {
      deckCompositionStatus.textContent =
        "Серебряная нить передала намерение колоде за 800 ms. Колода снова спокойна.";
    }

    deckCompositionTimer = window.setTimeout(() => {
      deckComposition.classList.remove("is-intent-transferred");
    }, 920);
  }

  deckCompositionInput?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey) return;

    event.preventDefault();
    deckCompositionInput.blur();
    replayDeckIntent();
  });
  deckCompositionCard?.addEventListener("click", replayDeckIntent);
  deckCompositionTouch?.addEventListener("click", replayDeckIntent);

  document.querySelectorAll(".kit-day-choice").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.closest("[data-exclusive-choice]") ?? button.parentElement;

      group?.querySelectorAll(".kit-day-choice").forEach((candidate) => {
        const isSelected = candidate === button;
        candidate.setAttribute("aria-pressed", String(isSelected));
        candidate.classList.toggle("is-selected", isSelected);
      });
    });
  });

  document.querySelectorAll("[data-kit-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const isOn = button.getAttribute("aria-checked") === "true";
      button.setAttribute("aria-checked", String(!isOn));
    });
  });

  const pageButtons = [...document.querySelectorAll("[data-page-index]")];
  const pagePrevious = document.querySelector("[data-page-previous]");
  const pageNext = document.querySelector("[data-page-next]");
  const pageCaption = document.querySelector("[data-page-caption]");
  let currentPage = 1;

  function setCurrentPage(nextPage) {
    currentPage = Math.min(5, Math.max(1, nextPage));

    pageButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.pageIndex) === currentPage));
    });

    if (pagePrevious) pagePrevious.disabled = currentPage === 1;
    if (pageNext) pageNext.disabled = currentPage === 5;
    if (pageCaption) pageCaption.textContent = `Глава ${currentPage} из 5`;
  }

  pageButtons.forEach((button) => {
    button.addEventListener("click", () => setCurrentPage(Number(button.dataset.pageIndex)));
  });
  pagePrevious?.addEventListener("click", () => setCurrentPage(currentPage - 1));
  pageNext?.addEventListener("click", () => setCurrentPage(currentPage + 1));

  document.querySelectorAll("[data-weekday]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-weekday]").forEach((candidate) => {
        candidate.setAttribute("aria-pressed", String(candidate === button));
      });
    });
  });

  const sheetOpen = document.querySelector("[data-sheet-open]");
  const sheet = document.querySelector("[data-kit-sheet]");
  const sheetBackdrop = document.querySelector("[data-sheet-backdrop]");
  const sheetClose = document.querySelector("[data-sheet-close]");
  let sheetReturnFocus = null;
  let sheetHideTimer = 0;
  let sheetTransitionHandler = null;
  let sheetScrollSnapshot = null;
  let sheetViewportCleanup = null;

  function sheetFocusableElements() {
    if (!sheet) return [];

    return [...sheet.querySelectorAll("button:not([disabled]), [href], textarea, input, select, [tabindex]:not([tabindex='-1'])")];
  }

  function openSheet() {
    if (!sheet || !sheetBackdrop) return;

    cancelSheetClose();
    sheetReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : sheetOpen;
    sheet.hidden = false;
    sheetBackdrop.hidden = false;
    lockKitScroll();
    attachKitViewportAdapter();
    document.body.classList.add("has-kit-sheet-open");

    window.requestAnimationFrame(() => {
      sheet.classList.add("is-open");
      sheetBackdrop.classList.add("is-open");
      sheetClose?.focus();
    });
  }

  function closeSheet() {
    if (!sheet || !sheetBackdrop || sheet.hidden) return;

    sheet.classList.remove("is-open");
    sheetBackdrop.classList.remove("is-open");

    const finishClose = () => {
      cancelSheetClose();
      sheet.hidden = true;
      sheetBackdrop.hidden = true;
      document.body.classList.remove("has-kit-sheet-open");
      detachKitViewportAdapter();
      unlockKitScroll();
      sheetReturnFocus?.focus({ preventScroll: true });
    };

    const transition = getLongestSheetTransition(sheet);
    if (transition.total <= 0) {
      sheetHideTimer = window.setTimeout(finishClose, 0);
      return;
    }

    sheetTransitionHandler = (event) => {
      if (
        event.target === sheet &&
        (transition.property === "all" || event.propertyName === transition.property)
      ) {
        finishClose();
      }
    };
    sheet.addEventListener("transitionend", sheetTransitionHandler);
    sheetHideTimer = window.setTimeout(finishClose, transition.total + 80);
  }

  function cancelSheetClose() {
    window.clearTimeout(sheetHideTimer);
    sheetHideTimer = 0;
    if (sheet && sheetTransitionHandler) {
      sheet.removeEventListener("transitionend", sheetTransitionHandler);
    }
    sheetTransitionHandler = null;
  }

  function getLongestSheetTransition(element) {
    const style = window.getComputedStyle(element);
    const properties = style.transitionProperty.split(",").map((value) => value.trim());
    const durations = style.transitionDuration.split(",").map(parseSheetTime);
    const delays = style.transitionDelay.split(",").map(parseSheetTime);
    const count = Math.max(properties.length, durations.length, delays.length);
    let longest = { property: "all", total: 0 };

    for (let index = 0; index < count; index += 1) {
      const property = properties[index % properties.length] || "all";
      const total = (durations[index % durations.length] || 0) + (delays[index % delays.length] || 0);
      if (property !== "none" && total > longest.total) {
        longest = { property, total };
      }
    }

    return longest;
  }

  function parseSheetTime(value) {
    const duration = Number.parseFloat(value) || 0;
    return value.trim().endsWith("ms") ? duration : duration * 1000;
  }

  function lockKitScroll() {
    if (sheetScrollSnapshot) return;

    const bodyStyle = document.body.style;
    const rootStyle = document.documentElement.style;
    const scrollX = window.scrollX || 0;
    const scrollY = window.scrollY || 0;
    const iosDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
    const useFixedBody = iosDevice && !standalone;
    const capture = (style, properties) =>
      properties.map((property) => ({
        property,
        value: style.getPropertyValue(property),
        priority: style.getPropertyPriority(property),
      }));

    sheetScrollSnapshot = {
      scrollX,
      scrollY,
      useFixedBody,
      body: capture(bodyStyle, ["position", "top", "left", "right", "width"]),
      root: capture(rootStyle, ["padding-right"]),
    };

    if (useFixedBody) {
      bodyStyle.setProperty("position", "fixed");
      bodyStyle.setProperty("top", `${-scrollY}px`);
      bodyStyle.setProperty("left", `${-scrollX}px`);
      bodyStyle.setProperty("right", "0");
      bodyStyle.setProperty("width", "100%");
      return;
    }

    const scrollbarGap = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    if (scrollbarGap > 0) {
      const padding = Number.parseFloat(window.getComputedStyle(document.documentElement).paddingRight) || 0;
      rootStyle.setProperty("padding-right", `${padding + scrollbarGap}px`);
    }
  }

  function unlockKitScroll() {
    const snapshot = sheetScrollSnapshot;
    if (!snapshot) return;

    const restore = (style, entries) => {
      entries.forEach(({ property, value, priority }) => {
        if (value) style.setProperty(property, value, priority);
        else style.removeProperty(property);
      });
    };
    restore(document.body.style, snapshot.body);
    restore(document.documentElement.style, snapshot.root);
    sheetScrollSnapshot = null;

    if (snapshot.useFixedBody) {
      window.requestAnimationFrame(() => window.scrollTo(snapshot.scrollX, snapshot.scrollY));
    }
  }

  function attachKitViewportAdapter() {
    if (!sheet || sheetViewportCleanup) return;

    const viewport = window.visualViewport;
    const update = () => {
      const viewportHeight = Math.max(1, Math.round(viewport?.height || window.innerHeight));
      const viewportTop = Math.max(0, Math.round(viewport?.offsetTop || 0));
      const occludedBottom = Math.max(0, Math.round(window.innerHeight - viewportHeight - viewportTop));
      const focused = document.activeElement;
      const keyboardInput = focused?.matches?.(
        "textarea, input:not([type='checkbox']):not([type='radio']):not([type='range']), [contenteditable]:not([contenteditable='false'])",
      );

      sheet.style.setProperty("--dialog-viewport-height", `${viewportHeight}px`);
      sheet.style.setProperty(
        "--dialog-viewport-bottom",
        `${keyboardInput && occludedBottom > 80 ? occludedBottom : 0}px`,
      );
    };
    const updateAfterFocus = () => window.requestAnimationFrame(update);

    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    sheet.addEventListener("focusin", updateAfterFocus);
    sheet.addEventListener("focusout", updateAfterFocus);
    window.addEventListener("resize", update);
    update();

    sheetViewportCleanup = () => {
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      sheet.removeEventListener("focusin", updateAfterFocus);
      sheet.removeEventListener("focusout", updateAfterFocus);
      window.removeEventListener("resize", update);
      sheet.style.removeProperty("--dialog-viewport-height");
      sheet.style.removeProperty("--dialog-viewport-bottom");
    };
  }

  function detachKitViewportAdapter() {
    sheetViewportCleanup?.();
    sheetViewportCleanup = null;
  }

  sheetOpen?.addEventListener("click", openSheet);
  sheetClose?.addEventListener("click", closeSheet);
  sheetBackdrop?.addEventListener("click", closeSheet);

  document.addEventListener("keydown", (event) => {
    if (!sheet || sheet.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeSheet();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = sheetFocusableElements();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const feedbackCopy = {
    loading: ["Лес слушает вопрос", "Тихий знак показывает, что ответ собирается."],
    success: ["След сохранён", "Короткая линия подтверждает действие и сразу успокаивается."],
    error: ["Туман скрыл дорогу", "Причина названа ясно. Можно попробовать снова, не теряя вопрос."],
    empty: ["Здесь пока тихо", "Пустое состояние объясняет следующий доступный шаг."],
  };
  const feedbackTitle = document.querySelector("[data-feedback-title]");
  const feedbackText = document.querySelector("[data-feedback-copy]");
  const feedbackPanel = document.querySelector("[data-feedback-panel]");

  document.querySelectorAll("[data-feedback-state]").forEach((button) => {
    button.addEventListener("click", () => {
      const state = button.dataset.feedbackState;
      const [title, copy] = feedbackCopy[state] ?? feedbackCopy.loading;

      document.querySelectorAll("[data-feedback-state]").forEach((candidate) => {
        candidate.setAttribute("aria-pressed", String(candidate === button));
      });
      if (feedbackTitle) feedbackTitle.textContent = title;
      if (feedbackText) feedbackText.textContent = copy;
      if (feedbackPanel) feedbackPanel.dataset.state = state;
    });
  });

  const motionStage = document.querySelector("[data-motion-stage]");
  const motionTitle = document.querySelector("[data-motion-title]");
  const motionStatus = document.querySelector("[data-motion-status]");
  const motionDescription = document.querySelector("[data-motion-description]");
  const reducedMotionToggle = document.querySelector("[data-motion-reduced]");
  const motionPlay = document.querySelector("[data-motion-play]");
  const motionScenarioButtons = [...document.querySelectorAll("[data-motion-preview]")];
  const systemReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motionScenarios = {
    breath: {
      duration: 800,
      label: "INVITATION / BREATH",
      title: "Свет приглашает, но не торопит",
      description:
        "Редкий серебряный импульс проходит по кромке и исчезает до следующего цикла.",
      complete: "Breath завершён; поверхность снова спокойна.",
    },
    reveal: {
      duration: 800,
      label: "RITUAL / REVEAL",
      title: "Знак выходит из темноты",
      description:
        "Редкое раскрытие длится 800 мс и объясняет переход от колоды к прочитанной карте.",
      complete: "Reveal завершён за 800 ms; карта остаётся полностью видимой.",
    },
    drift: {
      duration: 800,
      label: "AMBIENCE / DRIFT",
      title: "Живой слой почти неподвижен",
      description:
        "Смещение остаётся в пределах нескольких пикселей и не мешает чтению.",
      complete: "Drift завершён; карта вернулась в покой.",
    },
    success: {
      duration: 320,
      label: "FEEDBACK / SUCCESS",
      title: "Ответ подтверждён одним знаком",
      description:
        "Символ появляется один раз — без линии, конфетти и бесконечной петли.",
      complete: "Success завершён; сцена снова спокойна.",
    },
  };
  let selectedMotionScenario = "breath";
  let motionRun = 0;

  function usesReducedMotion() {
    return Boolean(
      reducedMotionToggle?.getAttribute("aria-pressed") === "true" ||
        systemReducedMotion.matches,
    );
  }

  function selectMotionScenario(scenario) {
    const config = motionScenarios[scenario] ?? motionScenarios.breath;
    selectedMotionScenario = scenario in motionScenarios ? scenario : "breath";
    motionRun += 1;

    motionScenarioButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.motionPreview === selectedMotionScenario));
    });

    motionStage?.classList.remove("is-playing");
    if (motionStage) motionStage.dataset.motionScenario = selectedMotionScenario;
    if (motionTitle) motionTitle.textContent = config.title;
    if (motionDescription) motionDescription.textContent = config.description;
    if (motionStatus) {
      motionStatus.textContent = usesReducedMotion()
        ? "Reduced motion включён: воспроизведение покажет статический смысл состояния"
        : `Готово к воспроизведению · ${config.duration} ms`;
    }
  }

  function playMotionScenario() {
    const config = motionScenarios[selectedMotionScenario];
    if (!motionStage || !config) return;

    motionRun += 1;
    const currentRun = motionRun;
    motionStage.classList.remove("is-playing");
    void motionStage.offsetWidth;

    motionStage.classList.add("is-playing");
    if (motionStatus) {
      motionStatus.textContent = usesReducedMotion()
        ? `Reduced motion · ${config.label}`
        : `${config.label} · ${config.duration} ms`;
    }

    window.setTimeout(() => {
      if (motionRun === currentRun) {
        motionStage.classList.remove("is-playing");
        if (motionStatus) motionStatus.textContent = config.complete;
      }
    }, usesReducedMotion() ? 120 : 920);
  }

  motionScenarioButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectMotionScenario(button.dataset.motionPreview);
      playMotionScenario();
    });
  });
  motionPlay?.addEventListener("click", playMotionScenario);
  reducedMotionToggle?.addEventListener("click", () => {
    const reduced = reducedMotionToggle.getAttribute("aria-pressed") !== "true";
    reducedMotionToggle.setAttribute("aria-pressed", String(reduced));
    reducedMotionToggle.textContent = `Reduced motion: ${reduced ? "on" : "off"}`;
    motionStage?.classList.toggle("is-reduced", reduced || systemReducedMotion.matches);
    if (motionStatus) {
      motionStatus.textContent = usesReducedMotion()
        ? "Reduced motion включён · следующий replay завершится без заметного движения"
        : `Готово к воспроизведению · ${motionScenarios[selectedMotionScenario].duration} ms`;
    }
  });
  systemReducedMotion.addEventListener?.("change", () => {
    motionStage?.classList.toggle("is-reduced", usesReducedMotion());
    selectMotionScenario(selectedMotionScenario);
  });
  motionStage?.classList.toggle("is-reduced", usesReducedMotion());
  selectMotionScenario(selectedMotionScenario);

  document.querySelectorAll(".section-nav--mobile a").forEach((link) => {
    link.addEventListener("click", () => {
      link.closest("details")?.removeAttribute("open");
    });
  });
})();
