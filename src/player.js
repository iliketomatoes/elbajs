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
        targetSlideWidth;
    var startingOffset = parseFloat(getTransform(this.getSlider())[0]);

    if (direction === 'next') {

        this.pointer += 1;
        targetSlideWidth = this.slidesMap[this.pointer].width;

        switch (this.settings.align) {
            case 'center':
                offset = (this.slidesMap[this.pointer - 1].width / 2) + (targetSlideWidth / 2);
                break;
            case 'left':
                offset = (this.slidesMap[this.pointer - 1].width);
                break;
            case 'right':
                offset = targetSlideWidth;
                break;
            default:
                offset = (this.slidesMap[this.pointer - 1].width / 2) + (targetSlideWidth / 2)
                break;
        }

        this.slide(-offset, startingOffset);

    } else if (direction === 'previous') {

        this.pointer -= 1;
        targetSlideWidth = this.slidesMap[this.pointer].width;

        switch (this.settings.align) {
            case 'center':
                offset = (this.slidesMap[this.pointer + 1].width / 2) + (targetSlideWidth / 2);
                break;
            case 'left':
                offset = (this.slidesMap[this.pointer].width);
                break;
            case 'right':
                offset = (this.slidesMap[this.pointer + 1].width);
                break;
            default:
                offset = (this.slidesMap[this.pointer + 1].width / 2) + (targetSlideWidth / 2);
                break;
        }

        this.slide(offset, startingOffset);
    }


};

/**
 * @param {Number} offset to final destination expressed in px. 
 * @param {Number} starting slider's offset expressed in px. 
 */
Player.slide = function(offset, startingOffset) {
    var timePassed;
    var start = null;
    var _settled = false;
    var duration = this.settings.duration;
    var _slider = this.getSlider();
    var easing = BezierEasing.css['ease-in-out'];

    this.isSettled = _settled;

    function step(timestamp) {
        if (start === null) start = timestamp;

        var timePassed = (timestamp - start);
        var progress = timePassed / duration;
        console.log(timePassed);

        var adjustedOffset = Number(Math.round(offset * easing.get(progress) + 'e2') + 'e-2');

        if (progress >= 1) {
            adjustedOffset = offset;
            progress = 1;
        }

        _slider.style[vendorTransform] = 'translate3d(' + (adjustedOffset + startingOffset) + 'px,0,0)';

        if (progress === 1) {

            cAF(step);
            start = null;
            _settled = true;

        } else {

            rAF(step);
        }
    }

    rAF(step);
};
