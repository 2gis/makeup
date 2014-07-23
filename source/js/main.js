var blocks = {};

(function() {
    $('body').append(makeupTemplates.makeup($.extend(data, global)));
    initBlocks();
})();


/*

1. берем данные, прячем контент, рендерим приложение
2. инициализируем зависимости:
— барон
— радер
3. навешиваем обработчики событий (+ клава):
— меню
— поиск
— смена режима
— смена фона
— масштаб
— прозрачность
— сворачивание/разворачивание элементов списка
— линейки
— дополнительно: статусбар (ховер по элементам, комментарии к модулю/типу)
— дополнительно: настройки (масштаб)



*/

/**
 * Initialize all blocks on page
 */
function initBlocks() {
    for (var key in blocks) {
        if (blocks[key]) {
            // if ($('.' + key).length && blocks[key].init) {
            //     blocks[key].init();
            // }
        }
    }
}
