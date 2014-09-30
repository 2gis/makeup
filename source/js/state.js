/**
 * The State
 *
 * @requires jQuery
 */
var State = (function() {
    var state;

    function State(params) {
        if (typeof state == 'object') {
            return state;
        }
        else {
            state = this;
        }

        state._init(params);
    }

    State.prototype = {
        constructor: State,

        _init: function(params) {
            this._params = this._path2object(this._getHash()) || {};

            this._bindEventListeners();

            this.set(params);
        },

        _bindEventListeners: function() {
            var state = this,
                jqWindow = $(window);

            jqWindow.on('hashchange.Makeup', function() {
                state._setParams(state._path2object(state._getHash()));

                jqWindow.trigger({
                    type: 'statechange',
                    state: state._params
                });
            });
        },

        /**
         * Converts slash-splitted key-value path to object
         *
         * @param {String} path The path (Like: key1/value1/key2/value2)
         *
         * @returns {Object} Object
         */
        _path2object: function(path) {
            var object = {},
                pathParts = path.split('/');

            if (pathParts.length > 1) {
                var key,
                    value;

                for (var i = 1; i < pathParts.length; i+=2) {
                    key = pathParts[i];
                    value = pathParts[i + 1];

                    if (key.length) {
                        object[key] = decodeURIComponent(value);
                    }
                }
            }

            return object;
        },

        /**
         * Converts object to key-value path
         *
         * @param {Object} object Key-value object
         *
         * @returns {String} path The path, like: key1/value1/key2/value2
         */
        _object2path: function(object) {
            var path = '!';

            for (var key in object) {
                path = path + '/' + encodeURIComponent(key) + '/' + encodeURIComponent(object[key]);
            }

            return path;
        },

        /**
         * Sets page location hash
         *
         * @param {String} hash
         */
        _setHash: function(hash) {
            window.location.hash = hash;
        },

        /**
         * Returns page location hash
         *
         * @returns {String} The hash string
         */
        _getHash: function() {
            var hash = window.location.hash;

            if (hash.length) {
                return hash.split('!')[1];
            }

            return '';
        },

        /**
         * Sets state params according to `params`,
         *
         * @param {Object} params Key-value object
         */
        _setParams: function(params) {
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    this._params[key] = params[key];
                }
            }
        },

        /**
         * Sets state according to `params`,
         * changes hash value,
         * triggers 'statechange' event
         *
         * @param {Object} params Key-value object
         *
         * @returns {Object} State object
         */
        set: function(params) {
            this._setParams(params);
            this._setHash(this._object2path(this._params));

            var jqWindow = $(window);

            jqWindow.trigger({
                type: 'statechange',
                state: this._params
            });

            return this._params;
        },

        /**
         * Returns state value by a key
         *
         * @param {[String]} key The key
         *
         * @returns {String|Object} The value
         */
        get: function(key) {
            if (typeof key == 'undefined') {
                return this._params;
            }

            return (this._params.hasOwnProperty(key)) ? this._params[key] : null;
        }
    };

    return State;
})();
