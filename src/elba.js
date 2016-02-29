function Elba(selector, options) {

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
        slideshow: 8000,
        preload: 1,
        swipeThreshold: 60,
    };

    var _createInstance = function(el, GUID, options) {
        return Object.create(Slider, {
            el: {
                writable: false,
                value: el
            },
            GUID: {
                writable: false,
                value: GUID
            },
            settings: {
                writable: true,
                value: options
            }
        });
    };

    // Extend default options
    var settings = Utils.extend(_defaults, options);

    this.instances = [];

    if (selector.indexOf('#') > -1) {
        var target = selector.slice(1);
        var GUID = Utils.generateGUID();
        Instances[GUID] = _createInstance(document.getElementById(target), GUID, settings);
        Instances[GUID].init();
        this.instances.push(GUID);
    }
}
