var Elba = Object.create(Toucher);

Elba.setup = function() {
    console.log(Utils.getSupportedTransform);
    // Call method from ElbaBuilder
    this.build();
};

Elba.init = function(el, settings) {

    if (typeof el === 'undefined') {
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

    this.el = el;
    this.container = null;
    this.containerWidth = 0;
    this.slides = [];
    this.wrapper = null;
    this.count = 0;
    this.source = 0;
    this.navigation = {
        left: null,
        right: null,
        dots: null
    };
    //Init the pointer to the visible slide
    this.pointer = 0;
    //Hint for the direction to load
    this.directionHint = 'right';
    this.resizeTimeout = null;
    this.animated = false;

    this.setup();
    return this;
};

Elba.identify = function() {
    return "I am " + this.el;
};
