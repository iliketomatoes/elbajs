(function () {

'use strict';
 
	//vars
	var wrapper, pointer, options, images, count, isRetina, source, destroyed;

	var navigation = {
		left : null,
		right : null,
		dots : null
	};
	//var source, options, winWidth, winHeight, images, count, isRetina, destroyed;
	//throttle vars
	//var validateT, saveWinOffsetT;

	//Elba constructor
	function Elba( el, settings ) {
		
		var base = this.el = el;
		destroyed 		= true;
		images 			= [];
		options 		= extend( this.defaults, settings );
		isRetina		= window.devicePixelRatio > 1;
		pointer 		= 0;
		
		console.log(base);
		// First we create an array of images to lazy load
		createImageArray(options.selector, base);
		setImagesWidth();
		//Init 
		this.init();
	}