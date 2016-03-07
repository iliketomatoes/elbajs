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
        alignOffsetAdjustment,
        denormalizedOffset;
    
    var startingXCssTranlation = this.proxy.xCssTranslation;
    var _slider = this.getSlider();

    if (direction === 'next') {

        this.pointer += 1;
        alignOffsetAdjustment = this.getCellAlignOffsetAdjustment(this.pointer);
        denormalizedOffset = this.getCellDenormalizedOffset(this.pointer);

        switch (this.settings.align) {
            case 'center':
                offset = -(denormalizedOffset - alignOffsetAdjustment + startingXCssTranlation);
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

        this.pointer -= 1;
        if (this.pointer < 0) {
            this.pointer += this.slidesMap.length;
        }
        alignOffsetAdjustment = this.getCellAlignOffsetAdjustment(this.pointer);
        denormalizedOffset = this.getCellDenormalizedOffset(this.pointer);
        
        switch (this.settings.align) {
            case 'center':
                offset = -startingXCssTranlation - denormalizedOffset + alignOffsetAdjustment;
                console.log(offset);
                break;
            case 'left':
                offset = (this.slidesMap[this.pointer].width);
                break;
            case 'right':
                offset = (this.slidesMap[oldPointer].width);
                break;
            default:
                offset = (this.slidesMap[oldPointer].width / 2) + (targetSlideWidth / 2);
                break;
        }

    }

    //console.log(startingXCssTranlation);
   
    this.slide(offset, startingXCssTranlation);
};

/**
 * N.B. offset is negative when you swipe right, and positive when you swipe left.
 * @param {Number} offset to final destination expressed in px.
 */
Player.slide = function(offset, startingXCssTranlation) {
    var timePassed,
        start,
        animation;

    var duration = this.settings.duration;
    var easing = BezierEasing.css['ease-in-out'];

    var _slider = this.getSlider();
    var _pointer = this.pointer;
    var _slides = this.getSlides();
    var _slidesMap = this.slidesMap;
    var _proxy = this.proxy;

    var slidesCount = _slidesMap.length;
    var startingOffset = startingXCssTranlation || _proxy.xCssTranslation;

    start = null;

    if(!_proxy.isSettled) {
        cAF(animation);
        _proxy.isSettled = true;
    }

    function step(timestamp) {

        if (start === null) start = timestamp;
        _proxy.isSettled = false;

        var timePassed = (timestamp - start);
        var progress = timePassed / duration;

        var adjustedOffset = Number(Math.round(offset * easing.get(progress) + 'e2') + 'e-2');

        if (progress >= 1) {
            adjustedOffset = offset;
            progress = 1;
        }

        // If we are swiping left
        if (offset > 0) {

            if (_pointer === (slidesCount - 1)) {
                console.log('si va verso la cuccagna');
            }

            // Put the first cell on the head
            if (_pointer === 1 && _proxy.isFirstElTranslated) {
                if (Math.abs(adjustedOffset) >= (_slidesMap[_pointer].width / 2)) {
                    console.log('si torna indietro');
                    _slides[0].style.left = 0 + 'px';
                    _proxy.isFirstElTranslated = false;
                }
            }

            _slider.style[vendorTransform] = 'translate3d(' + (adjustedOffset + startingOffset) + 'px,0,0)';

        // If we are swiping right
        } else {

            if (_pointer === (slidesCount - 2) && _proxy.isLastElTranslated) {
                // Put the last cell on the tail
                if (Math.abs(adjustedOffset) >= (_slidesMap[_pointer].width / 2)) {
                    _slides[_pointer + 1].style.left = (_proxy.totalSlidesWidth - _slidesMap[_pointer + 1].width) + 'px';
                    _proxy.isLastElTranslated = false;
                }
            }

            
            if (_pointer === (slidesCount - 1) && !_proxy.isFirstElTranslated) {
                // Put the first cell on the tail
                if (Math.abs(adjustedOffset) >= (_slidesMap[_pointer - 1].width / 2)) {
                    _slides[0].style.left = _proxy.totalSlidesWidth + 'px';
                    _proxy.isFirstElTranslated = true;
                }

            }  

            _slider.style[vendorTransform] = 'translate3d(' + (adjustedOffset + startingOffset) + 'px,0,0)';
        }

        _proxy.xCssTranslation = adjustedOffset + startingOffset;

        if (progress === 1) {
            _slider.style[vendorTransform] = 'translate(' + (offset + startingOffset) + 'px,0)';
            cAF(animation);

            // Update proxy
            _proxy.xCssTranslation = offset + startingOffset;
            _proxy.isSettled = true;

            start = null;

        } else {

            animation = rAF(step);
        }
    }

    animation = rAF(step);
};


Player.getCellDenormalizedOffset = function(index) {
    var normalizedSummation = 0;
    for(var i = 0; i < index; i++) {
        normalizedSummation += this.slidesMap[i].normalizedWidth;
    }
    return (normalizedSummation * this.proxy.viewportWidth);
};

Player.getCellAlignOffsetAdjustment = function(index) {
    return (this.proxy.viewportWidth - this.slidesMap[index].width) / 2;
};
