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
