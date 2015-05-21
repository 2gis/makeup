/**
 * Sidebar logic: search, item navigation
 */
(function(global) {
    var Makeup = global.Makeup || {fn: {}}; // for tests
    var $ = Makeup.$;
    var _ = Makeup._;
    var Handlebars = Makeup.Handlebars;

    /**
     * Sidebar
     */
    Makeup.fn._bindMenuListeners = function() {
        var self = this,
            makeupRootElement = $(this._params.selectors.root)[0],
            sidebar = $(this._params.selectors.sidebar),
            itemHeader = $(this._params.selectors.itemHeader);

        itemHeader.on('click', function() {
            var item = self._getItemById(this.parentNode.id);

            if (item.items) { // item has a list of another items
                self._toggleMenuItem(item);
            } else { // "End"-item, which has corresponding html representation
                self._state.set({
                    chain: item._chain
                });
            }
        });

        // Hiding sidebar
        if (this._params.sidebar) {
            var sidebarToggler = this.el.sidebarToggler;

            // Set default mode
            if (!this._state.get('sidebar')) {
                var defaultSidebarState = this._mod(makeupRootElement).sidebar || true;

                this._state.want({ sidebar: defaultSidebarState });
            }

            sidebarToggler.on('change', function() {
                self._state.set({ sidebar: this.checked });
            });

            if (typeof window != 'undefined') {
                $(window).on('keydown', function(e) {
                    var key = self._getKey(e);

                    if (key == 192 || key == 220) {
                        self._state.set({ sidebar: !sidebarToggler[0].checked });
                    }
                });
            }
        }

        this._baron = sidebar.baron({
            $: $,
            scroller: this._params.selectors.scroller,
            track:    this._params.selectors.scrollerTrack,
            bar:      this._params.selectors.scrollerTrackBar,
            barOnCls: this._params.modifiers.baron
        });
    };

    /**
     * Apply state in aside panel
     */
    Makeup.fn._setCurrentMenuItem = function(chain) {
        var makeup = this;
        var itemsChain = this._itemsChain(chain);
        var youngestItem = _.last(itemsChain);

        if (!youngestItem.items) { // last item in hierarchy
            var item = itemsChain.pop();
            makeup.el.item.each(function() {
                makeup._mod(this, {current: false});
            });
            makeup._mod(makeup._getItemElementById(item._id), {current: true});
        }

        _.each(itemsChain, function(item) { // expand parents
            makeup._toggleMenuItem(item, true);
        });
    };

    /**
     * Toggle navigation item
     */
    Makeup.fn._toggleMenuItem = function(item, expand) {
        var elem = this._getItemElementById(item._id);
        this._mod(elem, {expanded: expand === undefined ? !this._mod(elem).expanded : expand});
        if (elem.mod.expanded && item.items && item.items.length == 1 && item.items[0].items) { // if only one expandable child, expand it
            this._toggleMenuItem(item.items[0], true);
        }
        this._baron.update();
    };

    /**
     * Search
     */
    Makeup.fn._search = function(query) {
        var makeup = this,
            items = makeup.el.item;

        items.each(function() {
            this._state = {
                hidden: !!query, // if no query, show all, else hide
                highlight: false,
                matched: false
            };
        });

        if (query) {
            query = query.split(/[\s\/]+/); // split by slash and space
            var selector = _.reduce(query, function(sel, part) {
                if (part) {
                    sel += '[data-index*="' + encodeURIComponent(part.toLowerCase()) + '"] ';
                }
                return sel;
            }, '');

            items.filter(selector).each(function() {
                this._state.hidden = false;
                this._state.matched = true;
                highlight.call(makeup, this);

                // show and expand all parent items
                $(this).parents(makeup._params.selectors.item).each(function() {
                    this._state.hidden = false;
                    this._state.expanded = true;
                });
                // show all child items
                $(this).find(makeup._params.selectors.item).each(function() {
                    this._state.hidden = false;
                });
            });
        }

        items.each(function() {
            makeup._mod(this, this._state);
        });
    };

    /**
     * Navigate through highlighted items
     */
    Makeup.fn._selectNext = function() {
        var makeup = this;

        var current = 0;
        var highlighted = makeup.el.item.filter(function() {
            if (this.mod.current) {
                current = this;
            }
            return this.mod.highlight;
        });

        var nextIndex = current ? (highlighted.index(current) + 1) % highlighted.length : 0;
        var next = highlighted.eq(nextIndex);

        next.children().filter(makeup._params.selectors.itemHeader).trigger('click');
    };

    /**
     * Search control listeners
     */
    Makeup.fn._bindSearchListeners = function() {
        var makeup = this,
            searchInput = $(makeup._params.selectors.searchInput);

        searchInput.on('keyup', function(e) {
            if (e.which == 13) { // enter key
                return makeup._selectNext();
            }

            makeup._search(searchInput.val());
        });
    };

    /**
     * Recursively highlight items
     */
    function highlight(itemElem) {
        var makeup = this;
        var nestedItems = $(itemElem).find(makeup._params.selectors.item);

        if (!nestedItems.length) {
            itemElem._state.highlight = true;
        } else {
            nestedItems.each(function() {
                highlight.call(makeup, this);
            });
        }
    }

})(this);
