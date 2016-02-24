/*! elba - v0.5.0 - 2016-02-24
* https://github.com/iliketomatoes/elbajs
* Copyright (c) 2016 ; Licensed  */
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

        var ComponentInterface = {
            logEl: function(){
                console.log(this);
            }
        };

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
    },

    intVal: function(x){
        if(x){
            return parseInt(x, 10);
        }else{
            return 0;
        }
    }
};

var testElement = document.createElement('div');
//http://stackoverflow.com/questions/7212102/detect-with-javascript-or-jquery-if-css-transform-2d-is-available
var vendorTransform = (function() {
    var prefixes = 'transform WebkitTransform webkitTransform MozTransform OTransform msTransform'.split(' ');
    for (var i = 0; i < prefixes.length; i++) {
        if (testElement.style[prefixes[i]] !== undefined) {
            return prefixes[i];
        }
    }
    return false;
})();

var vendorTransition = (function() {
    var prefixes = 'transition WebkitTransition webkitTransition MozTransition OTransition'.split(' ');
    for (var i = 0; i < prefixes.length; i++) {
        if (testElement.style[prefixes[i]] !== undefined) {
            return prefixes[i];
        }
    }
    return false;
})();

// http://stackoverflow.com/questions/15622466/how-do-i-get-the-absolute-value-of-translate3d
function getTransform(el) {
    var transform = window.getComputedStyle(el, null).getPropertyValue(vendorTransform);
    var results = transform.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}.+))(?:, (-{0,1}.+))\))/);

    if (!results) return [0, 0, 0];
    if (results[1] == '3d') return results.slice(2, 5);

    results.push(0);
    return results.slice(5, 8); // returns the [X,Y,Z,1] values
}

var rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cAF = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

var Player = {
    goToNext: function(carousel) {
        var offset = (-carousel.pointer - 1) * 100;
        carousel.pointer += 1;
        this.slide(carousel.slider, offset);
    },
    goToPrevious: function(carousel) {
        var offset = (-(carousel.pointer - 1)) * 100;
        carousel.pointer -= 1;
        this.slide(carousel.slider, offset);
    },
    slide: function(slider, offset) {
        //console.log(Utils.intVal(getTransform(slider)));
        rAF(function() {
            console.log('animation frame requested');
            slider.style[vendorTransition] = vendorTransform + ' 0.8s';
            slider.style[vendorTransform] = 'translate3d(' + offset + '%,0,0)';
        });
    }
};

var ImageHandler = Object.create(ComponentInterface);

ImageHandler.loadImages = function() {
	// TODO
    return this;
};

var ElbaBuilder = Object.create(ComponentInterface);

ElbaBuilder.build = function(el, carousel) {
    
    // Set viewport and slider
    var slides = this.setLayout(el);

    this.setSlidesOffset(slides);

    carousel.count = slides.length;

    this.setupNavigation(el, carousel, 'right');
    this.setupNavigation(el, carousel, 'left');

    carousel.slider = this.getSlider(el);
    carousel.slider.setAttribute('data-elba-id', carousel.GUID);
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
ElbaBuilder.setupNavigation = function(el, carousel, direction) {

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
    el.appendChild(carousel.navigation[direction]);
};

ElbaBuilder.getSlider = function(el) {
    return el.querySelector('.elba-slider');
};

ElbaBuilder.testMethod = function() {
    return this;
};

ElbaBuilder.testProperty = 'Test Property it me';

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
function componentFactory(selector, settings, GUID) {

    return function(component) {
        var obj = Object.create(component, {
            selector: { writable: false, configurable: false, value: selector },
            settings: { writable: false, configurable: false, value: settings },
            GUID: { writable: false, configurable: false, value: GUID },
            el: {
                get: function() {
                    var selector = '';
                    if (this.selector.indexOf('#') > -1) {
                        selector = this.selector.slice(1);
                    }
                    if (!Instances[selector]) {
                        Instances[selector] = {};
                        Instances[selector].el = document.getElementById(selector);
                    }
                    return Instances[selector];
                },
                set: function(selector) {}
            }
        });
        return obj;
    };
}

function Elba(selector, settings) {

    var _defaults = {
        selector: '.elba',
        separator: '|',
        breakpoints: false,
        successClass: 'elba-loaded',
        errorClass: 'elba-error',
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
    this.settings = Utils.extend(_defaults, settings);

    //this.el = el;
    this.slider = null;
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


    try {

        if (typeof selector === 'undefined') {
            throw new Error('The first argument passed to the constructor is undefined');
        }

        var createComponent = componentFactory(selector, this.settings, ++GUID);

        var _elbaBuilder = createComponent(ElbaBuilder);
        var _imageHandler = createComponent(ImageHandler);
        var _eventHandler = createComponent(EventHandler);

        //_elbaBuilder.$(selector).testMethod();
        _imageHandler.loadImages().logEl();

    } catch (err) {
        console.error(err.message);
    }
}

Elba.next = function(carouselId) {
    // If an ID is defined we get the single carousel.
    // Otherwise we animate all the instances
    var target = this.getInstance(carouselId) || Instances;

    if (target instanceof Carousel) {
        this.goToNext(target);
    } else {
        for (var i in target) {
            this.goToNext(target[i]);
        }
    }
};

Elba.previous = function(carouselId) {
    // If an ID is defined we get the single carousel.
    // Otherwise we animate all the instances
    var target = this.getInstance(carouselId) || Instances;

    if (target instanceof Carousel) {
        this.goToPrevious(target);
    } else {
        for (var i in target) {
            this.goToPrevious(target[i]);
        }
    }
};

return Elba;
});
