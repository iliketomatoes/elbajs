(function () {

'use strict';
 
	//vars
	var source, options, winWidth, winHeight, images, count, isRetina, destroyed;
	//throttle vars
	var validateT, saveWinOffsetT;

	//Elba constructor
	function Elba( el, settings ) {
		
		this.el = el;
		destroyed 		= true;
		images 			= [];
		options 		= extend( this.defaults, settings );
		isRetina		= window.devicePixelRatio > 1;
		//Init 
		this._init();
	}