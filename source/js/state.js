/**
 * The State
 *
 * @requires jQuery
 */
(function(global) {
    var Makeup = global.Makeup || {fn: {}}; // for tests
    var _state;
    var $ = Makeup.$;
    var _ = Makeup._;
    var Handlebars = Makeup.Handlebars;

    if (typeof TEST != 'undefined' && TEST) {
        module.exports = State;
        _ = require('lodash');
    }

    Makeup.fn._State = State;

    function State(params) {
        if (typeof _state == 'object') { // @TODO is singleton needed here?
            return _state;
        } else {
            _state = this;
        }

        _state._init(params);
    }

    var codec = {
        chain: {
            priority: 10,
            serialize: function(arr) {
                return arr.join('~');
            },
            parse: function(str) {
                return str.split('~');
            }
        }
    };

    var validators = {
        transparency: function(value) {
            return Number(value).toFixed(2);
        },
        all: function(value) {
            if (_.isObject(value)) {
                return value;
            } else {
                return String(value);
            }
        }
    };

    State.prototype = {
        constructor: State,

        _init: function(params) {
            this.actualState = this._path2object(this._getHash()) || {};
            this._validateState(this.actualState);

            this.wantedState = _.cloneDeep(this.actualState);
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

            var pairs = _.map(object, function(value, key) {
                return {
                    key: key,
                    value: value,
                    priority: codec[key] && codec[key].priority || 0
                };
            });
            pairs = _.sortBy(pairs, function(pair) {
                return -pair.priority;
            });

            _.each(pairs, function(pair) {
                var value = pair.value;
                var key = pair.key;

                if (codec[key]) {
                    value = codec[key].serialize(value);
                }

                value = encodeURIComponent(value);

                path = path + '/' + encodeURIComponent(key) + '/' + value;
            });

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
         * Sets state state according to `state`,
         *
         * @param {Object} state Key-value object
         */
        _setActualState: function(state) {
            return this.actualState = _.clone(state);
        },

        _validateState: function(state) {
            _.each(state, function(value, key) {
                if (validators[key]) {
                    state[key] = validators[key](value);
                }

                state[key] = validators.all(state[key]);
            });

            return state;
        },

        /**
         * Public methods
         */

        /**
         * Sets state according to `params`, but didnt push it
         *
         * @param {Object} diff
         *
         * @returns {Object} State object
         */
        want: function(diff) {
            _.extend(this.wantedState, diff);
            this._validateState(this.wantedState);

            return this.wantedState;
        },

        /**
         * Sets accumulated wanted state to actual state
         */
        push: function() {
            var diff = this.diff();

            if (diff) {
                this._setActualState(this.wantedState);
                this._setHash(this._object2path(this.actualState));

                if (typeof window != 'undefined') {
                    $(window).trigger({
                        type: 'statechange',
                        state: _.cloneDeep(this.actualState),
                        diff: _.cloneDeep(diff)
                    });
                }
            } else {
                // do nothing
            }
        },

        /**
         * Sets state according to `params`,
         * changes hash value,
         * triggers 'statechange' event
         *
         * @param {Object} diff Key-value object
         *
         * @returns {Object} State object
         */
        set: function(diff) {
            _.extend(this.wantedState, diff);
            this._validateState(this.wantedState);
            this.push();

            return this.actualState;
        },

        /**
         * Returns state value by a key
         *
         * @param {[String]} key The key
         *
         * @returns {String|Object} The value
         */
        get: function(key) {
            if (!key) {
                return this.actualState;
            }

            return this.actualState[key];
        },

        /**
         * State comparator
         *
         * @param {Object} oldState first state for comparison
         * @param {Object} [newState] second state for comparison (actual state by default)
         * @returns {Object} Difference between oldState and newState
         */
        diff: function(oldState, newState) {
            oldState = oldState || this.actualState;
            newState = newState || this.wantedState;

            var ret = _.reduce(newState, function(diff, value, key) {
                if (!_.isEqual(value, oldState[key])) {
                    diff[key] = value;
                }

                return diff;
            }, {}, this);

            return _.isEmpty(ret) ? undefined : ret;
        }
    };

    return State;
})(this);
