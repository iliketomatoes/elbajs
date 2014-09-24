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

	var styles = [
	'webkitTransform',
	'MozTransform',
	'msTransform',
	'OTransform',
	'transform'
	];

	/*var map = {
	webkitTransform: '-webkit-transform',
	OTransform: '-o-transform',
	msTransform: '-ms-transform',
	MozTransform: '-moz-transform',
	transform: 'transform'
	};*/

	//var styl = document.body.style;
	/**
	* Export support.
	*/
	/*ar bool = 'transition' in styl
	|| 'webkitTransition' in styl
	|| 'MozTransition' in styl
	|| 'msTransition' in styl;*/

	//console.log(bool);

	var vendorTransform = getVendorPrefix(styles);

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
		setupLazySlide(loaderPointer);
		window.addEventListener('resize', resizeHandler.setScope(self), false);
	}