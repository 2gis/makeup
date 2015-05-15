(function(global) {
    var Makeup = global.M || {fn: {}}; // for tests

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

    Makeup.fn._getParams = function(params) {
        if (_.isArray(params)) { // Если переданы только данные
            params = {
                data: params
            };
        }

        return _.merge({
            wrapper: $('body'),

            selectors: {
                root: '.makeup',

                searchInput: '.makeup__search-input',

                sidebar: '.makeup__aside',
                scroller: '.makeup__aside-in',
                scrollerTrack: '.makeup__aside-track',
                scrollerTrackBar: '.makeup__aside-track-bar',

                nav: '.makeup__nav',
                navList: '.makeup__nav-list',
                navListItem: '.makeup__nav-list-item',

                item: '.makeup__item',
                itemHeader: '.makeup__item-header',

                subnav: '.makeup__subnav',
                subnavItem: '.makeup__subnav-item',
                subnavLink: '.makeup__subnav-link',

                modeControl: '.makeup__mode',
                bgControl: '.makeup__bg',

                slider: '.makeup__slider',
                sliderTrack: '.makeup__slider-track',
                sliderTrackRunner: '.makeup__slider-track-runner',

                ruler: '.makeup__ruler-track',
                rulerTrack: '.makeup__ruler-track-in',
                rulerTrackActive: '.makeup__ruler-track-active',
                rulerTrackRunner: '.makeup__ruler-track-runner',
                rulerTrackPoint: '.makeup__ruler-track-point',

                statusBar: '.makeup__status',

                box: '.makeup__main',
                container: '.makeup__container-in',
                containerImage: '.makeup__container-image',
                containerImageRegular: '.makeup__container-image-regular',
                containerImageInverse: '.makeup__container-image-inverse',
                containerMarkup: '.makeup__container-markup'
            },

            modifiers: {
                baron: 'makeup__aside--baron'
            },

            menu: {
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

            renderModule: function() {},

            namingRules: internalNamingRules
        }, params);
    };

    if (typeof TEST != 'undefined' && TEST) {
        module.exports = Makeup.fn;
    }
})(this);
