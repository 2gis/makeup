(function(global) {
    var Makeup = global.Makeup || {fn: {}}; // for tests
    var $ = Makeup.$;
    var _ = Makeup._;
    var Handlebars = Makeup.Handlebars;

    if (typeof TEST != 'undefined' && TEST) {
        module.exports = Makeup.fn;
        _ = require('lodash');
    }

    Makeup.fn._itemsChain = function(chain, item) {
        item = item || this._params.data[0];

        if (!_.isArray(chain)) throw new TypeError('Makeup.fn._itemsChain: chain must be an array');
        if (!_.isObject(item)) throw new TypeError('Makeup.fn._itemsChain: item must be an object');

        var result = [];
        var i = 0;

        if (item.name == chain[i]) {
            result.push(item);
            i++;
        }

        while (item) {
            item = _.find(item.items, function(item) {
                return item.name == chain[i];
            });
            if (item) {
                result.push(item);
                i++;
            }
        }

        if (result.length != chain.length) throw new Error('Makeup.fn._itemsChain: parents.length must be equal to chain.length ' + result.length + ' ' + chain.length);

        return _.compact(result);
    };

    /**
     * Mapping key value (item[key]) for all items in asc order
     * [{type: 'asd'}, {type: 'qwe'}], 'type' => ['asd', 'qwe']
     * [{type: {mode: 'asd'}}, {type: mode:{'qwe'}}], ['type', 'mode'] => ['asd', 'qwe']
     */
    Makeup.fn._map = function(_itemsChain, key) {
        var chain = _.clone(_itemsChain);

        return _.compact(_.map(chain, function(item) {
            if (_.isString(key)) {
                return item[key];
            } else if (_.isArray(key)) {
                var value = item;
                _.each(key, function(str) {
                    if (value) value = value[str];
                });
                return value;
            }
        }));
    };

    /**
     * Trying to find closest to most descendant item key value (item[key])
     */
    Makeup.fn._find = function(_itemsChain, key) {
        var chain = _.clone(_itemsChain).reverse(); // parent-child => child-parent

        var thatItem = _.find(chain, function(item) {
            return item[key];
        });

        if (thatItem) return thatItem[key];
    };

    /**
     * Парсит абстрактный массив данных (Array of items)
     */
    Makeup.fn._parseCollection = function(arr, func) {
        var handler = func || _.bind(this._parseItem, this);

        return _(arr).compact().map(handler, this).value();
    };

    /**
     * Parse item
     *
     * @param {Object|String} item
     * @returns {Object}
     */
    Makeup.fn._parseItem = function(item) {
        var out = {},
            untitled = 'Untitled';


        if (typeof item == 'string') {
            out.name = item || untitled;
        } else if (item instanceof Object) {
            var children = item.items || item.types,
                documentation = item.documentation,
                meta = item.meta;

            out = item;

            if (typeof out.name != "undefined") {
                out.name = String(out.name) || untitled;
            } else {
                out.name = untitled;
            }

            // Documentation
            if (documentation) {
                if (documentation instanceof Array && documentation.length) {
                    out.documentation = this._parseCollection(documentation, this._parseDocumentation);
                } else if (typeof documentation == 'string' || documentation instanceof Object) {
                    out.documentation = [this._parseDocumentation(documentation)];
                }
            }

            // Snippet
            out.snippet = item.snippet || _.noop;

            // Meta
            if (item.meta && item.meta instanceof Array && item.meta.length) {
                out.meta = this._parseCollection(meta, this._parseMeta);
            }

            // Children
            if (children && children instanceof Array && children.length) {
                out.items = this._parseCollection(children);
            }
        }

        if (!out.name || out.name == '') {
            out.name = untitled;
        }

        out.label = out.label || out.name || untitled;

        // Item name for search ("Hello World 2" --> "helloworld2")
        out.index = encodeURIComponent(out.label.toLowerCase().replace(/\s/g, ''));

        return out;
    };

    Makeup.fn._ie = function() {
        var nav = navigator.userAgent.toLowerCase();

        return (nav.indexOf('msie') != -1) ? parseInt(nav.split('msie')[1]) : false;
    };

    /**
     * @param {string} str
     * @returns {string}
     */
    Makeup.fn._trimString = function(str) {
        return str.replace(/^\s+|\s+$/g, '');
    };

    /**
     * @param {string} str
     * @returns {string}
     */
    Makeup.fn._escapeHTML = function(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
})(this);
