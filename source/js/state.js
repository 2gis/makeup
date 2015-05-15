/**
 * The State
 *
 * @requires jQuery
 */
var State = (function(win) {
    var state;

    function State(params) {
        if (typeof state == 'object') { // @TODO is singleton needed here?
            return state;
        } else {
            state = this;
        }

        state._init(params);
    }

    codec = {
        chain: {
            serialize: function(arr) {
                return arr.join('~');
            },
            parse: function(str) {
                return str.split('~');
            }
        }
    };

    State.prototype = {
        constructor: State,

        _init: function(params) {
            this._params = this._path2object(this._getHash()) || {};

            if (typeof window != 'undefined') {
                this._bindEventListeners();
            }

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
                    key = decodeURIComponent(pathParts[i]);
                    value = decodeURIComponent(pathParts[i + 1]);

                    if (codec[key]) {
                        value = codec[key].parse(value);
                    }

                    object[key] = value;
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
                var value = object[key];

                if (codec[key]) {
                    value = codec[key].serialize(value);
                }

                value = encodeURIComponent(value);

                path = path + '/' + encodeURIComponent(key) + '/' + value;
            }

            return path;
        },

        /**
         * Sets page location hash
         *
         * @param {String} hash
         */
        _setHash: function(hash) {
            if (typeof window == 'undefined') return '';

            return window.location.hash = hash;
        },

        /**
         * Returns page location hash
         *
         * @returns {String} The hash string
         */
        _getHash: function() {
            if (typeof window == 'undefined') return '';

            var hash = window.location.hash;

            if (hash.length) {
                return hash.replace(/^!/, '');
            }

            return '';
        },

        /**
         * Sets state params according to `params`,
         *
         * @param {Object} params Key-value object
         */
        _setParams: function(params) {
            _.extend(this._params, params);
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

            if (typeof window != 'undefined') {
                $(window).trigger({
                    type: 'statechange',
                    state: this._params
                });
            }

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
        },

        /**
         * State comparator
         *
         * @param {Object} oldState first state for comparison
         * @param {Object} [newState] second state for comparison (actual state by default)
         * @returns {Object} Difference between oldState and newState
         */
        diff: function(oldState, newState) {
            return _.reduce(newState, function(diff, value, key) {
                if (!_.isEqual(value, oldState[key])) {
                    diff[key] = value;
                }

                return diff;
            }, {}, this);
        }
    };

    if (typeof TEST != 'undefined' && TEST) {
        module.exports = State;
    }

    return State;
})(this);
