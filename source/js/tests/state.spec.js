var assert = require('assert'),
    _ = require('lodash');

describe('State:', function() {
    var makeup;
    var state;

    before(function() {
        makeup = require('../makeup');
        var State = require('../state');
        state = new State();
    });

    describe('diff', function() {

        it('From empty state to empty state', function() {
            var result = state.diff({}, {});

            assert.ok(_.isEmpty(result));
        });

        it('Equal states', function() {
            var result = state.diff({a: 1}, {a: 1});

            assert.ok(_.isEmpty(result));
        });

        it('Field update', function() {
            var result = state.diff({a: 1}, {a: 2});

            assert.equal(result.a, 2);
        });

        it('Add new field', function() {
            var result = state.diff({a: 1}, {b: 1});

            assert.ok(!result.hasOwnProperty('a'));
            assert.equal(result.b, 1);
        });

        it('From empty state', function() {
            var result = state.diff({}, {a: 1, b: 0});

            assert.equal(result.a, 1);
            assert.equal(result.b, 0);
        });

        it('Array in values', function() {
            var diff = state.diff({a: [1,2]}, {a: [1]});

            assert.deepEqual(diff, {a: [1]});
        });

    });


});