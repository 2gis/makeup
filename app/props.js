export default {
    toggler: {
        id: 'toggle-menu',
        name: 'menu',
        label: 'Toggle menu',
        icon: require('babel!svg-react!./assets/toggler.svg')
    },

    search: {
        name: 'q',
        placeholder: 'Filter'
    },

    mode: {
        title: 'Mode:',
        items: [
            {
                name: 'mode',
                id: 'mode-blend-1',
                value: '1',
                label: 'Image',
                icon: require('babel!svg-react!./assets/blend1.svg')
            },
            {
                name: 'mode',
                id: 'mode-blend-2',
                value: '2',
                label: 'Markup',
                icon: require('babel!svg-react!./assets/blend2.svg')
            },
            {
                name: 'mode',
                id: 'mode-blend-3',
                value: '3',
                label: 'Markup and image',
                icon: require('babel!svg-react!./assets/blend3.svg')
            },
            {
                name: 'mode',
                id: 'mode-blend-4',
                value: '4',
                label: 'Markup and inversed image',
                icon: require('babel!svg-react!./assets/blend4.svg')
            }
        ]
    },

    background: {
        title: 'Background:',
        items: [
            {
                name: 'background',
                id: 'background-light',
                value: 'light',
                label: 'White',
                icon: require('babel!svg-react!./assets/light.svg')
            },
            {
                name: 'background',
                id: 'background-transparency',
                value: 'transparency',
                label: 'Transparency grid',
                icon: require('babel!svg-react!./assets/transparent.svg')
            }
        ]
    },

    transparency: {
        title: 'Transparency:',
        name: 'transparency',
        min: 0,
        max: 1,
        step: 0.01
    },

    zoom: {
        title: 'Zoom:',
        name: 'zoom',
        min: 1,
        max: 4,
        step: 0.1
    }
};
