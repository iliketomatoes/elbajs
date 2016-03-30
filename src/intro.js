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