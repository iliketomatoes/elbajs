(function () {

'use strict';
 
	//vars
	var wrapper, pointer, options, slides, count, isRetina, source, destroyed;

	var navigation = {
		left : null,
		right : null,
		dots : null
	};

	var classie = window.classie;

	//var source, options, winWidth, winHeight, slides, count, isRetina, destroyed;
	//throttle vars
	//var validateT, saveWinOffsetT;

	//Elba constructor
	function Elba( el, settings ) {
		
		var self = this;

		var base = self.el = el;
		destroyed 		= true;
		slides 			= [];
		options 		= extend( self.defaults, settings );
		isRetina		= window.devicePixelRatio > 1;
		pointer 		= 0;
		
		// First we create an array of slides to lazy load
		createSlideArray(options.selector, base);
		setSlidesWidth();
		setupWrapper(base);
		setupNavigation('left');
		setupNavigation('right');

		navigation.left.addEventListener('click', function(ev) { 
			ev.preventDefault();
			self.swipe('left');
		}, false);

		navigation.right.addEventListener('click', function(ev) { 
			ev.preventDefault();
			self.swipe('right');
		}, false);

		setupCarouselWidth(base);

		setupElbaIslands();

		setSource();
		//Init 
		self.setupSlides();

		window.addEventListener('resize', resizeHandler.setScope(self), false);
	}