var ElbaBuilder = Object.create(ComponentInterface);

ElbaBuilder.build = function(el, carousel) {
    
    // Set viewport and slider
    var slides = this.setLayout(el);

    this.setSlidesOffset(slides);

    carousel.count = slides.length;

    this.setupNavigation(el, carousel, 'right');
    this.setupNavigation(el, carousel, 'left');

    carousel.slider = this.getSlider(el);
    carousel.slider.setAttribute('data-elba-id', carousel.GUID);
};

ElbaBuilder.setLayout = function(el) {

    var d = document.createDocumentFragment();

    // Create viewport
    var viewport = document.createElement('div');
    viewport.className = 'elba-viewport';

    d.appendChild(viewport);

    // Create sliding div
    var slider = document.createElement('div');
    slider.className = 'elba-slider';

    viewport.appendChild(slider);

    // Get slides elements
    var cloneNodes = Utils.getCloneNodes(el.children);

    if (cloneNodes) {

        // Clone last element in first position, due to the infinite carousel
        cloneNodes.unshift(cloneNodes[cloneNodes.length - 1].cloneNode(true));

        // Clone head in last position, due to the infinite carousel 
        cloneNodes.push(cloneNodes[1].cloneNode(true));

        for (var i = 0; i < cloneNodes.length; i++) {
            slider.appendChild(cloneNodes[i]);
        }
    }

    // Remove the original, unwrapped, slides
    Utils.removeChildren(el);

    el.appendChild(d);

    return cloneNodes;
};

ElbaBuilder.setSlidesOffset = function(slides) {

    var start = -100;

    for (var i = 0; i < slides.length; i++) {
        slides[i].style.left = start + '%';
        start += 100;
    }
};

/**
 * Set up arrows for the navigation
 * @param {Carousel} carousel
 * @param {String} direction
 */
ElbaBuilder.setupNavigation = function(el, carousel, direction) {

    // create svg
    var svgURI = 'http://www.w3.org/2000/svg';

    var arrow = document.createElement('a');
    arrow.className = 'elba-' + direction + '-nav';
    arrow.setAttribute('data-elba-id', carousel.GUID);

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

    carousel.navigation[direction] = arrow;
    el.appendChild(carousel.navigation[direction]);
};

ElbaBuilder.getSlider = function(el) {
    return el.querySelector('.elba-slider');
};

ElbaBuilder.testMethod = function() {
    return this;
};

ElbaBuilder.testProperty = 'Test Property it me';
