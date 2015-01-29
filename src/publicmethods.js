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

/**
* A pretty self-explainatory method.
*/
/*Elba.prototype.startSlideshow = function(){
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
};*/

/**
* This method temporarly stops the slideshow,
* which is restarted after a click on a navigation button.
*/
/*Elba.prototype.clearSlideshow = function(){
	var self = this;	
	if(self.slideshow){
		clearInterval(self.slideshow);
	}
};*/

/**
* This method permanently stops the slideshow.
*/
/*Elba.prototype.stopSlideshow = function(){
	var self = this;	
	if(self.slideshow){
		clearInterval(self.slideshow);
	}
	self.options.slideshow = 0;
};*/

/**
* This function returns the current index of the slideshow
* @return {Number}
*/
/*Elba.prototype.getCurrent = function(){
	return this.base.pointer;
};*/


