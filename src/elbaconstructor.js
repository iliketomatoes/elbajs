(function () {

'use strict';
 
	//vars
	var wrapper, pointer, loaderPointer, options, slides, count, isRetina, source, destroyed;

	var navigation = {
		left : null,
		right : null,
		dots : null
	};

	var classie = window.classie;

	// from http://www.developerdrive.com/2012/03/coding-vendor-prefixes-with-javascript/
	var vendorTransform = getVendorPrefix(["transform", "msTransform", "MozTransform", "WebkitTransform", "OTransform"]);

	var has3D = threeDEnabled();
	
	var animated = false;

	//Elba constructor
	function Elba( el, settings ) {
		
		var self = this;

		var base = self.el = el;
		destroyed 		= true;
		slides 			= [];
		options 		= extend( self.defaults, settings );
		isRetina		= window.devicePixelRatio > 1;
		pointer 		= 0;
		loaderPointer   = 0;
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
		//setupSlides();
		if(has3D){
			base.style[vendorTransform] = 'translate3d(0,0,0)';
		}
		
		setupLazySlide(loaderPointer);
		window.addEventListener('resize', resizeHandler.setScope(self), false);
	}