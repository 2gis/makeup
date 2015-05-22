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
        var blocks = [];
        $(root).find('*').each(function() {
            var block = getBlockName(this);
            if (block) {
                blocks.push(block);
            }
        });

        return _.uniq(blocks);
    };

})(this);
