/**
 * Remember: 
 * this.pointer % this.getSlidesCount() is equal to 0 when we are pointing the last slide
 * this.pointer % this.getSlidesCount() is equal to 1 when we are pointing the first slide
 * this.pointer % this.getSlidesCount() is equal to N when we are pointing the Nth slide but not the last
 *
 * Note: we assume that pointer starts from 0.
 */

var Player = Object.create(Builder);

Player.goTo = function(direction) {
    if (direction === 'next') {
        this.goToNext();
    } else if (direction === 'previous') {
        this.goToPrevious();
    }
};

Player.goToNext = function() {

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
    this.pointer += 1;

    var offset,
        percentageOffset;
    var startingOffset = Utils.intVal(getTransform(this.getSlider())[0]);
    var targetSlideWidth = this.slidesMap[this.pointer].width;
    var elbaViewportWidth = this.getContainerWidth();

    switch(this.settings.align) {
        case 'center':
            // TODO
            offset = -startingOffset + (this.slidesMap[this.pointer - 1].width / 2) + ( targetSlideWidth / 2);
            break;
        case 'left':
            // TODO
            offset = ((elbaViewportWidth + targetSlideWidth) / 2) - startingOffset;
            break;
        case 'right':
            // TODO
            offset = ((elbaViewportWidth + targetSlideWidth) / 2) - startingOffset;
            break;
        default:
            offset = ((elbaViewportWidth + targetSlideWidth) / 2) - startingOffset;
            // TODO
            break;
    }
    percentageOffset = Utils.getPercentageRatio(offset, elbaViewportWidth ) + '%';
    this.slide('-' + percentageOffset);
};

Player.goToPrevious = function() {
    this.pointer -= 1;

    var offset,
        percentageOffset;
    var startingOffset = Utils.intVal(getTransform(this.getSlider())[0]);
    var targetSlideWidth = this.slidesMap[this.pointer].width;
    var elbaViewportWidth = this.getContainerWidth();

    switch(this.settings.align) {
        case 'center':
            // TODO
            offset = startingOffset + (this.slidesMap[this.pointer + 1].width / 2) + ( targetSlideWidth / 2);
            break;
        case 'left':
            // TODO
            offset = ((elbaViewportWidth + targetSlideWidth) / 2) - startingOffset;
            break;
        case 'right':
            // TODO
            offset = ((elbaViewportWidth + targetSlideWidth) / 2) - startingOffset;
            break;
        default:
            offset = ((elbaViewportWidth + targetSlideWidth) / 2) - startingOffset;
            // TODO
            break;
    }
    
    percentageOffset = Utils.getPercentageRatio(offset, elbaViewportWidth ) + '%';
    this.slide(percentageOffset);

};

/**
 * @param {Number} offset can either be expressed in px or %. 
 *      If expressed in px it will get casted to %.
 * @param {Number} the second argument is optional.
 *      It is the viewport width expressed in px. 
 */
Player.slide = function(offset, elbaViewportWidth) {
    
    var containerWidth,
        percentageOffset;

    var _slider = this.getSlider();

    // We want the offset to be expressed in %
    if(typeof offset === 'number') {
        containerWidth = elbaViewportWidth || this.getContainerWidth();
        percentageOffset = Utils.getPercentageRatio(offset, containerWidth) + '%';
    }else {
        percentageOffset = offset;
    }

    rAF(function() {
        _slider.style[vendorTransition] = vendorTransform + ' 0.8s';
        _slider.style[vendorTransform] = 'translate3d(' + percentageOffset + ',0,0)';
    });
};
