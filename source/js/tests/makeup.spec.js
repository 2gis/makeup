var assert = require('assert');

describe('Makeup', function() {
    var makeup,
        prot;

    before(function() {
        makeup = require('../makeup');
    });

    var internationalDelimiters = {
        be: '_',
        bm: '--',
        em: '--',
        mm: '--'
    };

    var russianDelimiters = {
        be: '__',
        bm: '_',
        em: '_',
        mm: '_'
    };

    describe('_detectBEM', function() {
        it('Russian block', function() {
            var delimiters = russianDelimiters;

            var element = {
                classList: ['bl0ck-mED-_mod', 'bl0ck-mED-_key-_value', 'bl0ck-mED-']
            };

            var expected = {
                type: 'block',
                name: 'bl0ck-mED-',
                blockName: 'bl0ck-mED-',
                elementName: null
            };

            var result = makeup._detectBEM(element, delimiters);

            assert.deepEqual(result, expected);
        });

        it('International element', function() {
            var delimiters = internationalDelimiters;

            var element = {
                classList: ['--qwe', 'block_elementWOWOWO123', '--asd']
            };

            var expected = {
                type: 'element',
                name: 'block_elementWOWOWO123',
                blockName: 'block',
                elementName: 'block_elementWOWOWO123'
            };

            var result = makeup._detectBEM(element, delimiters);

            assert.deepEqual(result, expected);
        });
    });

    describe('_parseMod', function() {
        it('Russian block', function() {
            var delimiters = russianDelimiters;

            var element = {
                classList: ['bl0ck-mED-_mod', 'bl0ck-mED-_key-_value', 'bl0ck-mED-']
            };

            var expected = {
                mod: 'true',
                'key-': 'value'
            };
            var result = makeup._parseMod(element, delimiters);

            assert.deepEqual(result, expected);
        });

        it('Russian element', function() {
            var delimiters = russianDelimiters;

            var element = {
                classList: ['block-W__p23', '_mod3', '_aaa_90']
            };

            var expected = {
                mod3: 'true',
                aaa: '90'
            };
            var result = makeup._parseMod(element, delimiters);

            assert.deepEqual(result, expected);
        });

        it('Bevis russian block', function() {
            var delimiters = _.clone(russianDelimiters);

            var element = {
                classList: ['_active', 'blockBig-ood', '_st-te_reallyOpen']
            };

            var expected = {
                active: 'true',
                'st-te': 'reallyOpen'
            };
            var result = makeup._parseMod(element, delimiters, {bevis: true});

            assert.deepEqual(result, expected);
        });

        it('Bevis russian element', function() {
            var delimiters = _.clone(russianDelimiters);
            var element = {
                classList: ['_active', 'blockBig__elementGood', '_st-te_reallyOpen']
            };

            var expected = {
                active: 'true',
                'st-te': 'reallyOpen'
            };
            var result = makeup._parseMod(element, delimiters, {bevis: true});

            assert.deepEqual(result, expected);
        });

        it('International element', function() {
            var delimiters = _.clone(internationalDelimiters);

            var element = {
                classList: ['c0mponenT-good_e1em', 'c0mponenT-good_e1em--active', 'c0mponenT-good_e1em--open--c_losed']
            };

            var expected = {
                active: 'true',
                'open': 'c_losed'
            };
            var result = makeup._parseMod(element, delimiters);

            assert.deepEqual(result, expected);
        });
    });
});