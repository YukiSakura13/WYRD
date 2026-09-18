# WYRD Silver UI Kit

В архиве — SVG иконок, лунных знаков, четырёх рамок кнопок и рамки карты,
Печать Леса, а также живая страница UI Kit с её HTML, CSS, JavaScript и изображениями.

## Как пользоваться

1. Распакуйте архив целиком, сохранив структуру папок.
2. Для просмотра запустите в папке `wyrd-ui-kit` команду `python3 -m http.server 8000`.
3. Откройте `http://localhost:8000/docs/wyrd-ui-kit.html`.

Для шрифтов Google Fonts нужен интернет. Графика и исходники находятся внутри архива.
SVG можно открыть отдельно в браузере или векторном редакторе. Серебряные линии
лучше видны на тёмном фоне. У отдельных лунных фаз тёмная часть залита цветом Night.

## Где лежат материалы

- `assets/ui/icons/` — навигация, профиль, настройки, «Поделиться».
- `docs/downloads/icons/` — восемь лунных знаков и стрелка следующей страницы,
  экспортированные из утверждённого UI Kit; цвета сохранены внутри SVG.
- `assets/ui/action-buttons/continuous/` — Hero, Secondary, Compact, Quiet и ромб.
- `assets/ui/card-frames/approved/` — рамка карты.
- `public/` — Печать Леса в SVG и PNG.

## Кнопки с оформлением и поведением

SVG рамки не содержит надпись или интерактивные состояния. Для готовой кнопки
используйте HTML-пример из раздела «Кнопки» в `docs/wyrd-ui-kit.html` вместе с:

- `assets/css/tokens.css`;
- `assets/css/components/control-language.css`;
- `assets/css/components/action-buttons.css`;
- `assets/css/components/silver-components.css`;
- `docs/wyrd-ui-kit.css` (оформление демонстраций).

Сохраняйте относительные пути к SVG. Надпись остаётся обычным текстом в `<button>`.
Пример Compact: `<button class="ui-action wyrd-action-frame wyrd-action-frame--compact" type="button">Сохранить</button>`.

Особое приглашение «Войти в лес» использует `createCoverCtaAnimation(button)` из
`assets/js/ui/cover-cta.js`; пример подключения находится в `docs/wyrd-ui-kit.js`.
Демонстрационные действия UI Kit не выполняют продуктовые операции.

Геометрия и состояния — утверждённый контракт WYRD. Публикация файлов не меняет
прав на фирменную графику. Иконки с префиксом `tabler-` основаны на Tabler Icons;
сохраняйте их атрибуцию при использовании.

## Для разработчиков репозитория

После изменений UI Kit и перед проверкой ссылок/asset integrity запустите
`python3 scripts/build_ui_kit_downloads.py`.
Архив собирается заново в `scripts/prepare_pages.py` и не хранится в Git.
`python3 scripts/validate_ui_kit_downloads.py .dist-pages` проверяет все ссылки
скачивания, SVG и полноту архива в опубликованном артефакте.
