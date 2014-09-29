(function () {

'use strict';
 
	//vars
	var wrapper, base, container, pointer, loaderPointer, options, slides, count, isRetina, source, destroyed, carouselWidth = 0;

	var navigation = {
		left : null,
		right : null,
		dots : null
	};

	var classie = window.classie;

	var animated = false;

	//Elba constructor
	function Elba( el, settings ) {
		
		var self = this;

		base = self.el = el;
		destroyed 		= true;
		slides 			= [];
		options 		= extend( self.defaults, settings );
		isRetina		= window.devicePixelRatio > 1;
		pointer 		= 0;
		loaderPointer   = 0;

		// First we create an array of slides to lazy load
		createSlideArray(options.selector, base);
		if(count > 1){
			pointer 		= 1;
			loaderPointer   = 1;
			cloningHeadAndTail(base);
		}
			
		setupWrapper(base);
		container = getContainer(el, options.container);
		setSlidesWidth();

		if(count > 1){
			base.style.left = (-getContainerWidth()) + 'px';
		}

		setupNavigation('left');
		setupNavigation('right');

		//setupCarouselWidth(base);

		setupElbaIslands();

		setSource();
		//Init 
		
		setupLazySlide(loaderPointer);

		//Bind events
		window.addEventListener('resize', resizeHandler.setScope(self), false);

		navigation.left.addEventListener('click', function(ev) { 
			ev.preventDefault();
			self.swipe('left');
		}, false);

		navigation.right.addEventListener('click', function(ev) { 
			ev.preventDefault();
			self.swipe('right');
		}, false);
	}