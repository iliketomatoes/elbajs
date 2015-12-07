var Elba = Object.create(Toucher);

Elba.setup = function(elements) {

    var htmlArray = Utils.makeArray(elements);

    for (var i = 0; i < htmlArray.length; i++) {
        GUID++;
        var carousel = new Carousel();
        htmlArray[i].setAttribute('data-elba-id', GUID);
        Instances[GUID] = carousel;

        carousel.el = htmlArray[i];
        // Call method inherited from ElbaBuilder
        this.build(carousel);
    }
    // Call method inherited from EventHandler
    this.bindEvents();
    return this;
};

Elba.init = function(elements, settings) {

    if (typeof elements === 'undefined') {
        throw new Error();
    }

    var defaults = {
        selector: '.elba',
        separator: '|',
        breakpoints: false,
        successClass: 'elba-loaded',
        errorClass: 'elba-error',
        container: 'elba-wrapper',
        src: 'data-src',
        error: false,
        success: false,
        duration: 700,
        easing: 'easeInOutSine',
        navigation: true,
        dots: true,
        dotsContainer: false,
        slideshow: 8000,
        preload: 1,
        swipeThreshold: 60,
    };

    //Overwrite the default options
    this.settings = Utils.extend(defaults, settings);

    return this.setup(elements);
};
