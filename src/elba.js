function componentFactory(selector, settings, GUID) {

    return function(component) {
        var obj = Object.create(component, {
            selector: { writable: false, configurable: false, value: selector },
            settings: { writable: false, configurable: false, value: settings },
            GUID: { writable: false, configurable: false, value: GUID },
            el: {
                get: function() {
                    var selector = '';
                    if (this.selector.indexOf('#') > -1) {
                        selector = this.selector.slice(1);
                    }
                    if (!Instances[selector]) {
                        Instances[selector] = {};
                        Instances[selector].el = document.getElementById(selector);
                    }
                    return Instances[selector];
                },
                set: function(selector) {}
            }
        });
        return obj;
    };
}

function Elba(selector, settings) {

    var _defaults = {
        selector: '.elba',
        separator: '|',
        breakpoints: false,
        successClass: 'elba-loaded',
        errorClass: 'elba-error',
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
    this.settings = Utils.extend(_defaults, settings);

    //this.el = el;
    this.slider = null;
    this.slides = [];
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


    try {

        if (typeof selector === 'undefined') {
            throw new Error('The first argument passed to the constructor is undefined');
        }

        var createComponent = componentFactory(selector, this.settings, ++GUID);

        var _elbaBuilder = createComponent(ElbaBuilder);
        var _imageHandler = createComponent(ImageHandler);
        var _eventHandler = createComponent(EventHandler);

        //_elbaBuilder.$(selector).testMethod();
        _imageHandler.loadImages().logEl();

    } catch (err) {
        console.error(err.message);
    }
}
