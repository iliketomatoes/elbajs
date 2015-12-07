/*! elba - v0.5.0 - 2015-12-07
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

        // Global unique id
        var GUID = 0;

        // Object storing carousel instances
        var Instances = {};

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
    },

    makeArray: function(arrayLikeObject) {
        return Array.prototype.slice.call(arrayLikeObject);
    },

    getCloneNodes: function(nodes) {
        var tmp = [];

        if (!nodes) return tmp;

        for (var i = 0; i < nodes.length; i++) {
            var clone = nodes[i].cloneNode(true);
            tmp.push(clone);
        }
        return tmp;
    },

    removeChildren: function(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    }
};

var Player = {
    goToNext: function(carousel) {
        console.log('go to next');
    },
    goToPrevious: function(carousel) {
        console.log('go to previous');
    }
};

var ImageHandler = Object.create(Player);

ImageHandler.loadImages = function() {
    return 'ciao';
};

var ElbaBuilder = Object.create(ImageHandler);

ElbaBuilder.build = function(carousel) {
    // Set viewport and slider
    var slides = this.setLayout(carousel.el);

    this.setSlidesOffset(slides);

    carousel.count = slides.length;
    carousel.pointer = 1;

    this.setupNavigation(carousel, 'right');
    this.setupNavigation(carousel, 'left');

};

ElbaBuilder.setLayout = function(el) {

    var d = document.createDocumentFragment();

    // Create viewport
    var viewport = document.createElement('div');
    viewport.className = 'elba-viewport';

    d.appendChild(viewport);

    // Create sliding div
    var slider = document.createElement('div');
    slider.className = 'elba-slider';

    viewport.appendChild(slider);

    // Get slides elements
    var cloneNodes = Utils.getCloneNodes(el.children);

    if (cloneNodes) {

        // Clone last element in first position, due to the infinite carousel
        cloneNodes.unshift(cloneNodes[cloneNodes.length - 1].cloneNode(true));

        // Clone head in last position, due to the infinite carousel 
        cloneNodes.push(cloneNodes[1].cloneNode(true));

        for (var i = 0; i < cloneNodes.length; i++) {
            slider.appendChild(cloneNodes[i]);
        }
    }

    // Remove the original, unwrapped, slides
    Utils.removeChildren(el);

    el.appendChild(d);

    return cloneNodes;
};

ElbaBuilder.setSlidesOffset = function(slides) {

    var start = -100;

    for (var i = 0; i < slides.length; i++) {
        slides[i].style.left = start + '%';
        start += 100;
    }
};

/**
 * Set up arrows for the navigation
 * @param {Carousel} carousel
 * @param {String} direction
 */
ElbaBuilder.setupNavigation = function(carousel, direction) {

    // create svg
    var svgURI = 'http://www.w3.org/2000/svg';

    var arrow = document.createElement('a');
    arrow.className = 'elba-' + direction + '-nav';
    arrow.setAttribute('data-elba-id', carousel.GUID);

    if (direction === 'left') {
    	
        var svgLeft = document.createElementNS(svgURI, 'svg');
        // SVG attributes, like viewBox, are camelCased. That threw me for a loop
        svgLeft.setAttribute('viewBox', '0 0 100 100');
        // create arrow
        var pathLeft = document.createElementNS(svgURI, 'path');
        pathLeft.setAttribute('d', 'M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z');
        pathLeft.setAttribute('transform', 'translate(15,0)');
        // add class so it can be styled with CSS
        pathLeft.setAttribute('class', 'elba-svg-arrow');
        svgLeft.appendChild(pathLeft);

        arrow.appendChild(svgLeft);

    } else {

        // add svg to page
        var svgRight = document.createElementNS(svgURI, 'svg');
        // SVG attributes, like viewBox, are camelCased. That threw me for a loop
        svgRight.setAttribute('viewBox', '0 0 100 100');
        // create arrow
        var pathRight = document.createElementNS(svgURI, 'path');
        pathRight.setAttribute('d', 'M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z');
        // add class so it can be styled with CSS
        pathRight.setAttribute('class', 'elba-svg-arrow');
        pathRight.setAttribute('transform', 'translate(85,100) rotate(180)');
        svgRight.appendChild(pathRight);

        arrow.appendChild(svgRight);
    }

    carousel.navigation[direction] = arrow;
    carousel.el.appendChild(carousel.navigation[direction]);
};

var EventHandler = Object.create(ElbaBuilder);

EventHandler.bindEvents = function() {

    for (var i in Instances) {
        if (Instances.hasOwnProperty(i)) {

            var carousel = Instances[i];

            if (carousel.settings.navigation) {

                this.addNavigationEvents(carousel);

            }

        }
    }

};

EventHandler.addNavigationEvents = function(carousel) {
    carousel.navigation.left.addEventListener('click', function(e) {
        Elba.previous(carousel.GUID);
    }, false);

    carousel.navigation.right.addEventListener('click', function(e) {
        Elba.next(carousel.GUID);
    }, false);
};

var Toucher = Object.create(EventHandler);
var Elba = Object.create(Toucher);

Elba.getInstance = function(id) {
    return Instances[id];
};

Elba.init = function(elements, settings) {

    if (typeof elements === 'undefined') {
        throw new Error();
    }

    var htmlArray = Utils.makeArray(elements);

    for (var i = 0; i < htmlArray.length; i++) {
        GUID++;
        var carousel = new Carousel(htmlArray[i], settings);
        htmlArray[i].setAttribute('data-elba-id', GUID);
        Instances[GUID] = carousel;
        carousel.GUID = GUID;
        // Call method inherited from ElbaBuilder
        this.build(carousel);
    }
    
    // Call method inherited from EventHandler
    this.bindEvents();
    return this;
};

Elba.next = function(carouselId) {
    // If an ID is defined we get the single carousel.
    // Otherwise we move all the instances
    var carousel = this.getInstance(carouselId) || Instances;

    if (carousel instanceof Carousel) {
        //TODO, animate single carousel
        this.goToNext(carousel);
    } else {
        for (var instance in carousel) {
            //TODO, animate single carousel
            this.goToNext(carousel);
        }
    }
};

Elba.previous = function(carouselId) {
    // If an ID is defined we get the single carousel.
    // Otherwise we move all the instances
    var carousel = this.getInstance(carouselId) || Instances;

    if (carousel instanceof Carousel) {
        //TODO, animate single carousel
        this.goToPrevious(carousel);
    } else {
        for (var instance in carousel) {
            //TODO, animate single carousel
            this.goToPrevious(carousel);
        }
    }
};

function Carousel(el, settings) {

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
    this.slides = [];
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
}

return Elba;
});
