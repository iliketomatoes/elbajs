(function () {

'use strict';
 
	var classie = window.classie;
	var isRetina = window.devicePixelRatio > 1;

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

  	var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

	//Elba constructor
	function Elba( el, settings ) {
		
		var self = this;

		self.el = el;
		self.animated = false;
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
		
		//Starting lazy load 
		loadLazyImage.call(self);

		//Bind events

		bindEvent(window, 'resize', resizeHandler.setScope(self));

		bindEvent(ELBA.getLeftNav(), 'click', function(ev) { 
			ev.preventDefault();
			self.goTo('left');
		});

		bindEvent(ELBA.getRightNav(), 'click', function(ev) { 
			ev.preventDefault();
			self.goTo('right');
		});
	