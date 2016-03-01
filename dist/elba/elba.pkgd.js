/*! elba - v0.5.0 - 2016-03-01
* https://github.com/iliketomatoes/elbajs
* Copyright (c) 2016 ; Licensed  */
/*!
 * classie v1.0.1
 * class helper functions
 * from bonzo https://github.com/ded/bonzo
 * MIT license
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = classie;
} else {
  // browser global
  window.classie = classie;
}

})( window );

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

        // Object storing slider instances
        var Instances = {};

        // Helper variable that holds the slider instance that has been clicked
        // upon, to handle the dragging event.
        var TargetInstance = null;
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

    intVal: function(x) {
        if (x) {
            return parseInt(x, 10);
        } else {
            return 0;
        }
    },

    /**
     * http://stackoverflow.com/a/2117523
     *
     * Generate a random GUID that will be used as the key to retrieve
     * all the Slider instances inside the Instances object.
     * @return {String}
     */
    generateGUID: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    // https://davidwalsh.name/element-matches-selector
    selectorMatches: function(el, selector) {
        var p = Element.prototype;
        var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
            return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
        };
        return f.call(el, selector);
    },

    getNodeElementByIndex: function(elements, index) {
        return elements[index];
    },

    setListener: function(elm, events, callback) {
        var eventsArray = events.split(' '),
            i = eventsArray.length;

        while (i--) {
            elm.addEventListener(eventsArray[i], callback, false);
        }
    }
};

// helpers
var msEventType = function(type) {
        var lo = type.toLowerCase(),
            ms = 'MS' + type;
        return navigator.msPointerEnabled ? ms : lo;
    },
    debounce = function(fn, delay) {
        var t;
        return function() {
            var args = arguments;
            clearTimeout(t);
            t = setTimeout(function() {
                fn.apply(null, args)
            }, delay);
        };
    },
    getPointerEvent = function(event) {
        return event.targetTouches ? event.targetTouches[0] : event;
    },
    sendEvent = function(elm, eventName, originalEvent, data) {
        var customEvent = document.createEvent('Event');
        customEvent.originalEvent = originalEvent;
        data = data || {};
        data.x = currX;
        data.y = currY;
        data.distance = data.distance;

        // addEventListener
        if (customEvent.initEvent) {
            for (var key in data) {
                customEvent[key] = data[key];
            }
            customEvent.initEvent(eventName, true, true);
            elm.dispatchEvent(customEvent);
        }

        // inline
        if (elm['on' + eventName]) {
            elm['on' + eventName](customEvent);
        }
    };

var Tocca = {
    events: {
        start: msEventType('PointerDown') + ' touchstart mousedown',
        end: msEventType('PointerUp') + ' touchend mouseup',
        move: msEventType('PointerMove') + ' touchmove mousemove'
    },
    onTouchStart: function(e) {

        var pointer = getPointerEvent(e);

        // caching the current x
        cachedX = currX = pointer.pageX;
        // caching the current y
        cachedY = currY = pointer.pageY;

        tapNum++;
    },
    onTouchEnd: function(e) {

        var eventsArr = [],
            deltaY = cachedY - currY,
            deltaX = cachedX - currX;

        if (deltaX <= -swipeThreshold) {
            if (TargetInstance) {
                TargetInstance.goTo('previous');
            }
            eventsArr.push('swiperight');
        }

        if (deltaX >= swipeThreshold) {
            if (TargetInstance) {
                TargetInstance.goTo('next');
            }
            eventsArr.push('swipeleft');
        }

        if (deltaY <= -swipeThreshold) {
            eventsArr.push('swipedown');
        }

        if (deltaY >= swipeThreshold) {
            eventsArr.push('swipeup');
        }

        if (eventsArr.length) {
            for (var i = 0; i < eventsArr.length; i++) {
                var eventName = eventsArr[i];
                sendEvent(e.target, eventName, e, {
                    distance: {
                        x: Math.abs(deltaX),
                        y: Math.abs(deltaY)
                    }
                });
            }
            // reset the tap counter
            tapNum = 0;
        }

        TargetInstance = null;
    },
    onTouchMove: function(e) {

        // If no slider had been clicked, we don't procede
        if (!TargetInstance) return;

        var pointer = getPointerEvent(e);

        currX = pointer.pageX;
        currY = pointer.pageY;

        var deltaY = cachedY - currY,
            deltaX = cachedX - currX;

        if (tapNum > 0 && (Math.abs(deltaX) >= swipeThreshold || Math.abs(deltaY) >= swipeThreshold)) {
            sendEvent(e.target, 'drag', e, {
                delta: {
                    x: deltaX,
                    y: deltaY
                }
            });
        }
    }
};

var swipeThreshold = window.SWIPE_THRESHOLD || 100,
    tapNum = 0,
    currX, currY, cachedX, cachedY;

//setting the events listeners
// we need to debounce the callbacks because some devices multiple events are triggered at same time
Utils.setListener(document, Tocca.events.start, debounce(Tocca.onTouchStart, 1));
Utils.setListener(document, Tocca.events.end, debounce(Tocca.onTouchEnd, 1));
Utils.setListener(document, Tocca.events.move, debounce(Tocca.onTouchMove, 1));

var Builder = {
    build: function(){
        this.setLayout();
        var _slides = this.getSlides();
        this.registerSlidesWidth(_slides);
        this.setSlidesOffset(_slides);
    }
};

Builder.setLayout = function() {

    var d = document.createDocumentFragment();

    // Create viewport
    var viewport = document.createElement('div');
    viewport.className = 'elba-viewport';

    d.appendChild(viewport);

    // Create sliding div
    var slider = document.createElement('div');
    slider.className = 'elba-slider';
    slider.setAttribute('data-elba-id', this.GUID);

    viewport.appendChild(slider);

    // Get slides elements
    var cloneNodes = Utils.getCloneNodes(this.el.children);

    if (cloneNodes) {

        for (var i = 0; i < cloneNodes.length; i++) {
            slider.appendChild(cloneNodes[i]);
        }
    }

    // Remove the original, unwrapped, slides
    Utils.removeChildren(this.el);

    this.el.appendChild(d);

};

Builder.setSlidesOffset = function(elements) {
    var slides = elements || this.getSlides();
    var containerWidth = this.getContainerWidth();
    var start = 0;
    var tmp = 0;
    var percentageWidth = 0;
    for (var i = 1; i < slides.length; i++) {
        tmp = Utils.intVal(this.slidesMap[i - 1].width);
        tmp = (tmp / containerWidth).toFixed(2);
        percentageWidth = (tmp * 100);
        slides[i].style.left = (percentageWidth + start) + '%';
        start += percentageWidth;
    }
};

Builder.setNavigation = function() {
    this.setArrow('right');
    this.setArrow('left');
};

/**
 * Set arrows for the navigation
 * @param {String} direction
 */
Builder.setArrow = function(direction) {

    // create svg
    var svgURI = 'http://www.w3.org/2000/svg';

    var arrow = document.createElement('a');
    arrow.className = 'elba-' + direction + '-nav elba-arrow';

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

    this.el.appendChild(arrow);
};

Builder.registerSlidesWidth = function(elements) {
    var slides = elements || this.getSlides();
    for (var i = 0; i < slides.length; i++) {
        if (typeof this.slidesMap[i] === 'undefined') this.slidesMap[i] = {};
        this.slidesMap[i].width = window.getComputedStyle(slides[i]).getPropertyValue('width');
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

testElement = null;

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

/**
* Remember: 
* this.pointer % this.getSlidesCount() is equal to 0 when we are pointing the last slide
* this.pointer % this.getSlidesCount() is equal to 1 when we are pointing the first slide
* this.pointer % this.getSlidesCount() is equal to N when we are pointing the Nth slide but not the last
*
* Note: we assume that pointer starts from 0.
*/

var Player = Object.create(Builder);

Player.goToNext = function() {

    var offset = (-this.pointer - 1) * 100;
    this.pointer += 1;
    console.log(this.slidesMap[this.pointer].width);
    // console.log(this.pointer % this.getSlidesCount());
    // console.log(this.pointer / this.getSlidesCount());
    if(this.pointer >= (this.count -1 )) {
        //console.log(this.pointer);
        //console.log((this.pointer + 1) % this.getSlidesCount());
        var _nextSlide = Utils.getNodeElementByIndex(this.getSlides(), (this.pointer + 1) % this.getSlidesCount());
        _nextSlide.style.left = (this.pointer + 1) * 100 + '%';
    }

    this.slide(offset);
};

Player.goToPrevious = function() {

    var offset = (-(this.pointer - 1)) * 100;
    this.pointer -= 1;
    this.slide(offset);

};

Player.goTo = function(direction) {
    if (direction === 'next') {
        this.goToNext();
    } else if (direction === 'previous') {
        this.goToPrevious();
    }
};

Player.slide = function(offset) {

    var _slider = this.getSlider();
    rAF(function() {
        _slider.style[vendorTransition] = vendorTransform + ' 0.8s';
        _slider.style[vendorTransform] = 'translate3d(' + offset + '%,0,0)';
    });

};

var Imagie = Object.create(Player);

Imagie.loadImages = function() {
	// TODO
	console.log(this.el);
    return this;
};

var arrowClickHandler = function(e) {
    if (classie.hasClass(e.target, 'elba-right-nav')) {
        this.goTo('next');
    } else {
        this.goTo('previous');
    }
};

var sliderDragStartHandler = function(e) {
    // Assign a Slider instance to TargetInstance only
    // if it's not referencing another Slider Instance already.
    // This means that you can only drag one slider per time. 
    if(TargetInstance === null){
	   TargetInstance = Instances[this.GUID];
    }
};

var Eventie = Object.create(Imagie);

Eventie.initEvents = function() {
    // bind click on arrows
    if (this.settings.navigation) {
        this.setArrowsListener();
    }

    this.setSliderListener();
};

Eventie.setArrowsListener = function() {
    var _arrows = Utils.makeArray(this.getArrows());
    var i = 0;
    while(_arrows[i]){
    	_arrows[i].addEventListener('click', arrowClickHandler.bind(this));
    	i++;
    }
};

Eventie.setSliderListener = function() {
	var _slider = this.getSlider();
	Utils.setListener(_slider, Tocca.events.start, sliderDragStartHandler.bind(this));
};

var Slider = Object.create(Eventie);

Slider.init = function() {
    this.build();

    this.count = this.getSlidesCount();
    this.containerWidth = this.getContainerWidth();

    if (this.settings.navigation && this.count > 1) {
        this.setNavigation();
    }
    console.log(this.slidesMap);
    
    this.initEvents();
};

Slider.getSlider = function() {
    if (this.slider) return this.slider;
    return this.slider = this.el.querySelector('.elba-slider');
};

Slider.getSlides = function() {
    return this.el.querySelectorAll('.elba');
};

Slider.getArrows = function() {
    return this.el.querySelectorAll('.elba-arrow');
};

Slider.getSlidesCount = function() {
    if (this.count) return this.count;
    return this.count = this.getSlides().length;
};

/**
 * Get the container width, that is this.el's width
 * @return {Number}
 */
Slider.getContainerWidth = function() {
    if (this.containerWidth) return this.containerWidth;
    return this.containerWidth = this.el.clientWidth;
};



function Elba(selector, options) {

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
        slideshow: 8000,
        preload: 1,
        swipeThreshold: 60,
        //Hint for the direction to load
        directionHint: 'right'
    };

    var _createInstance = function(el, GUID, options) {
        return Object.create(Slider, {
            el: {
                writable: false,
                value: el
            },
            GUID: {
                writable: false,
                value: GUID
            },
            settings: {
                writable: true,
                value: options
            },
            slider: {
                writable: true,
                configurable: true,
                value: null
            },
            slidesMap: {
                writable: true,
                enumerable: true,
                value: {}
            },
            count: {
                writable: true,
                value: 0
            },
            source: {
                writable: true,
                value: {}
            },
            containerWidth: {
                writable: true,
                value: 0
            },
            pointer: {
                writable: true,
                value: 0
            },
            isSettled: {
                writable: true,
                value: true
            }
        });
    };

    // Extend default options
    var settings = Utils.extend(_defaults, options);

    this.instances = [];

    if (selector.indexOf('#') > -1) {
        var target = selector.slice(1);
        var GUID = Utils.generateGUID();
        Instances[GUID] = _createInstance(document.getElementById(target), GUID, settings);
        Instances[GUID].init();
        this.instances.push(GUID);
    }
}

return Elba;
});
