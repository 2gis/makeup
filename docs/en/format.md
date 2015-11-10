# Initialization data format

```js
Makeup(params, templating);
```

## `params`

`params` is an optional argument for parameters, including the blocks list. If no value was passed, all parameters will be taken with default values and the items list will be generated from the current DOM tree.

```js
{
    label: 'project name',
    items: [item1, item2, ...]
    ... // @see source/js/params.js:102
}
```

### `item`

`item` is either a block or a group. A group can contain other groups and/or blocks. Nesting depth is not limited. The `item` object has the following structure:

```js
{
    // {String} Name to show in the list
    "name": "",

    // {Object} Styles, applied to the current and all nested items. See the paragraph on styles.
    "styles": {},

    // {Array} An array of nested items.

    "items": [
    // {item}
    ...
    ]
}
```
Any other properties can be added to an `item` object.


### `styles`

If both an `item` and some of its parents have `styles`, those will be joined (by concatenation of defining strings). Styles are prioritized from root to end element with the latter having the highest priority.

```js
"styles": {
    // {String} Styles, applied to the wrapper
    "wrapper": "color: red;",

    // {String} Styles, applied to the image container
    "image": "background: green; border: 1px solid yellow;",

    // {String} Styles, applied to the markup container
    "markup": "box-shadow: 0 0 3px rgba(0, 0, 0, .3)"
}
```

## `templating`

`templating` is an optional function which accepts the name (and parameters) of a particular block and returns its html code:

```js
templating(ctx) {
    return html;
};
```

If no instance of `templating` was passed, Makeup uses the default function which searches for `$('.' + ctx.name)` in the DOM tree and takes its `outerHTML`.

### `ctx`
An object, identifying the selected block and its parameters

### `html`

The returned html code of the selected block.
