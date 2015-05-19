var assert = require('assert'),
    _ = require('lodash');

describe('Render module:', function() {
    var makeup;

    before(function() {
        makeup = require('../makeup');

        // var result;

        // Mock jQuery
        $ = function() {
            return {
                attr: function() {}
            }
        };

        // Mock client-side only method
        makeup._loadImage = function() {};
    });

    describe('User callback →', function() {

        describe.skip('Module object →', function() {

            before(function() {

                // Makeup data
                makeup._params = makeup._viewModel({
                    selectors: {
                        container: '.container',
                        containerImage: '.container__image',
                        containerMarkup: '.container__markup'
                    },
                    data: {
                        items: [{
                            name: 'Module',
                            documentation: 'link',
                            image: 'image-module',
                            data: 'data-module',
                            snippet: function() {
                                return 'module';
                            },
                            items: [{
                                items: [{
                                    name: 'Type',
                                    image: 'type-image',
                                    data: 'type-data',
                                    snippet: function() {
                                        return 'type';
                                    },
                                }]
                            }]
                        }]
                    }
                });

                // User callback
                makeup._params.renderModule = function() {
                    result = arguments;
                };
            });

            it('Variables types', function() {
                makeup._renderModule(0, 0, 0, 0);

                assert.ok(result[0] instanceof Object, 'Module in callback is an object');
                assert.equal(typeof result[1], 'number', 'GroupId is a number');
                assert.equal(typeof result[2], 'number', 'ModuleId is a number');
                assert.equal(typeof result[3], 'number', 'TypeGroupId is a number');
                assert.equal(typeof result[4], 'number', 'TypeId is a number');
                assert.equal(result[1], 0, 'GroupId is a number');
                assert.equal(result[2], 0, 'ModuleId is a number');
                assert.equal(result[3], 0, 'TypeGroupId is a number');
                assert.equal(result[4], 0, 'TypeId is a number');

                after(reset);
            });

            it('Module name and label', function() {
                makeup._renderModule(0, 0, 0, 0);

                var module = result[0];

                assert.equal(module.modulename, 'Module');
                assert.equal(module.modulelabel, 'Module');

                after(reset);
            });

            it('Documentation', function() {
                makeup._renderModule(0, 0, 0, 0);

                var module = result[0];

                assert.ok(module.hasOwnProperty('documentation'));
                assert.equal(module.documentation[0].link, 'link');

                after(reset);
            });

            it('Image', function() {
                makeup._renderModule(0, 0, 0, 0);

                var module = result[0];

                assert.ok(module.hasOwnProperty('image'));
                assert.equal(module.image, 'type-image');

                after(reset);
            });

            it('Data', function() {
                makeup._renderModule(0, 0, 0, 0);

                var module = result[0];

                assert.ok(module.hasOwnProperty('data'));
                assert.equal(module.data, 'type-data');

                after(reset);
            });

            it('Snippet', function() {
                makeup._renderModule(0, 0, 0, 0);

                var module = result[0];

                assert.ok(module.hasOwnProperty('snippet'));
                assert.equal(typeof module.snippet, 'function');
                assert.equal(module.snippet(), 'type');

                after(reset);
            });

            after(function() {
                makeup._params = {};
            });

        });

        describe.skip('Snippet →', function() {

            before(function() {

                result = undefined;

                // Makeup data
                makeup._params = makeup._viewModel({
                    selectors: {
                        container: '.container',
                        containerImage: '.container__image',
                        containerMarkup: '.container__markup'
                    },
                    data: {
                        snippet: function() {
                            if (result) {
                                result = [];
                            }
                            result.push('group');
                        },
                        items: [{
                            name: 'Module',
                            snippet: function() {
                                result.push('module');
                            },
                            items: [{
                                snippet: function() {
                                    result.push('typeGroup');
                                },
                                items: [{
                                    snippet: function() {
                                        result.push('type');
                                    }
                                }]
                            }]
                        }]
                    },
                    renderModule: function() {}
                });

            });

            beforeEach(function() {
                result = [];
            });

            it('Snippet called, if group exists', function() {
                makeup._renderModule(0);

                assert.equal(result.length, 1, 'Snippet called');
                assert.equal(result[0], 'group', 'Snipped for group is called');
            });

            it('Snippet called, if group and module exist', function() {
                makeup._renderModule(0, 0);

                assert.equal(result.length, 2, 'Snippet called');
                assert.equal(result[1], 'module', 'Snipped for group is called');
            });

            it('Snippet called, if group, module and typeGroup exist', function() {
                makeup._renderModule(0, 0, 0);

                assert.equal(result.length, 3, 'Snippet called');
                assert.equal(result[2], 'typeGroup', 'Snipped for group is called');
            });

            it('Snippet called, if group, module, typeGroup and type exist', function() {
                makeup._renderModule(0, 0, 0, 0);

                assert.equal(result.length, 4, 'Snippet called');
                assert.equal(result[3], 'type', 'Snipped for group is called');
            });



        });

    });

    function reset() {
        result = undefined;
    }

});