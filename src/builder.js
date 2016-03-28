var Builder = {
    build: function() {
        this.setLayout();

        // Set slides' layout
        var _slides = this.getSlides();
        this.registerSlidesWidth(_slides);
        this.setSlidesOffset(_slides);
    }
};

Builder.setLayout = function() {

    var d = document.createDocumentFragment();

    // Create viewport
    var viewport = document.createElement('div');
    viewport.className = 'elba-viewport';

    d.appendChild(viewport);

    // Create sliding div
    var slider = document.createElement('div');
    slider.className = 'elba-slider';
    slider.setAttribute('data-elba-id', this.GUID);

    viewport.appendChild(slider);

    // Get slides elements
    var cloneNodes = Utils.getCloneNodes(this.el.children);

    if (cloneNodes) {

        for (var i = 0; i < cloneNodes.length; i++) {
            slider.appendChild(cloneNodes[i]);
        }
    }

    // Remove the original, unwrapped, slides
    Utils.removeChildren(this.el);

    this.el.appendChild(d);

};

Builder.setSlidesOffset = function(elements) {
    var slides = elements || this.getSlides();
    var start = 0;
    for (var i = 1; i < slides.length; i++) {
        var tmp = this.slidesMap[i - 1].width;
        if(this.proxy.isWrappable && i === (slides.length - 1)) {
            slides[i].style.left = -tmp + 'px';
            this.proxy.isLastElTranslated = true;
        }else{
            slides[i].style.left = (tmp + start) + 'px';
            start += tmp;
        }
    }
};

Builder.setNavigation = function() {
    this.setArrow('right');
    this.setArrow('left');
};

/**
 * Set arrows for the navigation
 * @param {String} direction
 */
Builder.setArrow = function(direction) {

    // create svg
    var svgURI = 'http://www.w3.org/2000/svg';

    var arrow = document.createElement('a');
    arrow.className = 'elba-' + direction + '-nav elba-arrow';

    if (direction === 'left') {

        var svgLeft = document.createElementNS(svgURI, 'svg');
        // SVG attributes, like viewBox, are camelCased. That threw me for a loop
        svgLeft.setAttribute('viewBox', '0 0 100 100');
        // create arrow
        var pathLeft = document.createElementNS(svgURI, 'path');
        pathLeft.setAttribute('d', 'M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z');
        pathLeft.setAttribute('transform', 'translate(15,0)');
        // add class so it can be styled with CSS
        pathLeft.setAttribute('class', 'elba-svg-arrow');
        svgLeft.appendChild(pathLeft);

        arrow.appendChild(svgLeft);

    } else {

        // add svg to page
        var svgRight = document.createElementNS(svgURI, 'svg');
        // SVG attributes, like viewBox, are camelCased. That threw me for a loop
        svgRight.setAttribute('viewBox', '0 0 100 100');
        // create arrow
        var pathRight = document.createElementNS(svgURI, 'path');
        pathRight.setAttribute('d', 'M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z');
        // add class so it can be styled with CSS
        pathRight.setAttribute('class', 'elba-svg-arrow');
        pathRight.setAttribute('transform', 'translate(85,100) rotate(180)');
        svgRight.appendChild(pathRight);

        arrow.appendChild(svgRight);
    }

    this.el.appendChild(arrow);
};

Builder.registerSlidesWidth = function(elements) {
    var slides = elements || this.getSlides();
    var viewportWidth = this.getViewportWidth();
    for (var i = 0; i < slides.length; i++) {
        if (typeof this.slidesMap[i] === 'undefined') this.slidesMap[i] = {};
        this.slidesMap[i].width = parseFloat(window.getComputedStyle(slides[i]).getPropertyValue('width'));
        this.slidesMap[i].normalizedWidth = this.slidesMap[i].width / viewportWidth;
        this.proxy.totalSlidesWidth += this.slidesMap[i].width;
    }
    this.proxy.totalNormalizedSlidesWidth = this.proxy.totalSlidesWidth / viewportWidth;
};
