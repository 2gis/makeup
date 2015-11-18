import React from 'react';
import ReactDOM from 'react-dom';
import MakeupComponent from './app/makeup';
import _ from 'lodash';

class Makeup {
    constructor(options, templater) {
        this.params = Object.assign(this.getParams({data: options}), {
            instanceId: new Date().getTime() % 100000000
        });
        this.render();
    }

    /**
     * Превращает объект параметров makeup в объект-контекст для главного шаблона
     */
    getParams(data) {
        let model = data;
        let out = model;

        if (model.data) {
            if (!_.isArray(model.data)) out.data = [model.data];

            out.data = _.map(model.data, function(item) {
                return {
                    label: item.label || 'Untitled group',
                    snippet: item.snippet || _.noop,
                    items: this.parseCollection(item.items)
                };
            }, this);
        }

        let inc = 0;
        out.next = function() {
            return ++inc;
        };
        out.current = function() {
            return inc;
        };

        out.instanceId = this._instanceId;

        return out;
    }

    parseCollection(arr, func) {
        let handler = func || _.bind(this.parseItem, this);

        return _(arr).compact().map(handler, this).value();
    }

    parseItem(item) {
        let out = {};
        let untitled = 'Untitled';

        if (typeof item == 'string') {
            out.name = item || untitled;
        } else if (item instanceof Object) {
            let children = item.items || item.types;
            let documentation = item.documentation;
            let meta = item.meta;

            out = item;

            if (typeof out.name != 'undefined') {
                out.name = String(out.name) || untitled;
            } else {
                out.name = untitled;
            }

            // Documentation
            if (documentation) {
                if (documentation instanceof Array && documentation.length) {
                    out.documentation = this.parseCollection(documentation, this.parseDocumentation);
                } else if (typeof documentation == 'string' || documentation instanceof Object) {
                    out.documentation = [this.parseDocumentation(documentation)];
                }
            }

            // Snippet
            out.snippet = item.snippet || _.noop;

            // Meta
            if (item.meta && item.meta instanceof Array && item.meta.length) {
                out.meta = this.parseCollection(meta, this.parseMeta);
            }

            // Children
            if (children && children instanceof Array && children.length) {
                out.items = this.parseCollection(children);
            }
        }

        if (!out.name || out.name == '') {
            out.name = untitled;
        }

        out.label = out.label || out.name || untitled;

        // Item name for search ("Hello World 2" --> "helloworld2")
        out.index = encodeURIComponent(out.label.toLowerCase().replace(/\s/g, ''));

        return out;
    }

    /**
     * Parse documentation
     */
    parseDocumentation(item) {
        let out = {link: '', label: ''};

        if (typeof item == 'string') {
            out.link = out.label = item;
        } else if (item instanceof Object && item.link) {
            out.link = item.link;
            out.label = item.label || out.link;

            if (item.modifier) {
                out.modifier = item.modifier;
            }
        }

        return out;
    }

    /**
     * Parse meta
     */
    parseMeta(item) {
        let out = {};

        if (typeof item == 'string') {
            out.key = item;
        } else if (item instanceof Object && item.key) {
            out = item;
        }

        return out;
    }

    render() {
        let content = React.createElement(MakeupComponent, this.params);
        let element = document.createElement('div');

        element.id = 'makeup-container';
        document.body.appendChild(element);

        ReactDOM.render(content, element, () => {
            console.log('Makeup was rendered');
        });
    }
}

if (typeof window != undefined) {
    window.Makeup = Makeup;
}

export default Makeup;
