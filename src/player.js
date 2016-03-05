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

    var offset,
        percentageOffset,
        targetSlideWidth;
    var startingOffset = Utils.intVal(getTransform(this.getSlider())[0]);
    var elbaViewportWidth = this.getContainerWidth();

    if (direction === 'next') {

        this.pointer += 1;
        targetSlideWidth = this.slidesMap[this.pointer].width;

        switch (this.settings.align) {
            case 'center':
                offset = -startingOffset + (this.slidesMap[this.pointer - 1].width / 2) + (targetSlideWidth / 2);
                break;
            case 'left':
                offset = -startingOffset + (this.slidesMap[this.pointer - 1].width);
                break;
            case 'right':
                offset = -startingOffset + targetSlideWidth;
                break;
            default:
                offset = -startingOffset + (this.slidesMap[this.pointer - 1].width / 2) + (targetSlideWidth / 2)
                break;
        }

        percentageOffset = '-' + Utils.getPercentageRatio(offset, elbaViewportWidth) + '%';

    } else if (direction === 'previous') {

        this.pointer -= 1;
        targetSlideWidth = this.slidesMap[this.pointer].width;

        switch (this.settings.align) {
            case 'center':
                offset = startingOffset + (this.slidesMap[this.pointer + 1].width / 2) + (targetSlideWidth / 2);
                break;
            case 'left':
                offset = startingOffset + (this.slidesMap[this.pointer].width);
                break;
            case 'right':
                offset = startingOffset + (this.slidesMap[this.pointer + 1].width);
                break;
            default:
                offset = startingOffset + (this.slidesMap[this.pointer + 1].width / 2) + (targetSlideWidth / 2);
                break;
        }

        percentageOffset = Utils.getPercentageRatio(offset, elbaViewportWidth) + '%';

    }

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
    if (typeof offset === 'number') {
        containerWidth = elbaViewportWidth || this.getContainerWidth();
        percentageOffset = Utils.getPercentageRatio(offset, containerWidth) + '%';
    } else {
        percentageOffset = offset;
    }

    rAF(function() {
        _slider.style[vendorTransition] = vendorTransform + ' 0.8s';
        _slider.style[vendorTransform] = 'translate3d(' + percentageOffset + ',0,0)';
    });
};
