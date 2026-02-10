# Фабрика воспоминаний — многостраничный сайт

Обновлённый эстетичный сайт в красно-белой стилистике для студии 3D-воспоминаний.

## Структура

- `index.html` — главная страница + блок «Что мы делаем» и каталог идей.
- `services.html` — услуги и этапы работы.
- `portfolio.html` — карточки портфолио с местами под будущие фото кейсов.
- `about.html` — информация о студии.
- `contact.html` — улучшенная страница контактов и форма заявки.
- `styles.css` — общий современный стиль для всех страниц.
- `script.js` — общий JS (год в футере + сообщение после отправки формы).
- `assets/logo.svg` — логотип.

## Локальный запуск

```bash
python3 -m http.server 8000
```

Откройте: `http://localhost:8000/index.html`.

## Как добавлять реальные фото в портфолио

1. Создайте папку `assets/portfolio/`.
2. Добавьте туда изображения (например, `case-1.jpg`).
3. В `portfolio.html` замените блоки `.photo-placeholder` на теги `<img ...>`.

## Публикация на GitHub

```bash
git add .
git commit -m "feat: polish modern aesthetic layout, catalog section, portfolio placeholders and contacts"
git push
```
