// if (typeof window == 'undefined') {
//     return;
// }


function Makeup(options) {
    var instance;

    if (this instanceof Makeup) {
        instance = this;
    } else {
        instance = createObject(Makeup.prototype);
    }

    instance._init(options);

    return instance;
}

Makeup.prototype = {
    constructor: Makeup,

    _state: {},

    _init: function(options) {

        this._params = this._viewModel(_.merge({

            selectors: {
                sidebar: '.makeup__aside',
                scroller: '.makeup__aside-in',
                scrollerTrack: '.makeup__aside-track',
                scrollerTrackBar: '.makeup__aside-track-bar',
                moduleHeader: '.makeup__module-header',
            },

            modifiers: {
                baron: 'makeup__aside--baron'
            },

            menu: {
                tooltip: "Toggle menu",
                checked: true
            },

            search: {
                placeholder: ""
            },

            mode: {
                label: "Mode",

                items: [
                    {
                        tooltip: "Image",
                        value: "1",
                        checked: true
                    },
                    {
                        tooltip: "Markup",
                        value: "2",
                    },
                    {
                        tooltip: "Markup and image",
                        value: "3",
                    },
                    {
                        tooltip: "Markup and inversed image",
                        value: "4",
                    }
                ]
            },

            background: {
                label: "Background",

                items: [
                    {
                        tooltip: "Gray",
                        value: "color",
                        checked: true
                    },
                    {
                        tooltip: "Transparency grid",
                        value: "transparency"
                    }
                ]
            },

            transparency: {
                label: "Transparency",
                type: "slider",
                name: "makeup-transparency",

                slider: {
                    min: 0,
                    max: 1,
                    step: 0.1
                }
            },

            zoom: {
                label: "Zoom",
                type: "slider",
                name: "makeup-zoom",

                slider: {
                    min: 1,
                    max: 4,
                    step: 0.2
                }
            },

            ruler: {
                h: {
                    type: "ruler",
                    name: "makeup-ruler-h",

                    slider: {
                        min: 0,
                        max: 1000,
                        step: 10
                    }
                },
                v: {
                    type: "ruler",
                    name: "makeup-ruler-v",

                    slider: {
                        min: 0,
                        max: 1000,
                        step: 10
                    }
                }
            },

            renderModule: function() {}

        }, options));

        $('body').append(makeupTemplates.makeup(this._params));

        this._bindListeners();
    },

    _bindListeners: function() {
        /*
        Baron
        Rader
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

        this._bindMenuListeners();
        this._bindSearchListeners();
        },

    /**
     * Menu
     */
    _bindMenuListeners: function() {
        var that = this,
            sidebar = $(this._params.selectors.sidebar),
            module = $(this._params.selectors.moduleHeader);

        module.on('click', function() {
            var directory = this.parentNode;

            if (that._mod(directory).expandable) {
                toggleMenuItem(directory);
            } else {
                var id = directory.dataset.id,
                    module = that._params.modules[id];

                that._params.renderModule(module);
            }
        });

        this._baron = sidebar.baron({
            scroller: this._params.selectors.scroller,
            track:    this._params.selectors.scrollerTrack,
            bar:      this._params.selectors.scrollerTrackBar,
            barOnCls: this._params.modifiers.baron
        });

        /**
         * Toggle subnavigation
         */
        function toggleMenuItem(directory) {
            that._mod(directory, {expanded: !that._mod(directory).expanded});
            that._baron.update();
        }
    },

    /**
     * Search control listeners
     */
    _bindSearchListeners: function() {},

    /**
     * Mode control listeners
     */
    _bindModesListeners: function() {

    },

    /**
     * Background control listeners
     */
    _bindBackgroundsListeners: function() {},

    /**
     * Mod
     */
    _mod: function(el, modifiers) {
        if (!el.mod) {
            el.mod = this._parseMod(el);
            el.blockName = el.classList[0];
        }

        if (!modifiers) {
            return el.mod;
        } else {
            var newMods = _.merge(_.clone(el.mod), modifiers),
                oldMods = el.mod,
                operations = [],
                element = $(el);

            _(newMods).forIn(function(value, key) {

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
                    element.removeClass(modifier);
                } else {
                    element.addClass(modifier);
                }
            });

            el.mod = newMods;
        }
    },

    /**
     * Parse mods from DOM
     */
    _parseMod: function(el) {
        var classes = el.classList,
            moduleName = classes[0],
            out = {};

        for (var i = 1, len = classes.length; i < len; i++) {
            var item = classes[i].replace(moduleName, '').split('-');

            out[item[2]] = item[3] || true;
        }

        return out;
    },

    /**
     * Change
     */

    /**
     * View model
     */
    _viewModel: function(data) {
        var model = data || {},
            out = model;

        if (model && model.modules) {
            out.modules = this._parseCollection(model.modules);
        }

        return out;
    },

    /**
     * Parse item
     */
    _parseItem: function(item) {
        var out = {};

        if (typeof item == "string") {
            out.name = item;
        } else if (item instanceof Object) {
            var children = item.items,
                documentation = item.documentation,
                meta = item.meta;

            out = item;
            out.name = out.name || 'Untitled';

            // Documentation
            if (documentation && documentation instanceof Array && documentation.length) {
                out.documentation = this._parseCollection(documentation, this._parseDocumentation);
            }

            // Meta
            if (item.meta && item.meta instanceof Array && item.meta.length) {
                out.meta = this._parseCollection(meta, this._parseMeta);
            }

            // Children
            if (children && children instanceof Array && children.length) {
                out.items = this._parseCollection(children);
            }
        }

        out.label = out.label || out.name;

        return out;
    },

    /**
     * Parse collection
     */
    _parseCollection: function(arr, func) {
        var out = [],
            that = this;

        _(arr).compact().forEach(function(item) {
            out.push(func ? func(item) : that._parseItem(item));
        });

        return out;
    },

    /**
     * Parse documentation
     */
    _parseDocumentation: function(item) {
        var out = {};

        if (typeof item == "string") {
            out.link = item;
        } else if (item instanceof Object && item.link) {
            out.link = item.link;
            out.label = item.label || out.link;

            if (item.modifier) {
                out.modifier = item.modifier;
            }
        }

        return out;
    },

    /**
     * Parse meta
     */
    _parseMeta: function(item) {
        var out = {};

        if (typeof item == "string") {
            out.key = item;
        } else if (item instanceof Object && item.key) {
            out = item;
        }

        return out;
    }
};



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