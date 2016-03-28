/**
 * Remember: 
 * this.proxy.pointer % this.getSlidesCount() is equal to 0 when we are pointing the last slide
 * this.proxy.pointer % this.getSlidesCount() is equal to 1 when we are pointing the first slide
 * this.proxy.pointer % this.getSlidesCount() is equal to N when we are pointing the Nth slide but not the last
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

    this.proxy.oldPointer = this.proxy.pointer;

    if (direction === 'next') {

        this.proxy.pointer += 1;

        //console.log(this.proxy.pointer);

        if (this.proxy.pointer >= this.slidesMap.length) {

            var tmpPointer = 0;
            denormalizedOffset = this.getCellDenormalizedOffset(this.proxy.pointer);
            alignOffsetAdjustment = this.getCellAlignOffsetAdjustment(tmpPointer);

        } else {

            alignOffsetAdjustment = this.getCellAlignOffsetAdjustment(this.proxy.pointer);
            denormalizedOffset = this.getCellDenormalizedOffset(this.proxy.pointer);
        }

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

        this.proxy.pointer -= 1;

        if (this.proxy.pointer < 0) {

            var tmpPointer = this.slidesMap.length - 1;
            denormalizedOffset = -this.slidesMap[tmpPointer].width;
            alignOffsetAdjustment = this.getCellAlignOffsetAdjustment(tmpPointer);

        } else {

            denormalizedOffset = this.getCellDenormalizedOffset(this.proxy.pointer);
            alignOffsetAdjustment = this.getCellAlignOffsetAdjustment(this.proxy.pointer);
        }

        switch (this.settings.align) {
            case 'center':
                offset = -startingXCssTranlation - denormalizedOffset + alignOffsetAdjustment;
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
    var _slides = this.getSlides();
    var _slidesMap = this.slidesMap;
    var _proxy = this.proxy;

    var slidesCount = _slidesMap.length;
    var lastCellIndex = slidesCount - 1;
    var startingOffset = startingXCssTranlation || _proxy.xCssTranslation;

    _proxy.targetOffset = offset;
    start = null;

    if (!_proxy.isSettled) {
        cAF(animation);
        _proxy.isSettled = true;
    } else {
        _proxy.oldPointer = _proxy.pointer;
    }

    function translate3d(distance) {
        _slider.style[vendorTransform] = 'translate3d(' + (distance) + 'px,0,0)';
        _proxy.updateTranslation(distance);
    }

    function step(timestamp) {

        if (start === null) start = timestamp;
        _proxy.isSettled = false;

        var timePassed = (timestamp - start);
        var progress = timePassed / duration;

        var progressDelta = Number(Math.round(_proxy.targetOffset * easing.get(progress) + 'e2') + 'e-2');

        if (progress >= 1) {
            progressDelta = _proxy.targetOffset;
            progress = 1;
        }

        // If we are swiping left
        if (_proxy.targetOffset > 0) {

            // If we are pointing the first cell but then we swipe left
            if (_proxy.pointer === -1 && !_proxy.isFirstElTranslated && Math.abs(progressDelta) >= (_slidesMap[lastCellIndex].width / 2)) {

                // Update the pointer to the last cell
                _proxy.pointer = lastCellIndex;

                // Put the last cell on the tail
                _slides[lastCellIndex].style.left = _proxy.totalSlidesWidth - _slidesMap[lastCellIndex].width + 'px';
                _proxy.isLastElTranslated = false;

                // Put the first cell on the tail
                _slides[0].style.left = _proxy.totalSlidesWidth + 'px';
                _proxy.isFirstElTranslated = true;

                var newStartingPoint = -(_proxy.totalSlidesWidth - progressDelta);

                startingOffset = newStartingPoint - progressDelta;
                _proxy.isWrapProcessOngoing = true;

                translate3d(newStartingPoint);

            } else {

                if (Math.abs(_proxy.xNormalizedTranslation) <= (_slidesMap[0].normalizedWidth - 0.016) && _proxy.isFirstElTranslated) {
                    console.log('Put the first cell on the head');
                    console.log(Math.abs(_proxy.xNormalizedTranslation));
                    // Put the first cell on the head
                    _slides[0].style.left = 0 + 'px';
                    _proxy.isFirstElTranslated = false;

                } else if ((Math.abs(_proxy.xNormalizedTranslation) + _slidesMap[lastCellIndex].normalizedWidth - 0.016) <= 1 && !_proxy.isLastElTranslated) {
                    console.log('Put the last cell on the head');
                    console.log(Math.abs(_proxy.xNormalizedTranslation));
                    // Put the last cell on the head
                    _slides[lastCellIndex].style.left = (-_slidesMap[lastCellIndex].width) + 'px';
                    _proxy.isLastElTranslated = true;
                }

                translate3d(progressDelta + startingOffset);
            }

            // If we are swiping right
        } else {

            // If we are pointing the last cell but then we swipe right
            if (_proxy.pointer === lastCellIndex + 1 && _proxy.isFirstElTranslated && Math.abs(progressDelta) >= (_slidesMap[0].width / 2)) {

                // Update the pointer to the first cell
                _proxy.pointer = 0;

                // Put the last cell on the head
                _slides[lastCellIndex].style.left = -_slidesMap[lastCellIndex].width + 'px';
                _proxy.isLastElTranslated = true;

                // Put the first cell on its own place
                _slides[0].style.left = '0px';
                _proxy.isFirstElTranslated = false;

                var newStartingPoint = -(_proxy.targetOffset - progressDelta);

                startingOffset = newStartingPoint - progressDelta;
                _proxy.isWrapProcessOngoing = true;

                translate3d(newStartingPoint);

            } else {

                if (Math.abs(_proxy.xNormalizedTranslation) >= (_slidesMap[0].normalizedWidth + 0.016) && !_proxy.isFirstElTranslated) {
                    console.log('Put first cell in the tail');
                    console.log(Math.abs(_proxy.xNormalizedTranslation));
                    // Put the first cell in the tail
                    _slides[0].style.left = _proxy.totalSlidesWidth + 'px';
                    _proxy.isFirstElTranslated = true;

                } else if (Math.abs(_proxy.xNormalizedTranslation) >= (_slidesMap[lastCellIndex].normalizedWidth + 0.016) && _proxy.isLastElTranslated) {
                    console.log('Put the last cell in the tail');
                    console.log(Math.abs(_proxy.xNormalizedTranslation));
                    // Put the last cell in the tail
                    _slides[lastCellIndex].style.left = (_proxy.totalSlidesWidth - _slidesMap[lastCellIndex].width) + 'px';
                    _proxy.isLastElTranslated = false;

                }

                translate3d(progressDelta + startingOffset);
            }
        }

        if (progress === 1) {
            _slider.style[vendorTransform] = 'translate(' + (_proxy.targetOffset + startingOffset) + 'px,0)';
            cAF(animation);

            // Update proxy
            _proxy.updateTranslation(progressDelta + startingOffset);
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
    for (var i = 0; i < index; i++) {
        if (this.slidesMap[i]) normalizedSummation += this.slidesMap[i].normalizedWidth;
    }
    return (normalizedSummation * this.proxy.viewportWidth);
};

Player.getCellAlignOffsetAdjustment = function(index) {
    return (this.proxy.viewportWidth - this.slidesMap[index].width) / 2;
};