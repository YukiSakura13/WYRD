import { createMoonIcon } from "../assets/js/ui/moon.js";

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

  document.querySelectorAll(".kit-day-choice").forEach((button) => {
    button.addEventListener("click", () => {
      const isSelected = button.getAttribute("aria-pressed") === "true";
      button.setAttribute("aria-pressed", String(!isSelected));
      button.classList.toggle("is-selected", !isSelected);
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

  const feedbackCopy = {
    loading: ["Лес слушает вопрос", "Тихий знак показывает, что ответ собирается."],
    success: ["След сохранён", "Карта добавлена в историю и не требует повторного действия."],
    error: ["Туман скрыл дорогу", "Попробуй ещё раз — вопрос и сохранённые данные не потеряны."],
    empty: ["Здесь пока тихо", "Когда появится первая карта, её след будет показан здесь."],
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
      duration: 320,
      title: "Breath · приглашение",
      description:
        "Breath мягко приглашает к одному главному действию и не превращается в постоянный декоративный цикл.",
      complete: "Breath завершён; поверхность снова спокойна.",
    },
    reveal: {
      duration: 800,
      title: "Reveal · ритуальное раскрытие",
      description:
        "Reveal применяется только к редкому появлению карты. Арт не масштабируется и сохраняет авторский цвет.",
      complete: "Reveal завершён за 800 ms; карта остаётся полностью видимой.",
    },
    drift: {
      duration: 320,
      title: "Drift · атмосфера",
      description:
        "Drift сдвигает только окружающие знаки на несколько пикселей и никогда не конкурирует с чтением карты.",
      complete: "Drift завершён; окружающие знаки вернулись в покой.",
    },
    success: {
      duration: 220,
      title: "Success · подтверждение",
      description:
        "Success один раз проявляет знак Оракула и линию, после чего движение останавливается.",
      complete: "Success подтверждён; знак остаётся видимым без дальнейшего движения.",
    },
  };
  let selectedMotionScenario = "breath";
  let motionRun = 0;

  function usesReducedMotion() {
    return Boolean(reducedMotionToggle?.checked || systemReducedMotion.matches);
  }

  function selectMotionScenario(scenario) {
    const config = motionScenarios[scenario] ?? motionScenarios.breath;
    selectedMotionScenario = scenario in motionScenarios ? scenario : "breath";
    motionRun += 1;

    motionScenarioButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.motionPreview === selectedMotionScenario));
    });

    motionStage?.classList.remove("is-playing", "is-reduced", "is-complete");
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
    motionStage.classList.remove("is-playing", "is-reduced", "is-complete");
    void motionStage.offsetWidth;

    if (usesReducedMotion()) {
      motionStage.classList.add("is-reduced");
      if (motionStatus) {
        motionStatus.textContent = `Reduced motion · ${config.title}: смысл показан контуром и статическим знаком`;
      }
      return;
    }

    motionStage.classList.add("is-playing");
    if (motionStatus) motionStatus.textContent = `${config.title} · ${config.duration} ms`;

    window.setTimeout(() => {
      if (motionRun === currentRun) {
        motionStage.classList.remove("is-playing");
        if (selectedMotionScenario === "success") motionStage.classList.add("is-complete");
        if (motionStatus) motionStatus.textContent = config.complete;
      }
    }, config.duration);
  }

  motionScenarioButtons.forEach((button) => {
    button.addEventListener("click", () => selectMotionScenario(button.dataset.motionPreview));
  });
  motionPlay?.addEventListener("click", playMotionScenario);
  reducedMotionToggle?.addEventListener("change", () => selectMotionScenario(selectedMotionScenario));
  systemReducedMotion.addEventListener?.("change", () => selectMotionScenario(selectedMotionScenario));
  selectMotionScenario(selectedMotionScenario);

  document.querySelectorAll(".section-nav--mobile a").forEach((link) => {
    link.addEventListener("click", () => {
      link.closest("details")?.removeAttribute("open");
    });
  });
})();
