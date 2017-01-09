'use strict';

/**
  * Собираем массив компонентов и фикстур для них
  *
  * Пример:
  * [{
  *   name: "firmCard",
  *   element: [ReactClass],
  *   fixtures: [{
  *     name: 'disabled',
  *     data: [ReactClassProps]
  *   }]
  * }]
  */

export default function() {
    const requireComponent = require.context('components4makeup', true, /\.(j|t)sx?$/);
    const isComponent = /^\.\/(.+)\.(j|t)sx?$/; // @todo make it as a parameter
    const components = [];

    // @todo сортировка сейчас так [ 'f/f', 'f/index', 'l/index', 'l/l' ]
    // надо чтоб было так => [ 'f/f', 'f/index', 'l/l', 'l/index' ]
    // The filtering have to be done before `uniq(components)` to prioritize index-names
    const keys = requireComponent.keys().sort((a, b) => {
        if (a.indexOf('/index') != -1) {
            return -1;
        }

        return a > b ? 1 : -1;
    });

    keys.forEach(function (componentFullPath) {
        const match = componentFullPath.match(isComponent);

        if (!match) {
            return;
        }

        // Fixtures are grouped per component
        const componentPath = match[1];
        const parts = componentPath.split('/');
        const fname = parts[parts.length - 1];
        let componentName = componentPath;

        if (fname == 'index') {
            const shortArr = parts.slice(0, -1);

            componentName = shortArr.join('/');
        }

        const fixtures = getFixturesForComponent(componentName);

        // No fixtures = no cartoons (no component in the list)
        // Also covers some cases when some files cannot be required (mocha tests for example, when typescript)
        if (!fixtures.length) {
            return;
        }

        const component = requireComponent(componentFullPath);

        if (component) {
            const exprts = Object.keys(component);

            // @todo случай когда в одной папке несколько компонентов

            const Element = component[fname] || component[exprts[exprts.length - 1]] || component.default;

            if (!Element || !isReactClass(Element)) {
                // Invalid Component provided.
                return;
            }

            const newComponent = {
                componentPath,
                componentName,
                Element,
                fixtures
            };

            // Исключаем дубли, например компоненты типа index которые ссылаются на основной компонент
            const dubl = Boolean(components.find(c => c.Element == Element));

            if (!dubl) {
                components.push(newComponent);
            }
        }
    });

    return components.sort((a, b) => {
        return a.componentName > b.componentName ? 1 : -1;
    });
};

function isReactClass(component) {
    return typeof component === 'string' || typeof component === 'function';
};

function getFixturesForComponent(componentName) {
    const requireFixture = require.context('fixtures4makeup', true, /\.(j|t)s$/);
    const isFixtureOfComponent = new RegExp('./' + componentName + '/([^/]+).(j|t)s$');
    const fixtures = [];

    requireFixture.keys().forEach(fixturePath => {
        const match = fixturePath.match(isFixtureOfComponent);

        if (match) {
            const fileData = requireFixture(fixturePath);
            const data = fileData.default || fileData;
            const props = data.props || data;
            const styles = {
                image: data.imageStyles,
                component: data.componentStyles
            };

            fixtures.push({
                name: match[1],
                props,
                styles
            });
        }
    });

    // if (!fixtures.length) {
    //     fixtures.push({
    //         name: 'empty',
    //         data: {}
    //     });
    // }

    return fixtures;
};
