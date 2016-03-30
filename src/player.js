/**
 * Remember: 
 * this.proxy.pointer % this.getSlidesCount() is equal to the index of the slide we are pointing at
 *
 * Note: we assume that pointer starts from 0.
 */

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
