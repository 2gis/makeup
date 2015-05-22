/**
 * Detect BEM blocks in DOM: proof of concept
 */

(function(global) {
    var Makeup = global.Makeup || {fn: {}}; // for tests
    var $ = Makeup.$;
    var _ = Makeup._;


    // for simplicity, we accept two types of BEM delimiters:
    // 1. blockName__elementName, block-name__element-name, etc
    // 2. blockName--elementName, blockName--modifierName, etc
    var delimitersRe = /--|__/;

    function isBlockClassName(className) {
        return !delimitersRe.test(className);
    }

    function getBlockName(elem) {
        if (typeof elem.className != 'string') return; // svg etc

        var classes = _.compact(elem.className.split(' ')),
            blockyClasses = _.filter(classes, function(className) {
                return isBlockClassName(className);
            });

        if (!blockyClasses.length) return;

        var block = $(elem);
        var approvedBlock;

        _.find(blockyClasses, function(blockName) {
            var selector = '';
            selector += '[class^="' + blockName + '__"],';
            selector += '[class^="' + blockName + '--"],';
            selector += '[class*=" ' + blockName + '__"],';
            selector += '[class*=" ' + blockName + '--"]';

            var seemsLegit = block.find(selector).length;
            if (seemsLegit) {
                approvedBlock = blockName;
            }
            return approvedBlock;
        });

        return approvedBlock;
    }

    Makeup.fn.detectBlocks = function(root) {
        root = root || document.body;

        var blocks = [];

        $(root).find('*').each(function() {
            var block = getBlockName(this);
            if (block) {
                blocks.push(block);
            }
        });

        blocks = _.uniq(blocks);

        if (blocks.length) {
            return blocks;
        }

        // if there are no BEM blocks, search for common block names + body children
        var commonBlockNames = [
            'head',
            'header',
            'nav',
            'navigation',
            'menu',
            'item',
            'list',
            'footer',
            'main',
            'content',
            'box',
            'popup',
            'post',
            'btn',
            'button',
            'auth',
            'user',
            'home',
            'player',
            'logo',
            'section',
            'article',
            'login',
            'form',
            'table',
            'profile',
            'gadget',
            'dashboard'
        ];

        $(root).find('.' + commonBlockNames.join(',.')).not('script, link, iframe, object, svg').each(function() {
            var classes = _.compact(this.className.split(' '));
            var blockName = _.intersection(classes, commonBlockNames)[0];

            if (blockName) {
                blocks.push(blockName);
            }
        });

        $(root).children().each(function() {
            var firstClass = _.compact(this.className.split(' '))[0];
            if (firstClass) {
                blocks.push(firstClass);
            }
        });

        return _.uniq(blocks);
    };

})(this);
