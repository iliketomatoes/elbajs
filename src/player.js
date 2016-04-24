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

        normalizedPointer = this.proxy.pointer % this.slidesMap.length;

        if (this.proxy.pointer < 0 && !this.proxy.isWrapProcessOngoing) {

            normalizedPointer = this.slidesMap.length + normalizedPointer;
            this.proxy.isWrapProcessOngoing = true;

        }

        denormalizedOffset = this.getCellDenormalizedOffset(normalizedPointer);
        alignOffsetAdjustment = this.getCellAlignOffsetAdjustment(normalizedPointer);

        switch (this.settings.align) {
            case 'center':
                offset = -(denormalizedOffset - alignOffsetAdjustment);
                break;
            case 'left':
                offset = (this.slidesMap[this.proxy.pointer].width);
                break;
            case 'right':
                offset = (this.slidesMap[this.proxy.oldPointer].width);
                break;
            default:
                offset = (this.slidesMap[this.proxy.oldPointer].width / 2) + (targetSlideWidth / 2);
                break;
        }

    }

    /*console.log(denormalizedOffset);
    console.log(alignOffsetAdjustment);
    console.log(offset);*/
    //console.log(this.proxy.pointer);

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

    if(normalizedPointer < 0) normalizedPointer = self.slidesMap.length + normalizedPointer;

    if (this.proxy.animation > 0) {
        cAF(this.proxy.animation);
        this.proxy.animation = null;
    }

    if (this.proxy.isWrapProcessOngoing) {
        if (this.proxy.pointer >= 0) {
            offset -= this.proxy.totalSlidesWidth;
        } else {
            offset += this.proxy.totalSlidesWidth;
        }
    }

    this.proxy.targetOffset = offset - startingOffset;
    console.log(offset);
    console.log(startingOffset);

    start = null;

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

        if (self.proxy.targetOffset < 0) {
            // IF WE ARE SWIPING RIGHT

            // If we are pointing the last cell but then we swipe right
            if (self.proxy.isWrapProcessOngoing && !self.isSecondToLastCellVisibile()) {

                //console.log(self.proxy.targetOffset);

                // Put the last cell on the head
                _slides[lastCellIndex].style.left = -self.slidesMap[lastCellIndex].width + 'px';
                self.proxy.isLastElTranslated = true;

                // Put the first cell at its own place
                _slides[0].style.left = '0px';
                self.proxy.isFirstElTranslated = false;

                var newStartingPoint = -self.proxy.targetOffset + progressDelta;

                if (self.proxy.pointer > self.slidesMap.length) {
                    newStartingPoint -= self.getCellDenormalizedOffset(normalizedPointer) - self.getCellAlignOffsetAdjustment(normalizedPointer);
                }

                startingOffset = newStartingPoint - progressDelta;

                self.proxy.pointer = normalizedPointer;
                self.proxy.isWrapProcessOngoing = false;
                console.log('Wrap process to right realized');

                translate3d(newStartingPoint);

            } else {

                if (!self.isFirstCellVisible() && !self.proxy.isFirstElTranslated) {
                    //console.log('Put first cell on the tail');
                    //console.log(self.proxy.xNormalizedTranslation);
                    // Put the first cell on the tail
                    _slides[0].style.left = self.proxy.totalSlidesWidth + 'px';
                    self.proxy.isFirstElTranslated = true;

                }

                if (!self.isLastCellVisible() && self.proxy.isLastElTranslated) {
                    //console.log('Put the last cell on the tail');
                    // Put the last cell on the tail
                    _slides[lastCellIndex].style.left = (self.proxy.totalSlidesWidth - self.slidesMap[lastCellIndex].width) + 'px';
                    self.proxy.isLastElTranslated = false;

                }

                translate3d(progressDelta + startingOffset);
            }

        } else {
            // IF WE ARE SWIPING LEFT

            if (self.proxy.isWrapProcessOngoing && !self.isSecondCellVisible()) {

                // Put the last cell on the its own place
                _slides[lastCellIndex].style.left = (self.proxy.totalSlidesWidth - self.slidesMap[lastCellIndex].width) + 'px';
                self.proxy.isLastElTranslated = false;

                // Put the first cell on the tail
                _slides[0].style.left = self.proxy.totalSlidesWidth + 'px';
                self.proxy.isFirstElTranslated = true;

                startingOffset -= (self.proxy.totalSlidesWidth); 

                self.proxy.pointer = normalizedPointer;
                self.proxy.isWrapProcessOngoing = false;

                console.log('wrap process to left preso');

                translate3d(-progressDelta + startingOffset);

                //return false;

            } else {

                if (!self.isFirstCellVisible() && self.proxy.isFirstElTranslated) {
                    //console.log('Put first cell on the head');
                    //console.log(self.proxy.xNormalizedTranslation);
                    // Put the first cell on the tail
                    _slides[0].style.left = 0 + 'px';
                    self.proxy.isFirstElTranslated = false;

                }

                if (!self.isLastCellVisible() && !self.proxy.isLastElTranslated) {
                    //console.log('Put the last cell on the head');
                    // Put the last cell on the tail
                    _slides[lastCellIndex].style.left = -self.slidesMap[lastCellIndex].width + 'px';
                    self.proxy.isLastElTranslated = true;

                }

                translate3d(progressDelta + startingOffset);

            }

        }

        if (progress === 1) {
            // COMPLETED SWIPING

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

Player.isFirstCellVisible = function() {

    if (this.proxy.targetOffset < 0) {
        // If we are swiping right
        if (-this.proxy.xNormalizedTranslation > this.slidesMap[0].normalizedWidth) {
            return false;
        } else {
            return true;
        }

    } else {
        // If we are swiping left
        if (-this.proxy.xNormalizedTranslation < this.slidesMap[0].normalizedWidth) {
            return false;
        } else {
            return true;
        }
    }

};

Player.isSecondCellVisible = function() {

    if (this.proxy.targetOffset < 0) {
        // If we are swiping right
        if (-this.proxy.xNormalizedTranslation > this.slidesMap[1].normalizedWidth) {
            return false;
        } else {
            return true;
        }

    } else {
        // If we are swiping left
        if (-this.proxy.xNormalizedTranslation < this.slidesMap[1].normalizedWidth) {
            return false;
        } else {
            return true;
        }
    }

};

Player.isSecondToLastCellVisibile = function() {
    var totalNormalizedSlidesWidth = this.proxy.totalNormalizedSlidesWidth;
    var lastNormalizedSlideWidth = this.slidesMap[this.slidesMap.length - 1].normalizedWidth;

    if (this.proxy.targetOffset < 0) {
        // If we are swiping right
        if (-this.proxy.xNormalizedTranslation > (totalNormalizedSlidesWidth - lastNormalizedSlideWidth)) {
            return false;
        } else {
            return true;
        }
    } else {
        // If we are swiping left
        return true;
    }
};

Player.isLastCellVisible = function() {
    var lastCellIndex = this.slidesMap.length - 1;

    if (this.proxy.xNormalizedTranslation <= 0) {
        // If we are swiping right
        if (-this.proxy.xNormalizedTranslation > this.slidesMap[lastCellIndex].normalizedWidth) {
            return true;
        } else {
            return false;
        }

    } else {
        // If we are swiping left
        if (this.proxy.xNormalizedTranslation < this.slidesMap[lastCellIndex].normalizedWidth) {
            return true;
        } else {
            return false;
        }
    }
};
