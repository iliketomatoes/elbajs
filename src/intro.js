;(function(elbaJS) {
	if (typeof define === 'function' && define.amd) {
        	// Register elba as an AMD module
        	define(elbaJS);
	} else {
        	// Register elba on window
        	window.Elba = elbaJS();
	}
})