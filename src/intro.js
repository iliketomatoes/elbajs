(function(window, elba) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        // Register Elba as an AMD module
        define(elba());
    } else {
        // Register Elba on window
        window.Elba = elba();
    }

})(window, function() {

        'use strict';

        // Object storing slider instances
        var Instances = {};

        // Helper variable that holds the slider instance that has been clicked
        // upon, to handle the dragging event.
        var TargetInstance = null;