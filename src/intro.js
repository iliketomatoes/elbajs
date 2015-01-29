;(function(elba) {

	'use strict';
	
	if (typeof define === 'function' && define.amd) {
        	// Register elba as an AMD module
        	define(elba);
	} else {
        	// Register elba on window
        	window.Elba = elba();
	}
	
})(function () {

	'use strict';