(function(global) {
    var Makeup = global.Makeup || {fn: {}}; // for tests
    var $ = Makeup.$;
    var _ = Makeup._;
    var Handlebars = Makeup.Handlebars;

    if (typeof TEST != 'undefined' && TEST) {
        module.exports = Makeup;
    }

    var internationalDelimiters = {
        be: '__',
        bm: '--',
        em: '--',
        mm: '--'
    };

    var russianDelimiters = {
        be: '__',
        bm: '_',
        em: '_',
        mm: '_'
    };

    var internalNamingRules = {
        delimiters: {
            be: '__',
            bm: '--',
            em: '--',
            mm: '-'
        },
        bevis: false,
        logic: true
    };

    // @TODO zhest'
    function validateSize(elem, item, maxWidth) {

        var width = $(elem).outerWidth(true);
        var height = $(elem).outerHeight(true);

        if (_.isNumber(width) && _.isNumber(height) && width * height) {
            item.width = Math.min(width, maxWidth);
            return item;
        }
    }

    Makeup.fn._getParams = function(params) {
        if (!params) {
            params = this.detectBlocks();
        }

        if (_.isArray(params)) { // Если переданы только данные
            if (_.isString(params[0])) {
                var domMode = !_.has(this, '_templating');
                var maxWidth = 900;

                params = {
                    items: _.compact(_.map(params, function(str, i) {
                        var item = {
                            name: str,
                            type: 'block'
                        };

                        var elements = $('.' + str);

                        if (!elements.length) return;

                        if (domMode) {
                            if (elements.length > 1) {
                                var items = _.compact(_.map(elements, function(elem, index) {
                                    return validateSize(elem, {
                                        html: elem.outerHTML,
                                        name: str + (index + 1)
                                    }, maxWidth);
                                }));

                                if (items.length) {
                                    item.items = items;
                                }
                            }
                        }

                        if (!item.items) {
                            item = validateSize(elements[0], item, maxWidth);
                        }

                        return item;
                    }))
                };
            }
        }

        if (params.items) {
            params = {
                data: params
            };
        }

        var controlsPrefix = '.makeup[data-makeup=true] > .makeup__menu ';

        var out = _.merge({
            wrapper: $('body'),

            selectors: {
                root: '.makeup',

                searchInput:    '.makeup__search-input',

                sidebar:        '.makeup__aside',
                sidebarToggler: controlsPrefix + '.makeup__sidebarToggler',
                scroller:       '.makeup__aside-in',
                scrollerTrack:  '.makeup__aside-track',
                scrollerTrackBar: '.makeup__aside-track-bar',

                nav:            '.makeup__nav',
                navList:        '.makeup__nav-list',
                navListItem:    '.makeup__nav-list-item',

                item:           '.makeup__item',
                itemHeader:     '.makeup__item-header',

                modeControl:        controlsPrefix + '.makeup__mode',
                bgControl:          controlsPrefix + '.makeup__bg',

                slider:             controlsPrefix + '.makeup__slider',
                sliderTrack:        '.makeup__slider-track',
                sliderTrackRunner:  '.makeup__slider-track-runner',

                ruler:              '.makeup[data-makeup=true] > .makeup__main > .makeup__ruler > .makeup__ruler-track',
                rulerTrack:         '.makeup__ruler-track-in',
                rulerTrackActive:   '.makeup__ruler-track-active',
                rulerTrackRunner:   '.makeup__ruler-track-runner',
                rulerTrackPoint:    '.makeup__ruler-track-point',

                smiley:             '.makeup__smiley',
                full:               '.makeup__full',

                statusBar:              '.makeup__status',

                box:                    '.makeup__main',
                container:              '.makeup__container-in',
                containerImage:         '.makeup__container-image',
                containerImageRegular:  '.makeup__container-image-regular',
                containerImageInverse:  '.makeup__container-image-inverse',
                containerMarkup:        '.makeup__container-markup'
            },

            modifiers: {
                baron: 'makeup__aside--baron'
            },

            sidebar: {
                tooltip: 'Toggle menu',
                checked: true
            },

            search: {
                placeholder: ''
            },

            mode: {
                label: 'Mode',

                items: [
                    {
                        tooltip: 'Image',
                        value: '1'
                    },
                    {
                        tooltip: 'Markup',
                        value: '2',
                        checked: true
                    },
                    {
                        tooltip: 'Markup and image',
                        value: '3',
                    },
                    {
                        tooltip: 'Markup and inversed image',
                        value: '4',
                    }
                ]
            },

            background: {
                label: 'Background',

                items: [
                    {
                        tooltip: 'Gray',
                        value: 'color',
                        checked: true
                    },
                    {
                        tooltip: 'Transparency grid',
                        value: 'transparency'
                    }
                ]
            },

            transparency: {
                label: 'Transparency',

                slider: {
                    min: 0,
                    max: 1,
                    value: 1
                }
            },

            zoom: {
                label: 'Zoom',

                slider: {
                    min: 1,
                    max: 4,
                    value: 1
                }
            },

            ruler: {
                h: {
                    type: 'ruler',
                    name: 'makeup-ruler-h',

                    slider: {
                        min: 0,
                        max: 2000,
                        value: 400
                    }
                },
                v: {
                    type: 'ruler',
                    name: 'makeup-ruler-v',

                    slider: {
                        min: 0,
                        max: 1000,
                        step: 10
                    }
                }
            },

            smiley: {
                tooltip: 'Smiley styles on markup container',
                checked: false
            },

            full: {
                tooltip: 'Try your markup with full content',
                checked: false
            },

            renderModule: function() {},

            namingRules: internalNamingRules
        }, params);

        var i = 0;
        /**
         * Tree traversal — make uniq ids & build chains
         */
        function traverseItems(item, parent, index) {
            if (!item) return;

            if (_.isArray(item)) {
                return _.each(item, function(item, index) {
                    traverseItems(item, parent, index);
                });
            }

            item._id = parent._id + (parent._id ? '-' : '') + index; // ids like "#1-0-0-4"
            item._chain = parent._chain.slice(0).concat(item.name || 'Untitled'); // slice to clone array

            item._state = {};
            item.type = item.type || 'block';

            traverseItems(item.items, item, index);
        }

        traverseItems(out.data && out.data.items, {
            _id: '',
            _chain: []
        }, 0);

        return out;
    };

    Makeup.fn._templating = function(params) {
        var node = $('.' + params.block);

        if (node.length) {
            return node[0].outerHTML;
        }

        return '418. I am a teapot.';
    };

    if (typeof TEST != 'undefined' && TEST) {
        module.exports = Makeup.fn;
    }
})(this);
