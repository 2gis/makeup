var assert = require('assert'),
    _ = require('lodash');

describe('View model:', function() {
    var makeup;

    before(function() {
        makeup = require('../makeup');
        _.extend(makeup, require('../utils'));
    });

    describe('_parseItem', function() {

        // Name and label

        it('String: "name" → { name: "name", label: "name" }', function() {
            var item = 'name',
                result = makeup._parseItem(item);

            assert.equal(result.name, item);
            assert.equal(result.label, item);
        });

        it('Empty string: "" → { name: "Untitled", label: "Untitled" }', function() {
            var result = makeup._parseItem('');

            assert.equal(result.name, 'Untitled');
            assert.equal(result.label, 'Untitled');
        });

        it('Empty object: {} → { name: "Untitled", label: "Untitled" }', function() {
            var result = makeup._parseItem({});

            assert.equal(result.name, 'Untitled');
            assert.equal(result.label, 'Untitled');
        });

        it('Object with custom label: { name: "One", label: "Two" } → { name: "One", label: "Two" }', function() {
            var item = {
                    name: 'One',
                    label: 'Two'
                },
                result = makeup._parseItem(item);

            assert.equal(result.name, 'One');
            assert.equal(result.label, 'Two');
        });

        it('Unvalid item: [Number] → { name: "Untitled", label: "Untitled" }', function() {
            var result = makeup._parseItem(1);

            assert.equal(result.name, 'Untitled');
            assert.equal(result.label, 'Untitled');
        });

        it('Type conversion: { name: true } → { name: "true", label: "true" }', function() {
            var result = makeup._parseItem({
                name: true
            });

            assert.equal(result.name, 'true');
            assert.equal(result.label, 'true');
        });


        // Snippet

        it('Has snippet: { snippet: [Function] } → { name: "Untitled", label: "Untitled", snippet: [Function] }', function() {
            var item = {
                    snippet: function() {
                        return true;
                    }
                },
                result = makeup._parseItem(item);

            assert.ok(result.snippet());
        });

    });

    describe('_parseCollection', function() {

        it('Empty array: [] → []', function() {
            var result = makeup._parseCollection([], function(item) {
                return item;
            });

            assert.deepEqual(result, []);
        });

        it('Empty elements in array: [null, undefined, 0] → []', function() {
            var result = makeup._parseCollection([null, undefined, 0], function(item) {
                return item;
            });

            assert.deepEqual(result, []);
        });

        it('One valid item: ["one"] → [{ name: "one", label: "one" }]', function() {
            var result = makeup._parseCollection(['one']);

            assert.deepEqual(result, [{ name: "one", label: "one", index: "one" }]);
        });

        it('Многовложенная структура', function() {
            var item = [{
                items: [{
                    items: [{
                        items: [{
                            items: [{
                                name: 'qwe'
                            }]
                        }]
                    }]
                }]
            }];
            var result = makeup._parseCollection(item);
            var expected = [{"items":[{"items":[{"items":[{"items":[{"name":"qwe","label":"qwe"}],"name":"Untitled","label":"Untitled"}],"name":"Untitled","label":"Untitled"}],"name":"Untitled","label":"Untitled"}],"name":"Untitled","label":"Untitled"}];

            assert.equal(result[0].items[0].items[0].items[0].items[0].name, 'qwe');
        });

    });

    describe('_parseDocumentation', function() {

        it('Empty string: "" → { link: "", label: "" }', function() {
            var result = makeup._parseDocumentation('');

            assert.ok(result instanceof Object);
            assert.equal(result.link, '');
            assert.equal(result.label, '');
        });

        it('String: "one" → { link: "one", label: "one" }', function() {
            var result = makeup._parseDocumentation('one');

            assert.ok(result instanceof Object);
            assert.equal(result.link, 'one');
            assert.equal(result.label, 'one');
        });

        it('Empty object: {} → { link: "", label: "" }', function() {
            var result = makeup._parseDocumentation({});

            assert.ok(result instanceof Object);
            assert.equal(result.link, '');
            assert.equal(result.label, '');
        });

        it('Valid object: { link: "#" } → { link: "#", label: "#" }', function() {
            var result = makeup._parseDocumentation({
                link: '#'
            });

            assert.ok(result instanceof Object);
            assert.equal(result.link, '#');
            assert.equal(result.label, '#');
        });

        it('Valid object with custom label: { link: "#", label: "one" } → { link: "#", label: "one" }', function() {
            var result = makeup._parseDocumentation({
                link: '#',
                label: 'one'
            });

            assert.ok(result instanceof Object);
            assert.equal(result.link, '#');
            assert.equal(result.label, 'one');
        });

        it('Valid object with modifier: { link: "#", modifier: "one" } → { link: "#", label: "#", modifier: "one" }', function() {
            var result = makeup._parseDocumentation({
                link: '#',
                modifier: 'one'
            });

            assert.ok(result instanceof Object);
            assert.equal(result.link, '#');
            assert.equal(result.label, '#');
            assert.equal(result.modifier, 'one');
        });

    });

    describe('_parseMeta', function() {

        it('String: "one" → { key: "one" }', function() {
            var result = makeup._parseMeta('one');

            assert.ok(result instanceof Object);
            assert.equal(result.key, 'one');
            assert.equal(result.value, undefined);
        });

        it('Empty object: {} → {}', function() {
            var result = makeup._parseMeta({});

            assert.ok(result instanceof Object);
            assert.equal(result.key, undefined);
            assert.equal(result.value, undefined);
        });

        it('Object with key: { key: "one" } → { key: "one" }', function() {
            var result = makeup._parseMeta({
                key: 'one'
            });

            assert.ok(result instanceof Object);
            assert.equal(result.key, 'one');
            assert.equal(result.value, undefined);
        });

        it('Object with key and value: { key: "one", value: "two" } → { key: "one", value: "two" }', function() {
            var result = makeup._parseMeta({
                key: 'one',
                value: 'two'
            });

            assert.ok(result instanceof Object);
            assert.equal(result.key, 'one');
            assert.equal(result.value, 'two');
        });

        it('Unvalid arg: [Number|undefined|Bool] → {}', function() {
            assert.ok(makeup._parseMeta(0) instanceof Object);
            assert.ok(makeup._parseMeta(1) instanceof Object);
            assert.ok(makeup._parseMeta(undefined) instanceof Object);
            assert.ok(makeup._parseMeta(true) instanceof Object);
            assert.ok(makeup._parseMeta(false) instanceof Object);
        });

    });

    describe('_viewModel.', function() {
        var deep = {
            data: {
                items: [{
                    types: [{
                        items: ['foo']
                    }]
                }]
            }
        };

        it.skip('Empty object: {} → [{ label: "Blocks", items: [] }]', function() {
            var result = makeup._viewModel({data: {}}).data;

            assert.ok(result instanceof Array);
            assert.equal(result.length, 1);
            assert.equal(result[0].label, 'Blocks', 'Название группы по умолчанию для случая с одной группой');
        });

        it('Array: [{}, {}]', function() {
            var result = makeup._viewModel({data: [{}, {}]}).data;

            assert.ok(result instanceof Array);
            assert.equal(result.length, 2);
            assert.equal(result[0].label, 'Untitled group', 'Название группы по умолчанию для случая с несколькими группами');
        });

        it('Deep. First level', function() {
            var result = makeup._viewModel(deep).data;

            // First level
            assert.ok(result instanceof Array);
            assert.equal(result.length, 1);
        });

        it('Deep. Second level', function() {
            var result = makeup._viewModel(deep).data[0].items;

            // Second level
            assert.ok(result instanceof Array);
            assert.equal(result.length, 1);
        });

        it('Deep. Third level', function() {
            var result = makeup._viewModel(deep).data[0].items[0];

            // Third level
            assert.ok(result.items instanceof Array);
            assert.equal(result.items.length, 1);
            assert.equal(result.name, 'Untitled');
            assert.equal(result.label, 'Untitled');
        });

        it('Deep. Fourth level', function() {
            var result = makeup._viewModel(deep).data[0].items[0].items[0];

            // Fourth level
            assert.ok(result.items instanceof Array);
            assert.equal(result.items.length, 1);
            assert.equal(result.name, 'Untitled');
            assert.equal(result.label, 'Untitled');
        });

        it('Deep. Fifth level', function() {
            var result = makeup._viewModel(deep).data[0].items[0].items[0].items[0];

            // Fifth level
            assert.equal(result.name, 'foo');
            assert.equal(result.label, 'foo');
        });

    });


});