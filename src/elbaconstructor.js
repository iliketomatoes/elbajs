(function () {

'use strict';
 
	var classie = window.classie;
	var isRetina = window.devicePixelRatio > 1;

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

  	var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  	//from http://easings.net/
  	var easingObj = {
  		easeInSine : [0.47, 0, 0.745, 0.715],
  		easeOutSine : [0.39, 0.575, 0.565, 1],
  		easeInOutSine : [0.445, 0.05, 0.55, 0.95],
  		easeInQuad : [0.55, 0.085, 0.68, 0.53],
  		easeOutQuad : [0.25, 0.46, 0.45, 0.94],
  		easeInOutQuad : [0.455, 0.03, 0.515, 0.955],
  		easeInCubic : [0.55, 0.055, 0.675, 0.19],
  		easeOutCubic : [0.215, 0.61, 0.355, 1],
  		easeInOutCubic : [0.645, 0.045, 0.355, 1],
  		easeInQuart : [0.895, 0.03, 0.685, 0.22],
  		easeOutQuart : [0.165, 0.84, 0.44, 1],
  		easeInOutQuart : [0.77, 0, 0.175, 1],
  		easeInQuint : [0.755, 0.05, 0.855, 0.06],
  		easeOutQuint : [0.23, 1, 0.32, 1],
  		easeInOutQuint : [0.86, 0, 0.07, 1],
  		easeInExpo : [0.95, 0.05, 0.795, 0.035],
  		easeOutExpo : [0.19, 1, 0.22, 1],
  		easeInOutExpo : [1, 0, 0, 1],
  		easeInCirc : [0.6, 0.04, 0.98, 0.335],
  		easeOutCirc : [0.075, 0.82, 0.165, 1],
  		easeInOutCirc : [0.785, 0.135, 0.15, 0.86],
  		easeInBack : [0.6, -0.28, 0.735, 0.045],
  		easeOutBack  : [0.175, 0.885, 0.32, 1.275],
  		easeInOutBack  : [0.68, -0.55, 0.265, 1.55],
  	};

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

			//Bind navigation events
			if(self.options.navigation){
			bindEvent(ELBA.getLeftNav(), 'click', function(ev) { 
				ev.preventDefault();
				self.goTo('left');
				});

			bindEvent(ELBA.getRightNav(), 'click', function(ev) { 
				ev.preventDefault();
				self.goTo('right');
				});
			}
			
			if(self.options.dots){
				self.dots = ELBA.getDots();

				classie.add(self.dots[self.pointer], 'active-dot');

				for(var i = 1; i < self.slides.length - 1; i++){
					self.dots[i].setAttribute('data-target', i);
					bindEvent(self.dots[i], 'click', function(ev){
						ev.preventDefault();
						self.dotTo(this.getAttribute('data-target'));
					});
				}

			}
		}

		//Set images' src
		self.setSource();
		
		//Starting lazy load 
		loadLazyImage.call(self);

		//Bind resize event
		bindEvent(window, 'resize', resizeHandler.setScope(self));
	