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

    if (direction === 'next') {

        this.proxy.pointer += 1;
        alignOffsetAdjustment = this.getCellAlignOffsetAdjustment(this.proxy.pointer);
        denormalizedOffset = this.getCellDenormalizedOffset(this.proxy.pointer);

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
                console.log(offset);
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
    var _slides = this.getSlides();
    var _slidesMap = this.slidesMap;
    var _proxy = this.proxy;
    _proxy.targetOffset = offset;

    var slidesCount = _slidesMap.length;
    var lastCellIndex = slidesCount - 1;
    var startingOffset = startingXCssTranlation || _proxy.xCssTranslation;

    start = null;

    if (!_proxy.isSettled) {
        cAF(animation);
        _proxy.isSettled = true;
    } else {
        _proxy.oldPointer = _proxy.pointer;
    }

    function step(timestamp) {

        console.log(_proxy.xNormalizedTranslation);

        if (start === null) start = timestamp;
        _proxy.isSettled = false;

        var timePassed = (timestamp - start);
        var progress = timePassed / duration;

        var progressOffset = Number(Math.round(_proxy.targetOffset * easing.get(progress) + 'e2') + 'e-2');

        if (progress >= 1) {
            progressOffset = _proxy.targetOffset;
            progress = 1;
        }

        // If we are swiping left
        if (_proxy.targetOffset > 0) {

            if (_proxy.pointer === -1 && !_proxy.isFirstElTranslated && Math.abs(progressOffset) >= (_slidesMap[lastCellIndex].width / 2)) {

                
                    console.log('translate the whole thing');

                    console.log('progressOffset: ');
                    console.log(progressOffset);

                    console.log('old targetOffset: ');
                    console.log(_proxy.targetOffset);

                    // Put the last cell on the tail
                    var denormalizedOffset = _proxy.totalSlidesWidth - _slidesMap[lastCellIndex].width;
                    _slides[lastCellIndex].style.left = denormalizedOffset + 'px';
                    _proxy.isLastElTranslated = false;

                    // Put the first cell on the tail
                    _slides[0].style.left = _proxy.totalSlidesWidth + 'px';
                    _proxy.isFirstElTranslated = true;

                    var targetPoint = denormalizedOffset - (_slidesMap[lastCellIndex].width / 2);

                    var newStartingPoint = -(targetPoint + _proxy.targetOffset - progressOffset);

                    _proxy.updateTranslation(newStartingPoint);

                    _proxy.targetOffset = - newStartingPoint -targetPoint;

                    console.log('new targetOffset: ');
                    console.log(_proxy.targetOffset);

                    console.log('new translate X starting offset: ');
                    console.log(_proxy.xCssTranslation);

                    _slider.style[vendorTransform] = 'translate3d(' + newStartingPoint + 'px,0,0)';

                    startingOffset = _proxy.xCssTranslation;
                    //animation = rAF(step);
                    //cAF(animation);
                    //return false;

            } else {

                /*console.log('Normale swipe left');
                console.log('targetOffset: ');
                console.log(_proxy.targetOffset);*/

                // Put the last cell on the head
                if (_proxy.pointer === 0 && !_proxy.isLastElTranslated) {
                    if (Math.abs(progressOffset) >= (_slidesMap[_proxy.pointer].width / 2)) {
                        console.log('last cell go first');
                        _slides[lastCellIndex].style.left = (-_slidesMap[lastCellIndex].width) + 'px';
                        _proxy.isLastElTranslated = true;
                    }
                }

                // Put the first cell on the head
                if (_proxy.pointer === 1 && _proxy.isFirstElTranslated) {
                    if (Math.abs(progressOffset) >= (_slidesMap[_proxy.pointer].width / 2)) {
                        console.log('first cell go first');
                        _slides[0].style.left = 0 + 'px';
                        _proxy.isFirstElTranslated = false;
                    }
                }

                _slider.style[vendorTransform] = 'translate3d(' + (progressOffset + startingOffset) + 'px,0,0)';

                _proxy.updateTranslation(progressOffset + startingOffset);
            }


            // If we are swiping right
        } else {

            /*console.log('Normale swipe right');
            console.log('targetOffset: ');
            console.log(_proxy.targetOffset);*/

            if (_proxy.pointer === (slidesCount - 2) && _proxy.isLastElTranslated) {
                // Put the last cell on the tail
                if (Math.abs(progressOffset) >= (_slidesMap[_proxy.pointer].width / 2)) {
                    _slides[lastCellIndex].style.left = (_proxy.totalSlidesWidth - _slidesMap[lastCellIndex].width) + 'px';
                    _proxy.isLastElTranslated = false;
                }
            }

            if (_proxy.pointer === (lastCellIndex) && !_proxy.isFirstElTranslated) {
                // Put the first cell on the tail
                if (Math.abs(progressOffset) >= (_slidesMap[_proxy.pointer - 1].width / 2)) {
                    _slides[0].style.left = _proxy.totalSlidesWidth + 'px';
                    _proxy.isFirstElTranslated = true;
                }

            }

            _slider.style[vendorTransform] = 'translate3d(' + (progressOffset + startingOffset) + 'px,0,0)';

            _proxy.updateTranslation(progressOffset + startingOffset);
        }

        if (progress === 1) {
            _slider.style[vendorTransform] = 'translate(' + (_proxy.targetOffset + startingOffset) + 'px,0)';
            cAF(animation);

            // Update proxy
            _proxy.updateTranslation(progressOffset + startingOffset);
            _proxy.isSettled = true;

            start = null;

            console.log(timePassed);

        } else {

            animation = rAF(step);
        }
    }

    animation = rAF(step);
};


Player.getCellDenormalizedOffset = function(index) {
    var normalizedSummation = 0;
    for (var i = 0; i < index; i++) {
        normalizedSummation += this.slidesMap[i].normalizedWidth;
    }
    return (normalizedSummation * this.proxy.viewportWidth);
};

Player.getCellAlignOffsetAdjustment = function(index) {
    return (this.proxy.viewportWidth - this.slidesMap[index].width) / 2;
};
