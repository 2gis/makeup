# Makeup

[![Join the chat at https://gitter.im/2gis/makeup](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/2gis/makeup?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Makeup – инструмент для приятного контроля за качеством вёрстки на веб-проектах.

Вы поладите с Makeup, если ваша верстка основана на независимых блоках, а вам важна стабильность и надежность проекта.

## Описание

Если говорить формально, Makeup – это js-библиотека, которая предоставляет визуальный интерфейс для быстрого ручного регрессионого тестирования вёрстки, основанной на абсолютно-независимых блоках.

Makeup предназначен

* для сравнения вёрстки блоков с исходными дизайн-макетами;
* для контроля за состояниями блоков (модификации блоков, разный контент);
* для комфортной изолированной разработки блоков.

## Быстрый старт

Создайте страницу со всеми ресурсами вёрстки (разметка, стили, изображения)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Makeup</title>
    <link rel="stylesheet" href="style.css"> <!-- Стили проекта -->
</head>
<body>
    <button class="button">My button</button> <!-- Разметка -->
</body>
</html>
```

Добавьте скрипты и стили Makeup, спрячьте верстку приложения.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Makeup</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="makeup.css"> <!-- Стили Мейкапа -->
</head>
<body>
    <div style="display: none;">
        <button class="button">My button</button>
    </div>
    <script src="makeup.js"></script> <!-- Привет, Мейкап -->
</body>
</html>
```

Инициализируйте Мейкап


```js
new Makeup({

    renderModule: function(module) {
        var containerSelector = this._params.selectors.containerMarkup,
            html = document.querySelector('.' + module.modulename).outerHTML;

        document.querySelector(containerSelector).innerHTML = html;
    },

    data: {
        name: 'Blocks',
        items: [{
            name: 'button',
            image: 'button.png'
        }]
    }
});
```

Функция `renderModule` позволяет использовать Мейкап в любом окружении. Она может содержать методы по работе с шаблонизаторами, методами вашего фреймворка, использовать для рендера произвольные данные.

Аргумент, который получает функция `renderModule` — это объект, содержащий всю имеющуюся у Мейкапа информацию о генерируемом модуле.

[Формат данных для инициализации](docs/format.md)

## Сборка

Для сборки должны быть установлены `nodejs`, `npm` и `gulp`.

1. Склонируйте репозиторий

    ```bash
    git clone git@github.com:2gis/makeup.git
    cd makeup
    ```
2. Запустите сборку

    ```bash
    npm i
    gulp
    ```

Демо будет доступно по адресу [localhost:3333/demo](http://localhost:3333/demo).

[Горячие клавиши в интерфейсе Makeup](docs/keyboard.md)