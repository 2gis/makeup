var assert = require('assert');

describe('Makeup → mod', function() {
    var makeup,
        prot;

    before(function() {
        makeup = require('../mod').fn;
    });

    var internationalNamingRules = {
        delimiters: {
            be: '_',
            bm: '--',
            em: '--',
            mm: '--'
        },
        bevis: false,
        logic: true
    };

    var russianNamingRules = {
        delimiters: {
            be: '__',
            bm: '_',
            em: '_',
            mm: '_'
        },
        bevis: false,
        logic: true,
    };

    var internalNamingRules = {
        delimiters: {
            be: '__',
            bm: '--',
            em: '--',
            mm: '-'
        },
        bevis: false,
        logic: true
    };

    describe('_composeClassName', function() {
        it('Block', function() {
            var params = {
                block: 'block'
            };

            var result = makeup._composeClassName(params, russianNamingRules);
            var expected = 'block';

            assert.equal(result, expected, 'Должен вернуть просто имя блока');
        });

        it('Element', function() {
            var params = {
                block: 'block',
                element: 'element',
                bevis: true,
                logic: true
            };

            var result = makeup._composeClassName(params, russianNamingRules);
            var expected = 'block__element';

            assert.equal(result, expected, 'Должен вернуть имя элемента');
        });

        it('Modifier logic', function() {
            var rules = _.clone(russianNamingRules);
            rules.logic = true;
            var params = {
                block: 'block',
                element: 'element',
                modKey: 'active',
                modValue: true
            };

            var result = makeup._composeClassName(params, rules);
            var expected = 'block__element_active';

            assert.equal(result, expected, 'Должен вернуть модификатор по ключу но с элементом');
        });

        it('Modifier bevis', function() {
            var rules = _.clone(russianNamingRules);
            rules.bevis = true;
            rules.logic = false;
            var params = {
                block: 'block',
                element: 'element',
                modKey: 'active',
                modValue: true
            };

            var result = makeup._composeClassName(params, rules);
            var expected = '_active_true';

            assert.equal(result, expected, 'Должен вернуть составной модификатор но без элемента');
        });

        it('Remove modifier false', function() {
            var rules = _.clone(russianNamingRules);
            rules.logic = true;
            var params = {
                block: 'block',
                element: 'element',
                modKey: 'active',
                modValue: false
            };

            var result = makeup._composeClassName(params, rules);
            var expected = '';

            assert.equal(result, expected, 'Должен вернуть пустую строку');
        });

        it('Remove modifier undefined', function() {
            var rules = _.clone(russianNamingRules);
            rules.logic = true;
            var params = {
                block: 'block',
                element: 'element',
                modKey: 'active'
                // modValue: false // undefined
            };

            var result = makeup._composeClassName(params, rules);
            var expected = '';

            assert.equal(result, expected, 'Должен вернуть пустую строку');
        });

        it('Modifier for block', function() {
            var rules = _.clone(russianNamingRules);
            var params = {
                block: 'block',
                modKey: 'mode',
                modValue: 4
            };

            var result = makeup._composeClassName(params, rules);
            var expected = 'block_mode_4';

            assert.equal(result, expected);
        });
    });

    describe('_detectBEM', function() {
        it('Russian block', function() {
            var element = {
                className: 'bl0ck-mED-_mod bl0ck-mED-_key-_value bl0ck-mED-'
            };

            var expected = {
                type: 'block',
                name: 'bl0ck-mED-',
                blockName: 'bl0ck-mED-',
                elementName: null
            };

            var result = makeup._detectBEM(element, russianNamingRules);

            assert.deepEqual(result, expected);
        });

        it('International element', function() {
            var element = {
                className: '--qwe block_elementWOWOWO123 --asd'
            };

            var expected = {
                type: 'element',
                name: 'block_elementWOWOWO123',
                blockName: 'block',
                elementName: 'elementWOWOWO123'
            };

            var result = makeup._detectBEM(element, internationalNamingRules);

            assert.deepEqual(result, expected);
        });

        it('Internal element', function() {
            var element = {
                className: 'makeup__module-header'
            };

            var expected = {
                type: 'element',
                name: 'makeup__module-header',
                blockName: 'makeup',
                elementName: 'module-header'
            };

            var result = makeup._detectBEM(element, internalNamingRules);

            assert.deepEqual(result, expected);
        });
    });

    describe('_parseMod', function() {
        it('Russian block', function() {
            var element = {
                className: 'bl0ck-mED-_mod bl0ck-mED-_key-_value bl0ck-mED-'
            };

            var expected = {
                mod: 'true',
                'key-': 'value'
            };
            var result = makeup._parseMod(element, russianNamingRules);

            assert.deepEqual(result, expected);
        });

        it('Russian element', function() {
            var rules = _.clone(russianNamingRules);
            rules.bevis = true;
            var element = {
                className: 'block-W__p23 _mod3 _aaa_90'
            };

            var expected = {
                mod3: 'true',
                aaa: '90'
            };
            var result = makeup._parseMod(element, rules);

            assert.deepEqual(result, expected);
        });

        it('Bevis russian block', function() {
            var rules = _.clone(russianNamingRules);
            rules.bevis = true;

            var element = {
                className: '_active blockBig-ood _st-te_reallyOpen'
            };

            var expected = {
                active: 'true',
                'st-te': 'reallyOpen'
            };
            var result = makeup._parseMod(element, rules);

            assert.deepEqual(result, expected);
        });

        it('Bevis russian element', function() {
            var rules = _.clone(russianNamingRules);
            rules.bevis = true;
            var element = {
                className: '_active blockBig__elementGood _st-te_reallyOpen'
            };

            var expected = {
                active: 'true',
                'st-te': 'reallyOpen'
            };
            var result = makeup._parseMod(element, rules);

            assert.deepEqual(result, expected);
        });

        it('International element', function() {
            var element = {
                className: 'c0mponenT-good_e1em c0mponenT-good_e1em--active c0mponenT-good_e1em--open--c_losed'
            };

            var expected = {
                active: 'true',
                'open': 'c_losed'
            };
            var result = makeup._parseMod(element, internationalNamingRules);

            assert.deepEqual(result, expected);
        });
    });
});