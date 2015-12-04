/*! elba - v0.4.7 - 2015-12-04
* https://github.com/iliketomatoes/elbajs
* Copyright (c) 2015 ; Licensed  */
(function(window, elba) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        // Register Elba as an AMD module
        define(elba());
    } else {
        // Register Elba on window
        window.Elba = elba();
    }

})(window, function() {

        'use strict';

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

var Player = {
	getElement: function(){
		return this.el;
	}
};


var ImageHandler = Object.create(Player);

ImageHandler.loadImages = function() {
    return 'ciao';
};

var ElbaBuilder = Object.create(ImageHandler);

ElbaBuilder.build = function() {
    return 'ciao';
};

var EventHandler = Object.create(ElbaBuilder);

var Toucher = Object.create(EventHandler);
var Elba = Object.create(Toucher);

Elba.setup = function() {
    console.log(Utils.getSupportedTransform);
    // Call method from ElbaBuilder
    this.build();
};

Elba.init = function(el, settings) {

    if (typeof el === 'undefined') {
        throw new Error();
    }

    var defaults = {
        selector: '.elba',
        separator: '|',
        breakpoints: false,
        successClass: 'elba-loaded',
        errorClass: 'elba-error',
        container: 'elba-wrapper',
        src: 'data-src',
        error: false,
        success: false,
        duration: 700,
        easing: 'easeInOutSine',
        navigation: true,
        dots: true,
        dotsContainer: false,
        slideshow: 8000,
        preload: 1,
        swipeThreshold: 60,
    };

    //Overwrite the default options
    this.settings = Utils.extend(defaults, settings);

    this.el = el;
    this.container = null;
    this.containerWidth = 0;
    this.slides = [];
    this.wrapper = null;
    this.count = 0;
    this.source = 0;
    this.navigation = {
        left: null,
        right: null,
        dots: null
    };
    //Init the pointer to the visible slide
    this.pointer = 0;
    //Hint for the direction to load
    this.directionHint = 'right';
    this.resizeTimeout = null;
    this.animated = false;

    this.setup();
    return this;
};

Elba.identify = function() {
    return "I am " + this.el;
};


return {
    init: function(el, settings) {
        var newInstance = Object.create(Elba);
        return newInstance.init(el, settings);
    }
};
});
