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


});