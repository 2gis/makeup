(function(global) {
    var Makeup = global.M || {fn: {}}; // for tests

    Makeup.fn._itemsChain = function(chain, item) {
        item = item || this._params.data[0];

        if (!_.isArray(chain)) throw new TypeError('Makeup.fn._parents: chain must be an array');
        if (!_.isObject(item)) throw new TypeError('Makeup.fn._parents: item must be an object');

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

        if (result.length != chain.length) throw new Error('Makeup.fn._parents: parents.length must be equal to chain.length ' + result.length + ' ' + chain.length);

        return _.compact(result);
    };

    if (typeof TEST != 'undefined' && TEST) {
        module.exports = Makeup.fn;
    }
})(this);
