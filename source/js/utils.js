(function(global) {
    var Makeup = global.M || {fn: {}}; // for tests

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
        var chain = _.clone(_itemsChain).reverse(); // parent-child => child-parent

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

    if (typeof TEST != 'undefined' && TEST) {
        module.exports = Makeup.fn;
    }
})(this);
