# Приглашение на День Рождения | Михаил Белозёров

Интерактивное веб-приглашение на 20-й День Рождения с формой RSVP, картой, таймером и меню.

[![made-with-html](https://img.shields.io/badge/Made%20with-HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![made-with-css](https://img.shields.io/badge/Made%20with-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![made-with-js](https://img.shields.io/badge/Made%20with-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## Особенности

- Таймер обратного отсчёта до события
- Интерактивная карта с отметкой места проведения (Яндекс.Карты)
- Форма RSVP для подтверждения участия
- Слайдер с меню и галереей блюд
- Адаптивный дизайн для всех устройств
- Плавные анимации при скролле
- Согласие на обработку персональных данных (152-ФЗ)

---

## Технологии

- HTML5
- CSS3 (анимации, адаптив, кастомные компоненты)
- JavaScript (валидация, таймер, слайдер, lightbox)
- Яндекс.Карты API
- Google Apps Script (сбор данных в Google Таблицу)
- GitHub Pages

---

## Структура проекта
```
├── index.html # Главная страница
├── privacy.html # Политика конфиденциальности
├── style.css # Стили главной страницы
├── privacy.css # Стили страницы политики
├── script.js # JavaScript логика
├── images/ # Изображения
│ ├── menu-1.jpg
│ └── menu-2.jpg
└── README.md # Документация
```

---

## Настройка

### 1. Google Таблица для сбора ответов

1. Создайте Google Таблицу с колонками:
   `Имя | Статус | Аллергены | Пожелания | Дата отправки | Согласие на обработку`
2. Откройте `Расширения -> Apps Script`
3. Вставьте скрипт из `script.js` (раздел с отправкой формы)
4. Опубликуйте как веб-приложение и получите URL
5. Вставьте URL в `script.js` в переменную `GOOGLE_SCRIPT_URL`

### 2. Яндекс.Карты

1. Получите API-ключ в кабинете разработчика Яндекс.Карт
2. Вставьте ключ в `index.html` в параметр `apikey=`

### 3. Настройка даты

В `script.js` измените дату события:
```javascript
const targetDate = new Date(2026, 6, 18, 14, 0, 0); // 18 июля 2026, 14:00
```
---

Адаптивность
> Сайт оптимизирован для всех устройств:
> Телефоны (320px - 480px)
> Планшеты (768px - 1024px)
> Ноутбуки (1366px - 1920px)
> Мониторы (1920px+)

---



<p align="center">made by belozerov</p>


