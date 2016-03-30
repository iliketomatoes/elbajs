/*! elba - v0.5.0 - 2016-03-30
* https://github.com/iliketomatoes/elbajs
* Copyright (c) 2016 ; Licensed  */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.BezierEasing=e()}}(function(){return function e(t,n,r){function i(s,u){if(!n[s]){if(!t[s]){var a="function"==typeof require&&require;if(!u&&a)return a(s,!0);if(o)return o(s,!0);var f=new Error("Cannot find module '"+s+"'");throw f.code="MODULE_NOT_FOUND",f}var p=n[s]={exports:{}};t[s][0].call(p.exports,function(e){var n=t[s][1][e];return i(n?n:e)},p,p.exports,e,t,n,r)}return n[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(e,t){function n(e,t){return 1-3*t+3*e}function r(e,t){return 3*t-6*e}function i(e){return 3*e}function o(e,t,o){return((n(t,o)*e+r(t,o))*e+i(t))*e}function s(e,t,o){return 3*n(t,o)*e*e+2*r(t,o)*e+i(t)}function u(e,t,n,r,i){var s,u,a=0;do u=t+(n-t)/2,s=o(u,r,i)-e,s>0?n=u:t=u;while(Math.abs(s)>h&&++a<l);return u}function a(e,t,n,r){for(var i=0;p>i;++i){var u=s(t,n,r);if(0===u)return t;var a=o(t,n,r)-e;t-=a/u}return t}function f(e,t,n,r){if(4===arguments.length)return new f([e,t,n,r]);if(!(this instanceof f))return new f(e);if(!e||4!==e.length)throw new Error("BezierEasing: points must contains 4 values");for(var i=0;4>i;++i)if("number"!=typeof e[i]||isNaN(e[i])||!isFinite(e[i]))throw new Error("BezierEasing: points should be integers.");if(e[0]<0||e[0]>1||e[2]<0||e[2]>1)throw new Error("BezierEasing x values must be in [0, 1] range.");this._str="BezierEasing("+e+")",this._css="cubic-bezier("+e+")",this._p=e,this._mSampleValues=m?new Float32Array(_):new Array(_),this._precomputed=!1,this.get=this.get.bind(this)}var p=4,c=.001,h=1e-7,l=10,_=11,d=1/(_-1),m="function"==typeof Float32Array;f.prototype={get:function(e){var t=this._p[0],n=this._p[1],r=this._p[2],i=this._p[3];return this._precomputed||this._precompute(),t===n&&r===i?e:0===e?0:1===e?1:o(this._getTForX(e),n,i)},getPoints:function(){return this._p},toString:function(){return this._str},toCSS:function(){return this._css},_precompute:function(){var e=this._p[0],t=this._p[1],n=this._p[2],r=this._p[3];this._precomputed=!0,(e!==t||n!==r)&&this._calcSampleValues()},_calcSampleValues:function(){for(var e=this._p[0],t=this._p[2],n=0;_>n;++n)this._mSampleValues[n]=o(n*d,e,t)},_getTForX:function(e){for(var t=this._p[0],n=this._p[2],r=this._mSampleValues,i=0,o=1,f=_-1;o!==f&&r[o]<=e;++o)i+=d;--o;var p=(e-r[o])/(r[o+1]-r[o]),h=i+p*d,l=s(h,t,n);return l>=c?a(e,h,t,n):0===l?h:u(e,i,i+d,t,n)}},f.css={ease:f.ease=f(.25,.1,.25,1),linear:f.linear=f(0,0,1,1),"ease-in":f.easeIn=f(.42,0,1,1),"ease-out":f.easeOut=f(0,0,.58,1),"ease-in-out":f.easeInOut=f(.42,0,.58,1)},t.exports=f},{}]},{},[1])(1)});
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

(function(window, Elba) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        // Register Elba as an AMD module
        define(Elba);

    } else if (typeof module == 'object' && module.exports) {
        // Register Elba for CommonJS
        module.exports = factory;

    } else {
        // Register Elba on window
        window.Elba = Elba();
    }

})(window, function() {

'use strict';

// Object storing slider instances
var Instances = {};

// Helper variable that holds the slider instance that has been clicked
// upon, to handle the dragging event.
var TargetInstance = null;

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

var vendorComputedTransform = (function() {
    var st = window.getComputedStyle(testElement, null);
    var prefixes = 'transform -webkit-transform -moz-transform -ms-transform -o-transform'.split(' ');
    for (var i = 0; i < prefixes.length; i++) {
        if (st.getPropertyValue(prefixes[i]) !== undefined) {
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

var rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cAF = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

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

// https://github.com/HenrikJoreteg/get-css-translated-position/blob/master/index.js
// Updated by Giancarlo Soverini on 2016-3-4
function getCssTranslationX(el) {

    var re = /matrix\((.*)\)/;
    var pos;

    var cS = window.getComputedStyle(el)[vendorComputedTransform];

    if (cS.indexOf('matrix') > -1) {
        pos = re.exec(cS)[1].split(',').map(function(item) {
            return parseFloat(item);
        });
        return pos[4];
    } else {
        return 0;
    }
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
    },

    /**
     * @param {Number} smallN
     * @param {Number} bigN
     * @return {Number}
     */
    getPercentageRatio: function(smallN, bigN) {
        var percentage = ((smallN / bigN)).toFixed(2);
        return percentage * 100;
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
    build: function() {
        this.setLayout();

        // Set slides' layout
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
    var start = 0;
    for (var i = 1; i < slides.length; i++) {
        var tmp = this.slidesMap[i - 1].width;
        if (this.proxy.isWrappable && i === (slides.length - 1)) {
            slides[i].style.left = -tmp + 'px';
            this.proxy.isLastElTranslated = true;
        } else {
            slides[i].style.left = (tmp + start) + 'px';
            start += tmp;
        }
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
    var viewportWidth = this.getViewportWidth();
    for (var i = 0; i < slides.length; i++) {
        if (typeof this.slidesMap[i] === 'undefined') this.slidesMap[i] = {};
        this.slidesMap[i].width = parseFloat(window.getComputedStyle(slides[i]).getPropertyValue('width'));
        this.slidesMap[i].normalizedWidth = this.slidesMap[i].width / viewportWidth;
        this.proxy.totalSlidesWidth += this.slidesMap[i].width;
    }
    this.proxy.totalNormalizedSlidesWidth = this.proxy.totalSlidesWidth / viewportWidth;
};

/**
 * Get the container width, that is elba-viewport's width
 * @return {Number} expressed in px
 */
Builder.getViewportWidth = function() {
    if (this.proxy.viewportWidth) return this.proxy.viewportWidth;
    return this.proxy.viewportWidth = this.el.querySelector('.elba-viewport').clientWidth;
};

var Player = Object.create(Builder);

Player.goTo = function(direction) {

    var offset,
        alignOffsetAdjustment,
        denormalizedOffset,
        normalizedPointer;

    this.proxy.oldPointer = this.proxy.pointer;

    if (this.proxy.isSettled) {
        this.proxy.pointer = this.proxy.pointer % this.slidesMap.length;
    }

    if (direction === 'next') {

        this.proxy.pointer += 1;

        normalizedPointer = this.proxy.pointer % this.slidesMap.length;

        if (this.proxy.pointer >= this.slidesMap.length && !this.proxy.isWrapProcessOngoing) {
            this.proxy.isWrapProcessOngoing = true;
        }

        alignOffsetAdjustment = this.getCellAlignOffsetAdjustment(normalizedPointer);
        denormalizedOffset = this.getCellDenormalizedOffset(normalizedPointer);

        switch (this.settings.align) {
            case 'center':
                offset = -(denormalizedOffset - alignOffsetAdjustment);
                break;
            case 'left':
                offset = -(this.slidesMap[oldPointer].width);
                break;
            case 'right':
                offset = -targetSlideWidth;
                break;
            default:
                offset = -(this.slidesMap[oldPointer].width / 2) - (targetSlideWidth / 2)
                break;
        }

    } else if (direction === 'previous') {

        this.proxy.pointer -= 1;

        if (this.proxy.pointer < 0) {

            this.proxy.isWrapProcessOngoing = true;
            var tmpPointer = this.slidesMap.length - 1;
            denormalizedOffset = -this.slidesMap[tmpPointer].width;
            alignOffsetAdjustment = this.getCellAlignOffsetAdjustment(tmpPointer);
            this.proxy.pointer = this.slidesMap.length;

        } else {

            denormalizedOffset = this.getCellDenormalizedOffset(this.proxy.pointer);
            alignOffsetAdjustment = this.getCellAlignOffsetAdjustment(this.proxy.pointer);
        }

        switch (this.settings.align) {
            case 'center':
                offset = denormalizedOffset + alignOffsetAdjustment;
                break;
            case 'left':
                offset = (this.slidesMap[this.proxy.pointer].width);
                break;
            case 'right':
                offset = (this.slidesMap[oldPointer].width);
                break;
            default:
                offset = (this.slidesMap[oldPointer].width / 2) + (targetSlideWidth / 2);
                break;
        }

    }

    this.slide(offset);
};

/**
 * N.B. offset is negative when you swipe right, and positive when you swipe left.
 * @param {Number} offset to final destination expressed in px.
 */
Player.slide = function(offset) {
    var timePassed,
        start,
        animation;

    var duration = this.settings.duration;
    var easing = BezierEasing.css['ease-in-out'];

    var self = this;
    var _slides = this.getSlides();

    var lastCellIndex = this.slidesMap.length - 1;
    var startingOffset = this.proxy.xCssTranslation;

    var normalizedPointer = self.proxy.pointer % self.slidesMap.length;

    if (this.proxy.isWrapProcessOngoing) {
        offset -= this.proxy.totalSlidesWidth;
    }

    this.proxy.targetOffset = offset - startingOffset;
    
    start = null;

    if (this.proxy.animation > 0) {
        console.log('distrutta animazione');
        cAF(this.proxy.animation);
        this.proxy.animation = null;
    }

    this.proxy.isSettled = false;

    function translate3d(distance) {
        self.slider.style[vendorTransform] = 'translate3d(' + (distance) + 'px,0,0)';
        self.proxy.updateTranslation(distance);
    }

    function step(timestamp) {

        if (start === null) start = timestamp;

        var timePassed = (timestamp - start);
        var progress = timePassed / duration;

        var progressDelta = Number(Math.round(self.proxy.targetOffset * easing.get(progress) + 'e2') + 'e-2');

        if (progress >= 1) {
            progressDelta = self.proxy.targetOffset;
            progress = 1;
        }

        // If we are pointing the last cell but then we swipe right
        if (self.proxy.isWrapProcessOngoing && self.proxy.isFirstElTranslated) {

            if (Math.abs(progressDelta) >= (self.slidesMap[0].width / 2)) {
                console.log('Wrap process realized');
                console.log(self.proxy.targetOffset);

                // Put the last cell on the head
                _slides[lastCellIndex].style.left = -self.slidesMap[lastCellIndex].width + 'px';
                self.proxy.isLastElTranslated = true;

                // Put the first cell on its own place
                _slides[0].style.left = '0px';
                self.proxy.isFirstElTranslated = false;

                var newStartingPoint = -self.proxy.targetOffset + progressDelta;

                if (self.proxy.pointer > self.slidesMap.length) {
                    newStartingPoint -= self.getCellDenormalizedOffset(normalizedPointer) - self.getCellAlignOffsetAdjustment(normalizedPointer);
                }

                startingOffset = newStartingPoint - progressDelta;
                self.proxy.isWrapProcessOngoing = false;

                translate3d(newStartingPoint);

            } else {
                translate3d(progressDelta + startingOffset);
            }

        } else {

            if (Math.abs(self.proxy.xNormalizedTranslation) >= (self.slidesMap[0].normalizedWidth + 0.016) && !self.proxy.isFirstElTranslated) {
                console.log('Put first cell on the tail');
                // Put the first cell in the tail
                _slides[0].style.left = self.proxy.totalSlidesWidth + 'px';
                self.proxy.isFirstElTranslated = true;

            } else if (Math.abs(self.proxy.xNormalizedTranslation) >= (self.slidesMap[lastCellIndex].normalizedWidth + 0.016) && self.proxy.isLastElTranslated) {
                console.log('Put the last cell on the tail');
                // Put the last cell in the tail
                _slides[lastCellIndex].style.left = (self.proxy.totalSlidesWidth - self.slidesMap[lastCellIndex].width) + 'px';
                self.proxy.isLastElTranslated = false;

            }

            translate3d(progressDelta + startingOffset);
        }

        if (progress === 1) {
            console.log('animazione finita');
            console.log(normalizedPointer);
            self.slider.style[vendorTransform] = 'translate(' + (self.proxy.targetOffset + startingOffset) + 'px,0)';
            cAF(self.proxy.animation);

            // Update proxy
            self.proxy.updateTranslation(progressDelta + startingOffset);
            self.proxy.isSettled = true;
            self.proxy.animation = null;
            start = null;

        } else if (self.proxy.animation) {

            self.proxy.animation = rAF(step);
        }
    }

    self.proxy.animation = rAF(step);
};

Player.getCellAlignOffsetAdjustment = function(index) {
    return (this.proxy.viewportWidth - this.slidesMap[index].width) / 2;
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
	var viewport = this.el.querySelector('.elba-viewport');
	Utils.setListener(viewport, Tocca.events.start, sliderDragStartHandler.bind(this));
};

var Slider = Object.create(Eventie);

Slider.init = function() {
    this.build();

    if (this.settings.navigation && this.slidesMap.length > 1) {
        this.setNavigation();
    }

    this.slider = this.el.querySelector('.elba-slider');

    this.updateProxy();

    this.initEvents();
};

Slider.getSlides = function() {
    return this.el.querySelectorAll('.elba');
};

Slider.getArrows = function() {
    return this.el.querySelectorAll('.elba-arrow');
};

Slider.updateProxy = function() {
    this.proxy.viewportWidth = this.getViewportWidth();
    this.proxy.xCssTranslation = getCssTranslationX(this.slider);
};

Slider.getCellDenormalizedOffset = function(index) {
    var normalizedSummation = 0;
    for (var i = 0; i < index; i++) {
        if (this.slidesMap[i]) normalizedSummation += this.slidesMap[i].normalizedWidth;
    }
    return (normalizedSummation * this.proxy.viewportWidth);
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
        directionHint: 'right',
        align: 'center'
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
            proxy: {
                writable: true,
                value: true,
                value: {
                    pointer: 0,
                    oldPointer: 0,
                    isSettled: true,
                    isWrappable: true,
                    isFirstElTranslated: false,
                    isLastElTranslated: false,
                    isWrapProcessOngoing: false,
                    viewportWidth: 0,
                    xCssTranslation: 0,
                    xNormalizedTranslation: 0,
                    totalSlidesWidth: 0,
                    totalNormalizedSlidesWidth: 0,
                    targetOffset: 0,
                    animation: null,
                    updateTranslation: function(offset){
                        this.xCssTranslation = offset;
                        this.xNormalizedTranslation = offset / this.viewportWidth;
                    }
                }
            },
            slidesMap: {
                writable: true,
                enumerable: true,
                value: []
            },
            source: {
                writable: true,
                value: {}
            }
        });
    };

    // Extend default options
    var settings = Utils.extend(_defaults, options);

    var targetElements = document.querySelectorAll(selector);

    this.instances = [];

    var i = 0;

    while (targetElements[i]) {
        var GUID = Utils.generateGUID();
        Instances[GUID] = _createInstance(targetElements[i], GUID, settings);
        Instances[GUID].init();
        this.instances.push(GUID);
        i++;
    }
}

return Elba;
});
