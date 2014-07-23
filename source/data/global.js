var global = {
    "menu": {
        "tooltip": "Toggle menu",
        "default": true
    },

    "search": {
        "placeholder": ""
    },

    "mode": {
        "label": "Mode",

        "items": [
            {
                "tooltip": "Image",
                "value": "1",
                "checked": true
            },
            {
                "tooltip": "Markup",
                "value": "2",
            },
            {
                "tooltip": "Markup and image",
                "value": "3",
            },
            {
                "tooltip": "Markup and inversed image",
                "value": "4",
            }
        ]
    },

    "background": {
        "label": "Background",

        "items": [
            {
                "tooltip": "Gray",
                "value": "color",
                "checked": true
            },
            {
                "tooltip": "Transparency grid",
                "value": "transparency"
            },
            {
                "tooltip": "2GIS Map",
                "value": "map"
            }
        ]
    },

    "transparency": {
        "label": "Transparency",
        "type": "slider",
        "name": "makeup-transparency",

        "slider": {
            "min": 0,
            "max": 1,
            "step": 0.1
        }
    },

    "zoom": {
        "label": "Zoom",
        "type": "slider",
        "name": "makeup-zoom",

        "slider": {
            "min": 1,
            "max": 4,
            "step": 0.2
        }
    },

    "ruler": {
        "h": {
            "type": "ruler",
            "name": "makeup-ruler-h",

            "slider": {
                "min": 0,
                "max": 1000,
                "step": 10
            }
        },
        "v": {
            "type": "ruler",
            "name": "makeup-ruler-v",

            "slider": {
                "min": 0,
                "max": 1000,
                "step": 10
            }
        }
    }
}