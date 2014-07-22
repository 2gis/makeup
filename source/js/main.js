var blocks = {},
    debug = false;

$(function() {
    document.body.classList.remove('loading');

    initBlocks();
});

/**
 * Initialize all blocks on page
 */
function initBlocks() {
    for (var key in blocks) {
        if (blocks[key]) {
            if ($('.' + key).length && blocks[key].init) {
                blocks[key].init();
            }
        }
    }
}

/*
 * Create cookie with selected name
 *
 * @param {string} name Name of cookie
 * @param {number} value Value of cookie
 * @param {string} days Expired
 */
function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
}

/*
 * Read a cookie with selected name
 *
 * @param {string} name Name of cookie
 */
function readCookie(name) {
    var nameEQ = escape(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
}

/*
 * Destroy a cookie with selected name
 *
 * @param {string} name Name of cookie
 */
function eraseCookie(name) {
    createCookie(name, "", -1);
}
