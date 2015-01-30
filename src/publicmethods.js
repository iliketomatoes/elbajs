/* 
====================================
PUBLIC METHODS
====================================*/

Elba.prototype.loadImages = function(){

	var self = this;

	//Set the width of each slide
    ImageHandler.setSlidesWidth(self.base);

	//Set images' src
	ImageHandler.setSource(self.base, self.options);

	//Starting lazy load 
	ImageHandler.lazyLoadImages(self.base, self.options);

};


Elba.prototype.bindEvents = function(){

	var self = this;

	if(self.options.navigation){
		//Attach events to the navigation arrows
		self.base.navigation.left.addEventListener('click', function(ev) { 
			ev.preventDefault();
			self.goTo('left');
			if(self.options.slideshow){
				self.startSlideshow();
			}
			}, false);

		self.base.navigation.right.addEventListener('click', function(ev) { 
			ev.preventDefault();
			self.goTo('right');
			if(self.options.slideshow){
				self.startSlideshow();
			}
			}, false);
	}

	//Setting up dots events
    if(self.options.dots){

    	var dotHandler = function(i){

    		return function(){
    			var index = self.base.navigation.dots[i].getAttribute('data-target');

    			if(parseInt(index) === self.base.pointer){
					return false;
				}else{
					self.goTo(index);
					}
	    		if(self.options.slideshow){
					self.startSlideshow();
				}

				return false;
    		};	
    	};

  
    	for(var i = 1; i < self.base.slides.length - 1; i++){
				self.base.navigation.dots[i].setAttribute('data-target', i);
				self.base.navigation.dots[i].addEventListener('click', dotHandler(i), false);
			}
    }
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
			self.base.directionHint = 'right';
			self.base.pointer++;
			ImageHandler.lazyLoadImages(self.base, self.options);
			Animator.animate(self.base, self.base.containerWidth, self.options.duration, self.options.easing);
		}else{
			if(self.base.pointer - 1 < 0 ){
				return false;
			}
			self.base.directionHint = 'left';
			self.base.pointer--;
			ImageHandler.lazyLoadImages(self.base, self.options);
			Animator.animate(self.base, -self.base.containerWidth, self.options.duration, self.options.easing);
			}
		}else if(!isNaN(direction)){
			var oldPointer = self.base.pointer;
			self.base.pointer = parseInt(direction);
			if(self.base.pointer > oldPointer){
				self.base.directionHint = 'right';
				ImageHandler.lazyLoadImages(self.base, self.options);
				Animator.animate(self.base, self.base.containerWidth, self.options.duration, self.options.easing);
			}else{
				self.base.directionHint = 'left';
				ImageHandler.lazyLoadImages(self.base, self.options);
				Animator.animate(self.base, -self.base.containerWidth, self.options.duration, self.options.easing);
			}	
		}

		if(self.options.dots){
	        EventHandler.updateDots(self.base);
	    }

	}
	
};

/**
* A pretty self-explainatory method.
*/
Elba.prototype.startSlideshow = function(){
	var self = this;
	if(self.base.slides.length > 1){
		if(!!self.slideshow){
		clearInterval(self.slideshow);
	}	
	self.slideshow = setInterval(function(){
	
		if(!isElementInViewport(self.base.container)){
			return false;	
		}

		var nextSlide = self.base.slides[self.base.pointer + 1];

		if(!!nextSlide && (classie.has(nextSlide, self.options.successClass) || classie.has(nextSlide, self.options.errorClass))){
			self.goTo('right');
		}
	},self.options.slideshow);

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


