[![Build Status](https://travis-ci.org/2gis/makeup.svg)](https://travis-ci.org/2gis/makeup) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/2gis/makeup?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Экспресс-версию Makeup можно загрузить почти на любой сайт (кроме тех, где выставлен HTTP заголовок content-security-policy). Для этого скопируйте и выполните строчку кода в консоли Dev Tools вашего браузера:

```js
var s=document.createElement('script');s.src ="//2gis.github.io/makeup/autoload/script.js";document.body.appendChild(s)
```

[Демо-сайт](http://2gis.github.io/makeup/demo)

[Промо-сайт](http://2gis.github.io/makeup)

# Makeup

Makeup – инструмент для вёрстки и приятного контроля за качеством вёрстки на веб-проектах.

Вы поладите с Makeup, если ваша верстка основана на независимых блоках, а вам важна стабильность и надежность проекта.

## Описание

Если говорить формально, Makeup – это js-библиотека, которая предоставляет визуальный интерфейс для изолированной разработки и быстрого ручного регрессионого тестирования вёрстки, основанной на абсолютно-независимых блоках.

Makeup предназначен

* Для сравнения вёрстки блоков с исходными дизайн-макетами.
* Для контроля за состояниями блоков (модификации блоков, разный контент).
* Для комфортной изолированной разработки блоков.

## Быстрый старт

Создайте страницу со всеми ресурсами вашей вёрстки (разметка, стили, изображения):

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

Подключите два файла: скрипт и стили Makeup.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Makeup</title>
    <link rel="stylesheet" href="style.css">

    <script src="makeup.js"></script><!-- Сам Мейкап -->
    <link rel="stylesheet" href="makeup.css"> <!-- Стили Мейкапа -->
</head>
<body>
    <div style="display: none;">
        <button class="button">My button</button>
    </div>
</body>
</html>
```

Инициализируйте Мейкап

```js
Makeup(params, templating);
```
где params - опциональный объект параметров, включая список блоков. Если объект не передан, все параметры берутся со значениями по-умолчанию, а список блоков генерируется из имеющегося в текущий момент DOM-дерева; templating - опциональная функция, которая по имени блока (и параметрам этого блока) должна возвращать html этого блока:

```js
templating(ctx) {
    return html;
};
```
где ctx - объект, идентифицирующий выбранный в списке блок и его параметры; return - html код выбранного блока. Если функция не передана, используется встроенная функция, которая просто ищет в имеющемся DOM-дереве $('.' + ctx.name) и берёт от него outerHTML.

[Формат данных для инициализации](docs/format.md)

## Примеры

Все примеры можно найти в папке demo: достаточно открыть в браузере один из html файлов.

## Сборка

Если вы хотите разрабатывать сам Мейкап, то... Для сборки должны быть установлены `nodejs`, `npm` и `gulp`.

1. Склонируйте репозиторий

    ```bash
    git clone git@github.com:2gis/makeup.git
    cd makeup
    ```
2. Запустите сборку

    ```bash
    npm i
    npm start
    ```

Демо будет доступно по адресу [localhost:3333/demo](http://localhost:3333/demo).

[Горячие клавиши в интерфейсе Makeup](docs/keyboard.md)

До 23 октября 2015 года под именем «makeup» в npm находился другой проект — «node-makeup». Вы можете получить доступ к проекту «node-makeup» в [гите](https://github.com/defunctzombie/node-makeup).

Another project ("node-makeup") has been published in npm with name "makeup" till 23.10.2015. You can find previous project in [github with name "node-makeup"](https://github.com/defunctzombie/node-makeup).