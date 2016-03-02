(function(window, Elba) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        // Register Elba as an AMD module
        define(Elba());

    } else {
        // Register Elba on window
        window.Elba = Elba();
    }

})(window, function() {
