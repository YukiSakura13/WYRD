# WYRD Release Checklist

## Зачем нужен этот документ

Этот checklist фиксирует минимальный набор проверок перед публикацией изменений в `main` и после обновления GitHub Pages.

Он нужен, чтобы:

- не пропускать регрессии после рефакторинга;
- не ломать публикацию на Pages;
- не возвращаться к проблеме "на GitHub уже новое, а на сайте всё ещё старое".

## Локальные quality gates

Перед push нужно пройти:

1. `node scripts/smoke-domain.mjs`
2. `node scripts/smoke-state.mjs`
3. `node scripts/smoke-ui-interactions.mjs`
4. `python3 scripts/validate_control_language.py`
5. `python3 scripts/validate_product_scope.py`
6. `python3 scripts/validate_lore_canon.py`
7. `python3 scripts/validate_responsive_strategy.py`
8. `python3 scripts/prepare_pages.py`
9. `python3 scripts/validate_pages_artifact.py`

Если затронут UI, стили, изображения или service worker, дополнительно полезно:

10. `python3 -m http.server 4173`
11. Открыть локально `http://localhost:4173`
12. Проверить cover, «Лес», «Историю духов леса», draw, result, spreads, profile и sound toggle по [REFINEMENT_BASELINE.md](./REFINEMENT_BASELINE.md)

## GitHub Pages publish check

После push нужно проверить:

1. Workflow `Deploy Pages` завершился зелёным.
2. Шаги `Run smoke tests`, `Prepare Pages Artifact`, `Validate Pages Artifact`, `Upload artifact` и `Deploy to GitHub Pages` прошли без ошибок.
3. Сайт [https://yukisakura13.github.io/WYRD/](https://yukisakura13.github.io/WYRD/) открывается после hard refresh.
4. В `index.html` на сайте есть актуальный `meta[name="wyrd-build"]`.
5. `styles.css`, `main.js`, `manifest.webmanifest` и `sw.js` приходят с versioned query string.

## Когда checklist обязателен

- после заметного UI-изменения;
- после изменений в `sw.js`, `manifest.webmanifest`, `assets/js/pwa.js`;
- после изменений в CSS-структуре;
- после изменений в state или domain routing;
- перед финализацией крупного этапа roadmap.

## Definition of done для публикации

Изменение считается завершённым, если:

- локальные smoke checks проходят;
- `.dist-pages` валиден;
- GitHub Actions публикует зелёный deploy;
- GitHub Pages показывает свежую версию сайта.

Дополнительно каждая задача проходит канонический [Definition of Ready & Done](/Users/marinamart/Desktop/Oracle_dev/docs/DEFINITION_OF_READY_DONE.md): PR содержит Linear link и self-review, а после deploy в Linear записываются evidence, риски и follow-ups.
