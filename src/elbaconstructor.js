(function () {

'use strict';
 
	var classie = window.classie;
	var isRetina = window.devicePixelRatio > 1;

	//Elba constructor
	function Elba( el, settings ) {

		//vars
		var wrapper, pointer, loaderPointer, options, count, source, destroyed, carouselWidth = 0;

		var navigation = {
			left : null,
			right : null,
			dots : null
		};

		var animated = false;
		
		var self = this;

		self.el = el;
		destroyed 		= true;
		self.options 	= extend( self.defaults, settings );
		
		self.pointer 		= 0;
		self.loaderPointer   = 0;

		var ELBA = new CarouselHandler(self.el, self.options);

		self.slides = ELBA.getSlides();

		self.container = getContainer(el, self.options.container);

		self.setSlidesWidth();

		if(self.slides.length > 1){
			self.pointer 		= 1;
			self.loaderPointer   = 1;
			self.el.style.left = (- self.getContainerWidth()) + 'px';
		}

		self.setSource();
		
		//Starting loading 
		loadLazyImage.call(self);

		//Bind events
		//window.addEventListener('resize', resizeHandler.setScope(self), false);

		ELBA.getLeftNav().addEventListener('click', function(ev) { 
			ev.preventDefault();
			//self.swipe('left');
			console.log(self);
			self.prova();
		}, false);

		ELBA.getRightNav().addEventListener('click', function(ev) { 
			ev.preventDefault();
			//self.swipe('right');
			console.log(self);
			self.prova();
		}, false);
	