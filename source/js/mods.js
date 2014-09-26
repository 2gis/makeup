(function($, _) {
    var Makeup = Makeup || {};
    Makeup.fn = Makeup.fn || {};

    /**
     * Создаёт CSS класс по бэму
     *
     * @param {Object} namingRules - объект правил составления css-классов
     * @param {Object} params - {block: 'block', element: 'element', modKey: 'active', modValue: true}
     * @return {String} - CSS класс, составленный по текущим правилам
     */
    Makeup.fn._composeClassName = function(params, namingRules) {
        namingRules = namingRules || this._params.namingRules;
        params = params || {};

        var str = '';

        if (!params.modKey || !namingRules.bevis) {
            if (params.block) {
                str += params.block;
            }
            if (params.element) {
                str += namingRules.delimiters.be + params.element;
            }
        }

        if (params.modKey) {
            var delimiter = namingRules.delimiters[params.element ? 'em' : 'bm'];

            if (namingRules.logic) {
                if (params.modValue === true) {
                    str += delimiter + params.modKey;
                } else if (params.modValue === false) {
                    str = '';
                }
            } else {
                str += delimiter + params.modKey + namingRules.delimiters.mm + params.modValue;
            }
        }

        return str;
    },

    /**
     * Пытается найти имя блока или элемента в классах, тип элемента (блок или элемент)
     *
     * @param {HTMLElement} el - детектируемый дом-элемент
     * @param {Object} namingRules - объект правил составления css-классов
     * @return {Object} - объект результата парсинга
     */
    Makeup.fn._detectBEM = function(el, namingRules) {
        namingRules = namingRules || this._params.namingRules;
        var dms = namingRules.delimiters;
        if (dms.be == dms.bm || dms.be == dms.mm) {
            throw new Error('Block-Element delimiter must be unique!');
        }

        var type; // el является блоком или элементом

        // Пытаемся найти имя блока
        var name = _.find(el.classList, function(cls) { // Итерируем по всем классам на элементе
            return _.reduce(dms, function(result, value, key) { // И возвращаем первый попавшийся, в составе которого нет ни одного разделителя
                return result && cls.indexOf(value) == -1;
            }, true);
        });

        if (name) {
            type = 'block';
        } else { // Если блок не нашёлся, пытаемся найти имя элемента
            var elDms = _.omit(dms, ['be']);

            name = _.find(el.classList, function(cls) { // Итерируем по всем классам на элементе
                return !_.reduce(elDms, function(result, value, key) { // И возвращаем первый попавшийся, в составе которого нет ни одного разделителя
                    re = new RegExp('([A-Za-z\\d]|^)' + value + '[A-Za-z\\d]'); // 'awefa_qwe', '_qwew' -> true, 'freafewAWEr' -> false
                    return result || cls.match(re);
                }, false);
            });

            if (name) {
                type = 'element';
            } else {
                throw new Error('No blockname nor elementname found in classes: ' + el.classList.join(', '));
            }
        }

        return {
            type: type,
            name: name,
            blockName: name.split(dms.be)[0],
            elementName: type == 'element' ? name : null
        };
    };

    /**
     * Парсит модификаторы по классам с дом-элемента
     *
     * @param {HTMLElement} el - дом-элемент, с которого будут считываться модификаторы
     * @param {Object} namingRules - объект правил составления css-классов
     * @return {Object} - объект модификаторов
     */
    Makeup.fn._parseMod = function(el, namingRules) {
        namingRules = namingRules || this._params.namingRules;

        var dms = namingRules.delimiters;
        var bem = this._detectBEM(el, namingRules);

        // Переделываем классы в объект модификаторов
        var mods = _.reduce(el.classList, function(result, cls) {
            if (cls == bem.name) {
                return result;
            }

            var re;
            var delm = bem.mode == 'block' ? dms.bm : dms.em;

            if (namingRules.bevis) {
                re = new RegExp('^' + delm + '([\\w-]*)'); // '_state_open' -> 'state_open'
            } else {
                re = new RegExp('^' + bem.name + delm + '([\\w-]*)'); // '(block__)element_state_open' -> 'state_open'
            }
            var tail = _.compact(cls.match(re)[1].split(dms.mm));

            if (tail) {
                var key = tail[0];
                var value = tail[1];

                if (!value) {
                    value = 'true';
                }
                
                result[key] = value;
            }

            return result;
        }, {});

        return mods;
    };

    /**
     * Устанавливает модификаторы modifiers на элемент el
     *
     * @param {HTMLElement} el - нода, на которую будет устанавливаться можификаторы
     * @param {Object} modifiers - одноуровневый объект модификаторов
     */
    Makeup.fn._mod = function(el, modifiers) {
        if (!el.mod) {
            var bem = this._detectBEM(el, this.delimiters);
            el.mod = this._parseMod(el);
            el.blockName = bem.blockName;
            el.elementName = bem.elementName;
        }

        if (!modifiers) {
            return el.mod;
        } else {
            var newMods = _.extend(_.clone(el.mod), modifiers),
                oldMods = el.mod,
                operations = [];

            _.each(modifiers, function(value, key) {
                var mod = {};
                mod[key] = value;
                var cls = this._composeClassName({
                    block: el.blockname,
                    element: el.elementName,
                    modifier: mod,
                    namingRules: this._params.namingRules
                });

                // Add modifier
                if (!oldMods[key]) {
                    operations.push({key: key, value: value, isRemove: false});
                    return;
                }

                // Remove modifier
                if (!value) {
                    operations.push({key: key, value: oldMods[key], isRemove: true});
                    return;
                }

                // Change value
                operations.push(
                    {key: key, value: oldMods[key], isRemove: true},
                    {key: key, value: value, isRemove: false}
                );

            });

            _(operations).forEach(function(item) {
                var value = item.value === true ? '' : '-' + item.value,
                    modifier = el.blockName + '--' + item.key + value;

                if (item.isRemove) {
                    $(el).removeClass(modifier);
                } else {
                    $(el).addClass(modifier);
                }
            });

            el.mod = newMods;
        }
    };

    if (typeof TEST != 'undefined' && TEST) {
        module.exports = Makeup;
    }
})(jQuery, _);