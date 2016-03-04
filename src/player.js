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

// http://stackoverflow.com/a/28567829
// Updated by Giancarlo Soverini on 2016-3-4
function getTransform(el) {
    var st = window.getComputedStyle(el, null);
    var transform = st.getPropertyValue("transform") ||
        st.getPropertyValue("-webkit-transform") ||
        st.getPropertyValue("-moz-transform") ||
        st.getPropertyValue("-ms-transform") ||
        st.getPropertyValue("-o-transform");

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

    this.pointer += 1;
    /*var offset = (-this.pointer - 1) * 100;
    
    console.log(this.slidesMap[this.pointer].width);*/
    // console.log(this.pointer % this.getSlidesCount());
    // console.log(this.pointer / this.getSlidesCount());
    /*if (this.pointer >= (this.count - 1)) {
        //console.log(this.pointer);
        //console.log((this.pointer + 1) % this.getSlidesCount());
        var _nextSlide = Utils.getNodeElementByIndex(this.getSlides(), (this.pointer + 1) % this.getSlidesCount());
        _nextSlide.style.left = (this.pointer + 1) * 100 + '%';
    }*/

    var offset = -Utils.intVal(this.slidesMap[this.pointer].width);

    this.slide(offset);

};

Player.goToPrevious = function() {

    /*var offset = (-(this.pointer - 1)) * 100;
    this.pointer -= 1;*/
    this.slide(this.slidesMap[this.pointer].width);

};

Player.goTo = function(direction) {
    if (direction === 'next') {
        this.goToNext();
    } else if (direction === 'previous') {
        this.goToPrevious();
    }
};

/**
 * @param {Number} width expressed in px
 */
Player.slide = function(offset) {
    var _slider = this.getSlider();
    var startingOffset = Utils.intVal(getTransform(_slider)[0]);

    /*var finalOffset = startingOffset + offset;
    console.log(finalOffset);*/

    var percentageOffset = Utils.getPercentageRatio(offset + startingOffset, this.getContainerWidth());
    console.log(percentageOffset);

    rAF(function() {
        _slider.style[vendorTransition] = vendorTransform + ' 0.8s';
        _slider.style[vendorTransform] = 'translate3d(' + percentageOffset + '%,0,0)';
    });
};
