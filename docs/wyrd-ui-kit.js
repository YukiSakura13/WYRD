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
    success: ["Ответ собран", "Карта готова и может быть прочитана или сохранена."],
    error: ["Лес не смог ответить", "Попробуй ещё раз — вопрос и сохранённые данные не потеряны."],
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

  const motionMark = document.querySelector("[data-motion-mark]");
  const motionStatus = document.querySelector("[data-motion-status]");
  const reducedMotionToggle = document.querySelector("[data-motion-reduced]");
  const motionClasses = [
    "is-motion-feedback",
    "is-motion-control",
    "is-motion-surface",
    "is-motion-ritual",
  ];
  const motionDurations = {
    feedback: 140,
    control: 220,
    surface: 320,
    ritual: 800,
  };

  document.querySelectorAll("[data-motion-preview]").forEach((button) => {
    button.addEventListener("click", () => {
      const scenario = button.dataset.motionPreview;
      const duration = motionDurations[scenario] ?? 220;
      const reduced = reducedMotionToggle?.checked;

      motionMark?.classList.remove(...motionClasses);

      if (reduced) {
        if (motionStatus) motionStatus.textContent = `Reduced motion: ${scenario} показан без движения`;
        return;
      }

      requestAnimationFrame(() => {
        motionMark?.classList.add(`is-motion-${scenario}`);
      });
      if (motionStatus) motionStatus.textContent = `${scenario} · ${duration} ms`;
    });
  });

  document.querySelectorAll(".section-nav--mobile a").forEach((link) => {
    link.addEventListener("click", () => {
      link.closest("details")?.removeAttribute("open");
    });
  });
})();
