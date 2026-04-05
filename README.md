# WYRD

Локальная статическая версия мистического оракула на `HTML/CSS/JS` без сборщика.

## Структура

- `index.html` — главный вход
- `assets/css/styles.css` — стили
- `assets/js/main.js` — тонкий entrypoint приложения
- `assets/js/data/cards.js` — канонический источник данных карт
- `assets/js/state/storage.js` — загрузка, сохранение и нормализация состояния
- `assets/js/cards/reading.js` — логика выбора карт и раскладов
- `assets/js/ui/render.js` — единый рендер UI-секций
- `assets/js/ui/actions.js` — маршрутизация действий пользователя
- `assets/js/audio.js`, `assets/js/ritual.js`, `assets/js/pwa.js` — побочные эффекты и инфраструктура
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

## Что изменилось в архитектуре

- удалён монолитный `app.js`; приложение собрано из маленьких ES-модулей
- убрано дублирование данных карт: источник истины теперь один
- состояние и UI-переходы централизованы, чтобы проще добавлять новые сценарии
- `sw.js` обновлён под новую модульную структуру
