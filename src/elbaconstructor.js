(function () {

'use strict';
 
	//vars
	var wrapper, loader, pointer, options, images, count, isRetina, source, destroyed;

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
		
		this.el         = el;
		destroyed 		= true;
		images 			= [];
		options 		= extend( this.defaults, settings );
		isRetina		= window.devicePixelRatio > 1;
		pointer 		= 0;
		//Init 
		this._init();
	}