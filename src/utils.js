var isRetina = window.devicePixelRatio > 1;

// Set the name of the hidden property and the change event for visibility
var hidden, visibilityChange;
if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support 
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
} else if (typeof document.mozHidden !== 'undefined') {
    hidden = 'mozHidden';
    visibilityChange = 'mozvisibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
    hidden = ' msHidden';
    visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
}

var Utils = {

    extend: function(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    },

    //http://stackoverflow.com/questions/7212102/detect-with-javascript-or-jquery-if-css-transform-2d-is-available
    getSupportedTransform: (function() {
        var testElement = document.createElement('div');
        var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
        for (var i = 0; i < prefixes.length; i++) {
            if (testElement.style[prefixes[i]] !== undefined) {
                return prefixes[i];
            }
        }
        return false;
    })(),

    /**
     * Determine if an element is in the viewport
     * @param {HTMLElement} el
     * @return {Boolean}
     */
    isElementInViewport: function(el) {
        var rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) ||
            rect.bottom >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }
};
