Makeup
======

Инструмент для быстрого и комфортного регрессионого тестирования вёрстки, основанной на абсолютно независимых блоках.

Мейкап предназначен

1. Для сравнения верстки блоков с исходным дизайном;
2. контроля за состояниями блоков (модификации блоков, разный контент);
3. комфортной изолированной разработки блоков.

## Схема работы

Для работы Мейкапу потребуется три вещи:

1. Ресурсы приложения (разметка, стили, изображения);
2. изображения из исходного дизайна;
3. конфиг с параметрами инициализации.

## Инициализация

```js
new Makeup({
    renderModule: function(module) {} // Функция, которая создает блок в Мейкапе,
    data: {}                          // Данные для инициализации
});
```

[Формат данных для инициализации](docs/format.md)

Функция `renderModule` позволяет использовать Мейкап в любом окружении. Она может содержать методы по работе с шаблонизаторами, методами вашего фреймворка, использовать для рендера произвольные данные.

Аргумент, который получает функция `renderModule` — это объект, содержащий всю имеющуюся у Мейкапа информацию о генерируемом модуле.


## Getting started

Создайте страницу со всеми ресурсами для верстки (разметка, стили, изображения)

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

Добавьте скрипты и стили Мейкапа, спрячьте верстку приложения.

```html
<!DOCTYPE html>
<html lang="en">
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


