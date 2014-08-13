function State(params) {
    var state;

    if (this instanceof State) {
        state = this;
    } else {
        state = createObject(State.prototype);
    }

    state._init(params);

    return state;
}

State.prototype = {
    constructor: State,

    _init: function(params) {
        this._params = this._path2object(this._getHash()) || {};

        this._bindListeners();

        this.set(params);
    },

    _bindListeners: function() {
        var state = this,

            onhashchangeHandler = window.onhashchange;

        window.onhashchange = function() {
            if (onhashchangeHandler instanceof Function) {
                onhashchangeHandler.call(window);
            }

            state.set(state._path2object(state._getHash()));
        };
    },

    /**
     * Converts slash-slpitted key-value path to object
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
     * @param {String} path The path (Like: key1/value1/key2/value2)
     *
     * @returns {Object} Object
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
     * Sets state according to `params`
     *
     * @param {Object} params Key-value object
     *
     * @returns {Object} State object
     */
    set: function(params) {
        _.assign(this._params, params);

        this._setHash(this._object2path(this._params));

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

        return (key in this._params) ? this._params[key] : null;
    }
};
