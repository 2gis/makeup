(function(global) {
    var script = document.createElement('script');
    script.src  = "//2gis.github.io/makeup/autoload/makeup.js";
    script.onload = function() {
        window.Makeup();
    };
    document.body.appendChild(script);

    var styles = document.createElement('link');
    styles.setAttribute("rel", "stylesheet");
    styles.setAttribute("type", "text/css");
    styles.setAttribute("href", "//2gis.github.io/makeup/autoload/makeup.css");
    document.body.appendChild(styles);
})(this);