/* 
====================================
PUBLIC METHODS
====================================*/

Elba.prototype.loadImages = function(){

	var self = this;

	//Set images' src
	ImageHandler.setSource(self.base, self.options);

	//Set the width of each slide
    ImageHandler.setSlidesWidth(self.base);

	//Starting lazy load 
	//ImageHandler.lazyLoadImages(self.base, self.options);

};


Elba.prototype.bindEvents = function(){

	var self = this,
		position,
		startingOffset,
		cachedPosition,
		startingPointer,
		currentSlideWidth,
		dragged = false,
		tick = 0,
		delta;

	setListener(self.base.el, Toucher.touchEvents.start, function(e){

			if(self.base.animated) return false;

			dragged = true;
			self.clearSlideshow();
			startingOffset = parseInt(Animator.offset(self.base.el));
			cachedPosition = Toucher.onTouchStart(e);
			currentSlideWidth = parseInt(self.base.containerWidth);
			startingPointer = self.base.pointer;
		});

	setListener(self.base.el, Toucher.touchEvents.move, function(e){

			position = Toucher.onTouchMove(e);
			
			if(position && dragged){

				delta = position.currX - cachedPosition.cachedX;

				//Let's drag the slides around
				Animator.drag(self.base.el, (delta + startingOffset));

				cachedPosition = position;
			}
		});

	setListener(self.base.el, Toucher.touchEvents.end, function(){

			if(!dragged) return false;
		
			Toucher.onTouchEnd();

			var offset = Math.abs(Math.abs((currentSlideWidth * self.base.pointer)) - Math.abs(Animator.offset(self.base.el)));

			var duration = Math.floor(((currentSlideWidth - offset) * self.options.duration) / currentSlideWidth );

			Animator.stopDragging();

			if(Math.abs(delta) > self.options.swipeThreshold){

				if(delta > 0){
					slideTo(self.base, self.options, 'left', (self.base.pointer - 1), - (currentSlideWidth - offset), duration);
				}else{
					slideTo(self.base, self.options, 'right', (self.base.pointer + 1), currentSlideWidth - offset, duration);
				}
				
			}else{

				//Fix the gallery offset because it didn't reach the threshold.
				Animator.offset(self.base.el, getLeftOffset(self.base.container, self.base.pointer));
			}

			delta = 0;
			startingOffset = 0;
			dragged = false;
			self.startSlideshow();
		});	

	if(self.options.navigation){
		//Attach events to the navigation arrows
		self.base.navigation.left.addEventListener('click', function(ev) { 
			ev.preventDefault();
			self.goTo('left');
			self.startSlideshow();
		
			}, false);

		self.base.navigation.right.addEventListener('click', function(ev) { 
			ev.preventDefault();
			self.goTo('right');
			self.startSlideshow();
			}, false);
	}

	//Setting up dots events
    if(self.options.dots){

    	var dotHandler = function(i){

    		return function(){
    			var index = parseInt(self.base.navigation.dots[i].getAttribute('data-target'));

    			if(parseInt(index) === self.base.pointer){
					return false;
				}else{
					self.goTo(index);
					}

				self.startSlideshow();

				return false;
    		};	
    	};

  
    	for(var i = 1; i < self.base.slides.length - 1; i++){
				self.base.navigation.dots[i].setAttribute('data-target', i);
				self.base.navigation.dots[i].addEventListener('click', dotHandler(i), false);
			}
    }

    if(self.options.slideshow){

		if (typeof document[hidden] !== 'undefined') {
			// If the page is hidden, pause the slideshow;
			// if the page is shown, play the slideshow
			var handleVisibilityChange = function() {
			  if (document[hidden]) {
			    self.clearSlideshow();
			  } else {
			    self.startSlideshow();
			  }
			};

			// Handle page visibility change   
  			document.addEventListener(visibilityChange, handleVisibilityChange, false);
		}

		//We start the slideshow
		self.startSlideshow();
	}				

	//Bind resize event
	window.addEventListener('resize', function(){
		EventHandler.resizeHandler(self.base, self.options);
	}, false);
};

/**
* Manages which direction and which picture to slide to
* @param {String} || {Number} accepts 'right','left'
* or the numerical index of the slide
*/
Elba.prototype.goTo = function(direction){
	var self = this;

	if(!self.base.animated){

		if(typeof direction === 'string' && isNaN(direction)){
		var count = self.base.slides.length;
		if(direction === 'right'){
			if(self.base.pointer + 1 >= count){
				return false;
			}
			slideTo(self.base, self.options, 'right', (self.base.pointer + 1), self.base.containerWidth);
		}else{
			if(self.base.pointer - 1 < 0 ){
				return false;
			}
			slideTo(self.base, self.options, 'left', (self.base.pointer - 1), -self.base.containerWidth);
			}
		}else if(typeof direction === 'number'){
			var oldPointer = self.base.pointer;
			if(self.base.pointer > oldPointer){
				slideTo(self.base, self.options, 'right', direction, parseInt(self.base.containerWidth * (direction - oldPointer)));
			}else{
				slideTo(self.base, self.options, 'left', direction, -parseInt(self.base.containerWidth * (oldPointer - direction)));
			}	
		}

	}
	
};

/**
* A pretty self-explainatory method.
*/
Elba.prototype.startSlideshow = function(){
	var self = this;

	if(self.options.slideshow){
		if(self.base.slides.length > 1){
			if(!!self.slideshow){
			clearInterval(self.slideshow);
		}	
		self.slideshow = setInterval(function(){
			if(!isElementInViewport(self.base.container)){
				return false;	
			}

			var nextSlide = self.base.slides[self.base.pointer + 1];

			if(!!nextSlide){
				self.goTo('right');
			}
		},self.options.slideshow);

		}
	}
	
};

/**
* This method temporarly stops the slideshow,
* which is restarted after a click on a navigation button.
*/
Elba.prototype.clearSlideshow = function(){
	var self = this;	
	if(self.slideshow){
		clearInterval(self.slideshow);
	}
};

/**
* This method permanently stops the slideshow.
*/
Elba.prototype.stopSlideshow = function(){
	var self = this;	
	if(self.slideshow){
		clearInterval(self.slideshow);
	}
	self.options.slideshow = 0;
};

/**
* This function returns the current index of the slideshow
* @return {Number}
*/
Elba.prototype.getCurrent = function(){
	return this.base.pointer;
};


