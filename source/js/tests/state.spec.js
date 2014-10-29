var assert = require('assert'),
    _ = require('lodash');

describe('State:', function() {
    var makeup;

    before(function() {
        makeup = require('../makeup');
    });

    describe('_setDefaultMenuState', function() {

        it('Empty state, no modules', function() {
            makeup._params = makeup._viewModel({data: {}});

            var result = makeup._setDefaultMenuState({});

            assert.equal(result.group, 0);
            assert.equal(result.module, undefined);
            assert.equal(result.typeGroup, undefined);
            assert.equal(result.type, undefined);

            after(function() {
                makeup._params.data = {};
            });
        });

        it('Empty state, no typeGroups', function() {
            makeup._params = makeup._viewModel({
                data: {
                    items: [{}]
                }
            });

            var result = makeup._setDefaultMenuState({});

            assert.equal(result.group, 0);
            assert.equal(result.module, 0);
            assert.equal(result.typeGroup, undefined);
            assert.equal(result.type, undefined);

            after(function() {
                makeup._params.data = {};
            });
        });

        it('Empty state, no types', function() {
            makeup._params = makeup._viewModel({
                data: {
                    items: [{
                        items: [{}]
                    }]
                }
            });

            var result = makeup._setDefaultMenuState({});

            assert.equal(result.group, 0);
            assert.equal(result.module, 0);
            assert.equal(result.typeGroup, 0);
            assert.equal(result.type, undefined);

            after(function() {
                makeup._params.data = {};
            });
        });

        it('Empty state, types exist', function() {
            makeup._params = makeup._viewModel({
                data: {
                    items: [{
                        items: [{
                            items: [{}]
                        }]
                    }]
                }
            });

            var result = makeup._setDefaultMenuState({});

            assert.equal(result.group, 0);
            assert.equal(result.module, 0);
            assert.equal(result.typeGroup, 0);
            assert.equal(result.type, 0);

            after(function() {
                makeup._params.data = {};
            });
        });

        it('Group in state, module exist', function() {
            makeup._params = makeup._viewModel({
                data: [{}, {
                    items: [{}]
                }]
            });

            var result = makeup._setDefaultMenuState({
                group: 1
            });

            assert.equal(result.group, 1);
            assert.equal(result.module, 0);
            assert.equal(result.typeGroup, undefined);
            assert.equal(result.type, undefined);

            after(function() {
                makeup._params.data = {};
            });
        });

        it('Group in state, typeGroup exist', function() {
            makeup._params = makeup._viewModel({
                data: [{}, {
                    items: [{
                        items: [{}]
                    }]
                }]
            });

            var result = makeup._setDefaultMenuState({
                group: 1
            });

            assert.equal(result.group, 1);
            assert.equal(result.module, 0);
            assert.equal(result.typeGroup, 0);
            assert.equal(result.type, undefined);

            after(function() {
                makeup._params.data = {};
            });
        });

        it('Group in state, type exist', function() {
            makeup._params = makeup._viewModel({
                data: [{}, {
                    items: [{
                        items: [{
                            items: [{}]
                        }]
                    }]
                }]
            });

            var result = makeup._setDefaultMenuState({
                group: 1
            });

            assert.equal(result.group, 1);
            assert.equal(result.module, 0);
            assert.equal(result.typeGroup, 0);
            assert.equal(result.type, 0);

            after(function() {
                makeup._params.data = {};
            });
        });

        it('Group and module in state', function() {
            makeup._params = makeup._viewModel({
                data: [{}, {
                    items: [{}, {}]
                }]
            });

            var result = makeup._setDefaultMenuState({
                group: 1,
                module: 1
            });

            assert.equal(result.group, 1);
            assert.equal(result.module, 1);
            assert.equal(result.typeGroup, undefined);
            assert.equal(result.type, undefined);

            after(function() {
                makeup._params.data = {};
            });
        });

        it('Full path in state', function() {
            makeup._params = makeup._viewModel({
                data: [{}, {
                    items: [{}, {
                        items: [{}, {
                            items: [{}, {}]
                        }]
                    }]
                }]
            });

            var result = makeup._setDefaultMenuState({
                group: 1,
                module: 1,
                typeGroup: 1,
                type: 1
            });

            assert.equal(result.group, 1);
            assert.equal(result.module, 1);
            assert.equal(result.typeGroup, 1);
            assert.equal(result.type, 1);

            after(function() {
                makeup._params.data = {};
            });
        });

        it('Unvalid group in state', function() {
            makeup._params = makeup._viewModel({
                data: [{}]
            });

            var result = makeup._setDefaultMenuState({
                group: 1
            });

            assert.equal(result.group, 0);
            assert.equal(result.module, undefined);
            assert.equal(result.typeGroup, undefined);
            assert.equal(result.type, undefined);

            after(function() {
                makeup._params.data = {};
            });
        });

        it('Unvalid group in state', function() {
            makeup._params = makeup._viewModel({
                data: [{}]
            });

            var result = makeup._setDefaultMenuState({
                group: 1
            });

            assert.equal(result.group, 0);
            assert.equal(result.module, undefined);
            assert.equal(result.typeGroup, undefined);
            assert.equal(result.type, undefined);

            after(function() {
                makeup._params.data = {};
            });
        });

        it('Unvalid module in state', function() {
            makeup._params = makeup._viewModel({
                data: [{
                    items: [{}]
                }]
            });

            var result = makeup._setDefaultMenuState({
                group: 0,
                module: 1
            });

            assert.equal(result.group, 0);
            assert.equal(result.module, 0);
            assert.equal(result.typeGroup, undefined);
            assert.equal(result.type, undefined);

            after(function() {
                makeup._params.data = {};
            });
        });

        it('Unvalid typeGroup in state', function() {
            makeup._params = makeup._viewModel({
                data: [{
                    items: [{
                        items: [{}]
                    }]
                }]
            });

            var result = makeup._setDefaultMenuState({
                group: 0,
                module: 0,
                typeGroup: 1
            });

            assert.equal(result.group, 0);
            assert.equal(result.module, 0);
            assert.equal(result.typeGroup, 0);
            assert.equal(result.type, undefined);

            after(function() {
                makeup._params.data = {};
            });
        });

        it('Unvalid type in state', function() {
            makeup._params = makeup._viewModel({
                data: [{
                    items: [{
                        items: [{
                            items: [{}]
                        }]
                    }]
                }]
            });

            var result = makeup._setDefaultMenuState({
                group: 0,
                module: 0,
                typeGroup: 0,
                type: 1
            });

            assert.equal(result.group, 0);
            assert.equal(result.module, 0);
            assert.equal(result.typeGroup, 0);
            assert.equal(result.type, 0);

            after(function() {
                makeup._params.data = {};
            });
        });

    });

    describe('_getStateDiff', function() {

        it('From empty state to empty state', function() {
            var result = makeup._getStateDiff({}, {});

            assert.ok(_.isEmpty(result));
        });

        it('Equal states', function() {
            var result = makeup._getStateDiff({a: 1}, {a: 1});

            assert.ok(_.isEmpty(result));
        });

        it('Field update', function() {
            var result = makeup._getStateDiff({a: 1}, {a: 2});

            assert.equal(result.a, 2);
        });

        it('Add new field', function() {
            var result = makeup._getStateDiff({a: 1}, {b: 1});

            assert.ok(!result.hasOwnProperty('a'));
            assert.equal(result.b, 1);
        });

        it('From empty state', function() {
            var result = makeup._getStateDiff({}, {a: 1, b: 0});

            assert.equal(result.a, 1);
            assert.equal(result.b, 0);
        });

        it('Type conversion', function() {
            var result = makeup._getStateDiff({}, {
                a: true,
                b: 23,
                c: "summer time"
            });

            assert.ok(result.a === "true");
            assert.ok(result.b === "23");
            assert.ok(result.c === "summer time");
        });

        it('String and number', function() {
            var result = makeup._getStateDiff({a: "1"}, {a: 1});

            assert.ok(_.isEmpty(result));
        });

        it('Number and string', function() {
            var result = makeup._getStateDiff({a: 1}, {a: "1"});

            assert.ok(_.isEmpty(result));
        });

    });


});