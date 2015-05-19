var assert = require('assert'),
    _ = require('lodash');

describe('Utils →', function() {
    var utils;

    before(function() {
        utils = require('../utils');
    });

    describe('_itemsChain →', function() {

        it('Shallow structure', function() {
            var item = {
                name: 'card',
                type: 'module'
            };
            var chain = ['card'];
            var result = utils._itemsChain(chain, item);

            assert.deepEqual(result, [item]);
        });

        it('Deep structure', function() {
            var unit = {
                name: 'firm',
                type: 'unit'
            };
            var item = {
                name: 'card',
                type: 'module',
                items: [unit]
            };
            var chain = ['card', 'firm'];
            var result = utils._itemsChain(chain, item);

            assert.deepEqual(result, [item, unit]);
        });

        it('Superdeep structure', function() {
            var unit = {
                name: 'firm',
                type: 'unit'
            };
            var item = {
                name: 'card',
                type: 'item',
                items: [unit]
            };
            var ctx = {
                name: 'context',
                type: 'context',
                items: [item]
            };
            var module = {
                name: 'zoom',
                type: 'module',
                items: [ctx]
            };
            var chain = ['zoom', 'context', 'card'];
            var result = utils._itemsChain(chain, module);
            assert.deepEqual(result, [module, ctx, item]);

            chain = ['zoom', 'context', 'card', 'firm'];
            result = utils._itemsChain(chain, module);
            assert.deepEqual(result, [module, ctx, item, unit]);
        });

        it('Exclude this', function() {
            var item = {
                name: 'card',
                type: 'module'
            };
            var bigData = {
                name: 'qweqwe',
                items: [item]
            };
            var chain = ['card'];
            var result = utils._itemsChain(chain, bigData);

            assert.deepEqual(result, [item]);
        });

        it('Empty structure', function(done) {
            var chain = ['card', 'firm'];

            try {
                utils._itemsChain(chain, 1);
            } catch (e) {
                done();
            }
        });


    });

});
