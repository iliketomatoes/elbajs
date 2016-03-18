(function(window, Elba) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        // Register Elba as an AMD module
        define(Elba);

    } else if (typeof module == 'object' && module.exports) {
        // Register Elba for CommonJS
        module.exports = factory;

    } else {
        // Register Elba on window
        window.Elba = Elba();
    }

})(window, function() {
