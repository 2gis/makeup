/**
 * Wake up!
 * Grab a brush and put a little makeup!
 *
 * @requires jQuery
 * @requires lodash
 */
var Makeup = (function(win) {
    var _makeup;

    function Makeup(options) {
        if (_makeup) { // Singleton
            return _makeup;
        }

        if (!(this instanceof Makeup)) { // Rezig constructor
            return new Makeup(options);
        }

        _makeup = this;
        this._init(options);
    }

    Makeup.init = Makeup;
    Makeup.templating = function(fn) {
        var html = Makeup._templating = fn;
    };

    Makeup.fn = Makeup.prototype = {
        init: Makeup,

        constructor: Makeup,

        _state: {},

        el: {},

        // Инициализация makeup: подтягивание конфига, данных, рендеринг, навешивание событий
        _init: function(options) {
            this._params = this._getParams(options); // @see params.js
            this._state = new State();

            this._render();
            this._assignSelectors();
            this._bindListeners();
            this._misc();

            // No user blocks in dom allowed before this line

            this._state.push(); // wanted state -> actual state
            this._obey(this._state.get()); // init actual state

            return this;
        },

        // Всякие дополнительные навешивания классов, браузер-специфичные вычисления
        _misc: function() {
            this.ieVersion = this._ie();
            if (this.ieVersion < 9) {
                this._mod(this.el.root[0], { ie: this.ieVersion });
            }
        },

        // Отрисовывает библиотеку makeup
        _render: function() {
            var viewContext = this._viewModel(this._params);
            var makeupHTML = Handlebars.partials.makeup(viewContext);

            this._params.wrapper.append(makeupHTML);
        },

        // Кэширует некоторые DOM-элементы, созданные на этапе render
        _assignSelectors: function() {
            $(this._params.selectors.root).attr('data-makeup', true);

            _.each(this._params.selectors, function(item, key) {
                this.el[key] = $(item);
            }, this);

            this._containerMarkup = $(this._params.selectors.containerMarkup);
        },

        _bindListeners: function() {
            var params = this._params,
                win = $(window);
            /*
            — поиск
            — линейки
            — дополнительно: статусбар (ховер по элементам, комментарии к модулю/типу)
            — дополнительно: настройки (масштаб)
            */

            this._bindMenuListeners();

            if (params.search) this._bindSearchListeners();
            if (params.mode) this._bindModesListeners();
            if (params.background) this._bindBackgroundsListeners();
            if (params.transparency) this._bindTransparencyListeners();
            if (params.zoom) this._bindZoomListeners();
            if (params.ruler) this._bindRulerListeners();
            if (params.smiley) this._bindSmileyListeners();

            win.on('statechange', _.bind(this._statechange, this));
        },

        /**
         * Statechange handler
         */
        _statechange: function(e) {
            this._obey(e.diff);
        },

        /**
         * Menu
         */
        _bindMenuListeners: function() {
            var self = this,
                makeupRootElement = $(this._params.selectors.root)[0],
                sidebar = $(this._params.selectors.sidebar),
                itemHeader = $(this._params.selectors.itemHeader),
                win = $(window);

            itemHeader.on('click', function() {
                var item = this.parentNode;

                if (self._mod(item).expandable) { // Item which has a list of another items
                    self._toggleMenuItem(item);
                } else { // "End"-item, which has corresponding html representation
                    var chain = _.map($(this).parents(self._params.selectors.item), function(el) {
                        return $(el).data('name');
                    }).reverse();

                    self._state.set({
                        chain: chain
                    });
                }
            });

            // Hiding sidebar
            if (this._params.sidebar) {
                var sidebarToggler = this.el.sidebarToggler;

                // Set default mode
                if (!this._state.get('sidebar')) {
                    var defaultSidebarState = this._mod(makeupRootElement).sidebar || true;

                    this._state.want({ sidebar: defaultSidebarState });
                }

                sidebarToggler.on('change', function() {
                    self._state.set({ sidebar: this.checked });
                });

                win.on('keydown', function(e) {
                    var key = self._getKey(e);

                    if (key == 192 || key == 220) {
                        self._state.set({ sidebar: !sidebarToggler[0].checked });
                    }
                });
            }

            this._baron = sidebar.baron({
                scroller: this._params.selectors.scroller,
                track:    this._params.selectors.scrollerTrack,
                bar:      this._params.selectors.scrollerTrackBar,
                barOnCls: this._params.modifiers.baron
            });
        },

        /**
         * Apply state in aside panel
         */
        _setCurrentMenuItem: function(chain) {
            var self = this;
            var itemsChain = this._itemsChain(chain);
            var youngestItem = _.last(itemsChain);

            if (!youngestItem.items) { // last item in hierarchy
                var item = itemsChain.pop();
                this.el.item.each(function() {
                    self._mod(this, {current: false});
                });
                this._mod($('#item-' + item._id)[0], {current: true});
            }

            _.each(itemsChain, function(item, key) {
                var element = $('#item-' + item._id)[0];

                this._mod(element, {expanded: true});
            }, this);
        },

        /**
         * Toggle navigation item
         */
        _toggleMenuItem: function(directory) {
            this._mod(directory, {expanded: !this._mod(directory).expanded});
            this._baron.update();
        },

        /**
         * Search
         */
        _search: function(query) {
            var makeup = this,
                items = $(makeup._params.selectors.item);

            items.each(function() {
                this._shown = !query; // if no query, show all, else hide
                this._highlight = false;
            });

            if (query) {
                query = query.split(/[\s\/]+/); // split by slash and space
                var selector = _.reduce(query, function(sel, part) {
                    if (part) {
                        sel += '[data-index*="' + part.toLowerCase() + '"] ';
                    }
                    return sel;
                }, '');

                items.filter(selector).each(function() {
                    this._shown = true;
                    this._highlight = true;
                    // show and expand all parent items
                    $(this).parents(makeup._params.selectors.item).each(function() {
                        this._shown = true;
                        this._expanded = true;
                    });
                    // show all child items
                    $(this).find(makeup._params.selectors.item).each(function() {
                        this._shown = true;
                    });
                });
            }

            items.each(function() {
                makeup._mod(this, {
                    hidden: !this._shown,
                    highlight: this._highlight,
                    expanded: this._expanded
                });
            });
        },

        /**
         * Search control listeners
         */
        _bindSearchListeners: function() {
            var makeup = this,
                searchInput = $(makeup._params.selectors.searchInput),
                module = $(makeup._params.selectors.item),
                moduleType = $(makeup._params.selectors.itemType);

            searchInput.on('keyup', function() {
                makeup._search(searchInput.val());
            });
        },

        /**
         * Mode control listeners
         */
        _bindModesListeners: function() {
            var makeup = this,
                makeupElement = $(makeup._params.selectors.root),
                modeControl = $(makeup._params.selectors.modeControl),
                win = $(window),
                defaultMode = {};

            // Set default mode
            defaultMode.mode = makeup._state.get('mode') || makeup._mod(makeupElement[0]).mode || 1;
            if (defaultMode.mode == 3 || defaultMode.mode == 4) {
                defaultMode.transparency = 0.5;
            }
            makeup._state.want(defaultMode);

            console.log('modeControl', modeControl);
            modeControl.on('change', function() {
                var out = {};

                modeControl.each(function(i) {
                    if (modeControl[i].checked == true) {
                        out.mode = +modeControl[i].value;
                    }
                });

                if (out.mode == 3 || out.mode == 4) {
                    out.transparency = 0.5;
                } else {
                    out.transparency = 1;
                }

                makeup._state.set(out);
            });

            win.on('keydown', function(e) {
                var key = makeup._getKey(e);

                switch (key) {
                    case 49:
                        makeup._state.set({ mode: 1, transparency: 1 });
                        break;
                    case 50:
                        makeup._state.set({ mode: 2, transparency: 1 });
                        break;
                    case 51:
                        makeup._state.set({ mode: 3, transparency: 0.5 });
                        break;
                    case 52:
                        makeup._state.set({ mode: 4, transparency: 0.5 });
                        break;
                }
            });
        },

        _setCurrentMode: function(value) {
            var modeControl = this.el.modeControl;

            if (modeControl.filter('[value="' + value + '"]')[0].checked == true) {
                return;
            }

            modeControl.each(function(i) {
                if (modeControl[i].value == value) {
                    modeControl[i].checked = true;
                }
            });
        },

        /**
         * Background control listeners
         */
        _bindBackgroundsListeners: function() {
            var self = this,
                makeupElement = $(this._params.selectors.root),
                bgControl = $(this._params.selectors.bgControl);

            // Set default background
            this._state.want({ bg: this._state.get('bg') || this._mod(makeupElement[0]).bg || 'color' });

            bgControl.on('change', function() {
                var value;

                bgControl.each(function(i) {
                    if (bgControl[i].checked == true) {
                        value = bgControl[i].value;
                    }
                });

                self._state.set({ bg: value });
            });
        },

        _setCurrentBackground: function(value) {
            var bgControl = this.el.bgControl;

            if (bgControl.filter('[value="' + value + '"]')[0].checked == true) {
                return;
            }

            bgControl.each(function() {
                if (this.value == value) {
                    this.checked = true;
                }
            });
        },

        /**
         * Background control listeners
         */
        _bindTransparencyListeners: function() {
            var makeup = this,

                params = this._params,
                min = params.transparency.slider.min,
                max = params.transparency.slider.max,
                value = this._state.get('transparency') || params.transparency.slider.value,

                slider = $(params.selectors.slider).filter('.makeup__slider--transparency'),
                sliderTrack = slider.find(params.selectors.sliderTrack),
                sliderTrackRunner = slider.find(params.selectors.sliderTrackRunner),
                sliderTrackPoint = slider.find(params.selectors.sliderTrackPoint),

                win = $(window);

            var updateTimeout;

            params.transparency.rader = sliderTrack.rader({
                points: sliderTrackPoint,
                runners: sliderTrackRunner,
                runnersVal: [value],
                values: [min, max],
                pointsPos: [min, max],

                onUpdate: function(e) {
                    var value = e.maxVal.toFixed(2);

                    makeup._applyTransparency(value);

                    clearTimeout(updateTimeout);
                    updateTimeout = setTimeout(function() {
                        makeup._state.set({ transparency: value });
                    }, 1000);
                }
            });

            win.on('keydown', function(e) {
                var key = makeup._getKey(e),
                    cur = params.transparency.rader.val(0),
                    slider = makeup._params.transparency.slider,
                    val;

                switch (key) {
                    case 219:
                        val = (cur - 0.1).toFixed(2);
                        makeup._state.set({
                            transparency: validateRangeValue(val, slider)
                        });
                        break;
                    case 221:
                        val = (cur + 0.1).toFixed(2);
                        makeup._state.set({
                            transparency: validateRangeValue(val, slider)
                        });
                        break;
                }
            });
        },

        _applyTransparency: function(val, validateControl) {
            var params = this._params,
                rader = params.transparency.rader;

            this._containerMarkup.css({
                opacity: val
            });

            if (validateControl && rader && rader.val(0) != +val) {
                rader.val(0, validateRangeValue(+val, params.transparency.slider));
            }
        },

        /**
         * Background control listeners
         */
        _bindZoomListeners: function() {
            var makeup = this,
                params = this._params,

                min = params.zoom.slider.min,
                max = params.zoom.slider.max,
                value = this._state.get('zoom') || params.zoom.slider.value,

                slider = $(params.selectors.slider).filter('.makeup__slider--zoom'),
                sliderTrack = slider.find(params.selectors.sliderTrack),
                sliderTrackRunner = slider.find(params.selectors.sliderTrackRunner),
                sliderTrackPoint = slider.find(params.selectors.sliderTrackPoint),

                win = $(window);

            var updateTimeout;

            params.zoom.rader = sliderTrack.rader({
                points: sliderTrackPoint,
                runners: sliderTrackRunner,
                runnersVal: [value],
                values: [min, max],
                pointsPos: [min, max],

                onUpdate: function(e) {
                    var value = e.maxVal.toFixed(2);

                    makeup._applyZoom(value);

                    clearTimeout(updateTimeout);
                    updateTimeout = setTimeout(function() {
                        makeup._state.set({zoom: value });
                    }, 1000);
                }
            });

            win.on('keydown', function(e) {
                var key = makeup._getKey(e),
                    cur = params.zoom.rader.val(0),
                    slider = makeup._params.zoom.slider,
                    val;

                switch (key) {
                    case 189:
                        val = (cur - 0.25).toFixed(2);
                        makeup._state.set({
                            zoom: validateRangeValue(val, slider)
                        });
                        break;
                    case 187:
                        val = (cur + 0.25).toFixed(2);
                        makeup._state.set({
                            zoom: validateRangeValue(val, slider)
                        });
                        break;
                }
            });
        },

        _applyZoom: function(val, validateControl) {
            var params = this._params,
                container = $(this._params.selectors.container),
                rader = params.zoom.rader;

            container.css({
                transform: 'scale(' + val + ')'
            });

            if (validateControl && rader && rader.val(0) != +val) {
                rader.val(0, validateRangeValue(+val, params.zoom.slider));
            }
        },

        /**
         * Background control listeners
         */
        _bindRulerListeners: function() {
            var makeup = this,
                params = makeup._params,

                ruler = $(params.selectors.ruler),
                rulerTrack = ruler.find(params.selectors.rulerTrack),
                rulerTrackActive = ruler.find(params.selectors.rulerTrackActive),
                rulerTrackRunner = ruler.find(params.selectors.rulerTrackRunner),
                rulerTrackPoint = ruler.find(params.selectors.rulerTrackPoint),

                min = params.ruler.h.slider.min,
                max = params.ruler.h.slider.max,
                value = this._state.get('width') || params.ruler.h.slider.value,

                horizontalRuler,
                pos = [],
                i = 0;

            while (i <= 2000) {
                pos.push(i);
                i += 100;
            }

            var updateTimeout;

            horizontalRuler = rulerTrack.rader({
                trackActive: rulerTrackActive,
                runners: rulerTrackRunner,
                points: rulerTrackPoint,
                pointsPos: pos,
                values: [min, max],
                stickingRadius: 5,
                onUpdate: function(e) {

                    makeup._applyRulerPosition(e.maxVal.toFixed(0));

                    clearTimeout(updateTimeout);
                    updateTimeout = setTimeout(function() {
                        makeup._state.set({ width: e.maxVal.toFixed(0) });
                    }, 1000);
                }
            });

            horizontalRuler.pos(0, 0);
            horizontalRuler.pos(1, value);
        },

        _applyRulerPosition: function(pos) {
            var params = this._params,
                container = $(params.selectors.container);

            container.css({
                width: validateRangeValue(pos, params.ruler.h.slider) + 'px'
            });
        },

        _bindSmileyListeners: function() {
            var self = this,
                smiley = this.el.smiley,
                makeupElement = $(this._params.selectors.root);

            // Set default smiley value
            if (!this._state.get('smiley')) {
                var defaultSmiley = this._mod(makeupElement[0]).smiley || smiley[0].checked;

                this._state.want({ smiley: defaultSmiley });
            }

            smiley.on('change', function() {
                self._state.set({ smiley: this.checked });
            });
        },

        /**
         * Obeys application diff
         *
         * @param {Object} diff
         */
        _obey: function(diff) {
            var s = diff,
                params = this._params,
                makeupElement = $(this._params.selectors.root);

            // Current Module
            if (diff.chain) {
                this._renderModule(diff.chain);
                this._setCurrentMenuItem(diff.chain);
            }

            // Modes toggler
            if (diff.mode) {
                this._setCurrentMode(s.mode);
                this._mod(makeupElement[0], {mode: s.mode});
            }

            // Background
            if (diff.bg) {
                this._setCurrentBackground(s.bg);
                this._mod(makeupElement[0], {bg: s.bg});
            }

            // Sidebar toggler
            if (diff.sidebar) {
                var sidebarToggler = this.el.sidebarToggler,
                    sidebarValue = s.sidebar == 'true';

                this._mod(makeupElement[0], {sidebar: s.sidebar});

                if (sidebarToggler.checked !== sidebarValue) {
                    sidebarToggler.checked = sidebarValue;
                }
            }

            // Transparency
            if (diff.transparency) {
                this._applyTransparency(s.transparency, 1);
            }

            // Zoom
            if (diff.zoom) {
                this._applyZoom(s.zoom, 1);
            }

            // Width
            if (diff.width) {
                this._applyRulerPosition(s.width);
            }

            // Smiley
            if (diff.smiley) {
                var smiley = this.el.smiley[0],
                    smileyValue = s.smiley == 'true';

                this._mod(makeupElement[0], {smiley: s.smiley});

                if (smiley.checked != smileyValue) {
                    smiley.checked = smileyValue;
                }
            }
        },

        /**
         * Sets text on status bar
         *
         * @param {String} str text of status
         */
        _setStatus: function(str) {
            var that = this;

            $(that._params.selectors.statusBar).text(str || '');
        },

        /**
         * Render module
         */
        _renderModule: function(chain) {
            var itemsChain = this._itemsChain(chain);
            var instance = _.reduce(itemsChain, function(result, item) {
                result[item.type] = item.name;

                return result;
            }, {}, this);
            var selector = this._params.selectors;

            // Устанавливаем стили
            var wrapperStyles = this._map(itemsChain, ['styles', 'wrapper']).join(';');
            $(selector.container).attr('style', wrapperStyles);
            var imageStyles = this._map(itemsChain, ['styles', 'image']).join(';');
            $(selector.containerImage).attr('style', imageStyles);
            var markupStyles = this._map(itemsChain, ['styles', 'markup']).join(';');
            this._containerMarkup.attr('style', markupStyles);

            // Ищем hint для модуля/типа
            var hint = this._map(itemsChain, 'hint').join(';');
            if (hint) {
                this._setStatus(this._escapeHTML(this._trimString(hint)));
            }

            // Загружаем изображение
            var src = this._find(itemsChain, 'image');
            if (!src) {
                var imagePrefix = this._find(itemsChain, 'imagePrefix');
                src = imagePrefix + instance.item + '.png';
            }
            this._loadImage(src);

            // data -> html
            var html = Makeup._templating.call(this, instance);
            this._containerMarkup.html(html);

            // Навешиваем допклассы на блок
            classes = this._map(itemsChain, 'cls').join(' ');
            if (classes) $(this._containerMarkup.children()).addClass(classes);

            // Сниппет
            snippets = this._map(itemsChain, 'snippet');
            _.each(snippets, function(snippet) {
                snippet.call(this);
            }, this);
        },

        /**
         * Загрузка изображения
         *
         * @param {string} src URL изображения
         */
        _loadImage: function(src) {
            var self = this,
                img = new Image(),
                selectors = self._params.selectors,
                container = selectors.containerImage,
                imageClass = selectors.containerImageRegular.slice(1);

            $(container).empty();
            this.imageLoader = null;

            img.onload = this.imageLoader = function(event) {
                img.onload = img.onerror = this.imageLoader = null;

                $(container).empty();
                $(this)
                    .css({
                        width: img.width,
                        height: img.height
                    })
                    .addClass(imageClass)
                    .appendTo(container);

                self._invertImage(img);
            };

            img.onerror = function(event) {
                img.onerror = null;

                self._state.set({mode: 2, transparency: 1});
            };

            img.src = src;
        },

        /**
         * Строим инвертированное изображение
         *
         * @param {image} img изображение
         */
        _invertImage: function(img) {
            var canvas = document.createElement('canvas'),
                selectors = this._params.selectors,
                canvasClass = selectors.containerImageInverse.slice(1);

            canvas.width = img.width;
            canvas.height = img.height;

            if (typeof canvas['getContext'] != 'undefined') {
                var ctx = canvas.getContext('2d'),
                    imageData,
                    pixels, r, g, b;

                ctx.drawImage(img, 0, 0);

                imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
                pixels = imageData.data;

                for (var i = 0, il = pixels.length; i < il; i += 4) {
                    pixels[i] = 255 - pixels[i];
                    pixels[i + 1] = 255 - pixels[i + 1];
                    pixels[i + 2] = 255 - pixels[i + 2];
                }

                ctx.putImageData(imageData, 0, 0);
            }

            $(canvas)
                .addClass(canvasClass)
                .appendTo(selectors.containerImage);
        },

        /**
         * Превращает объект параметров makeup в объект-контекст для главного шаблона
         *
         * @param {object} data
         */
        _viewModel: function(data) {
            var model = data,
                out = model;

            if (model.data) {
                if (!_.isArray(model.data)) out.data = [model.data];

                out.data = _.map(model.data, function(item) {
                    return {
                        label: item.label || 'Untitled group',
                        snippet: item.snippet || _.noop,
                        items: this._parseCollection(item.items)
                    };
                }, this);
            }

            var inc = 0;
            out.next = function() {
                return ++inc;
            };
            out.current = function() {
                return inc;
            };
            out.id = new Date().getTime();

            return out;
        },

        /**
         * Parse documentation
         */
        _parseDocumentation: function(item) {
            var out = { link: '', label: '' };

            if (typeof item == 'string') {
                out.link = out.label = item;
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

            if (typeof item == 'string') {
                out.key = item;
            } else if (item instanceof Object && item.key) {
                out = item;
            }

            return out;
        },

        /**
         * Returns keyCode if target is not input
         *
         * @param {Event} e Keyboard event
         */
        _getKey: function(e) {
            var key = e.which || e.keyCode,
                node = e.target.nodeName.toLowerCase(),
                contenteditable = !!e.target.attributes.contenteditable;

            if (node != 'input' && node != 'textarea' && node != 'select' && !contenteditable) {
                return key;
            }

            return false;
        }
    };

    /**
     * Validate range value
     *
     * @param {Number} value
     * @param {Object} options
     */
    function validateRangeValue(value, options) {
        if (value < options.min) {
            return options.min;
        }

        if (value > options.max) {
            return options.max;
        }

        return value;
    }

    if (typeof TEST != 'undefined' && TEST) {
        module.exports = Makeup.prototype;
    }

    win.M = Makeup;
    win.lodash = _;
})(this);
