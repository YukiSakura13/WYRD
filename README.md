# WYRD

Локальная статическая версия мистического оракула на `HTML/CSS/JS`, собранная из `wyrd_oracle_v3.html`.

## Структура

- `index.html` — главный вход
- `assets/css/styles.css` — стили
- `assets/js/cards.js` — колода из 22 карт
- `assets/js/app.js` — логика ритуала, лимитов, paywall и истории
- `assets/images/` — cover и изображения карт
- `manifest.webmanifest`, `sw.js` — PWA-обвязка

## Как смотреть локально

Самый простой вариант:

1. Открой `index.html` в браузере

Если хочешь проверить PWA и service worker:

1. В терминале из папки проекта запусти `python3 -m http.server 4173`
2. Открой [http://localhost:4173](http://localhost:4173)

## Что реализовано

- loading / wake screen
- deck screen
- ritual timer на 3 секунды
- reveal screen
- 1 бесплатная карта в день
- локальный paywall-preview
- углубление значения
- расклад на 3 карты
- профиль и история
- звук шуршания карт
- сохранение состояния в `localStorage`
