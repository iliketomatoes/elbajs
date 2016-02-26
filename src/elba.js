var Elba = (function() {

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

    var _createInstance = function(el, GUID, options) {
        return new Slider(el, GUID, options);
    };

    return {
        init: function(selector, options) {

            // Extend default options
            var settings = Utils.extend(_defaults, options);

            var publicProxy = Object.create(ElbaProxy, {
                instances: {
                    enumerable: true,
                    configurable: false,
                    writable: true,
                    value: []
                }
            });

            if (selector.indexOf('#') > -1) {
                var target = selector.slice(1);
                var GUID = Utils.generateGUID();
                Instances[GUID] = _createInstance(document.getElementById(target), GUID, settings);
                publicProxy.instances.push(GUID);
            }

            return publicProxy;
        }
    };
})();
