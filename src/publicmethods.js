/* public functions
*************************************/


//Closing Elba constructor
}


/* Extending Elba constructor
************************************/
Elba.prototype.defaults = {
	selector : '.elba',
	separator : '|',
	breakpoints : false,
	successClass : 'elba-loaded',
	errorClass : 'elba-error',
	container : 'elba-wrapper',
	src : 'data-src',
	error : false,
	success : false,
	duration : 1000,
	easing: null
};

Elba.prototype.getContainerWidth = function(){
	var self = this;
	return getContainerWidth(self.container);
};

Elba.prototype.getContainerHeight = function(){
	var self = this;
	return getContainerHeight(self.container);
};		

Elba.prototype.setSlidesWidth = function(){
	var self = this;
	var containerWidth = self.getContainerWidth();
	var carouselWidth = 0;

	self.slides.forEach(function(el){
		carouselWidth += containerWidth;
		el.style.width = containerWidth + 'px';
	});

	self.el.style.width = carouselWidth + 'px';
};

Elba.prototype.setSource = function(){
	var self = this;

	self.source = 0;
	var mediaQueryMin = 0;
	var screenWidth = self.getContainerWidth();
	//handle multi-served image src
	each(self.options.breakpoints, function(object){
		if(object.width <= screenWidth && Math.abs(screenWidth - object.width) < Math.abs(screenWidth - mediaQueryMin)){
			mediaQueryMin = object.width;
			self.source = object.src;
			return true;
		}
	});
};

/*Elba.prototype.swipe = function(direction){
	var self = this;

		if(direction === 'right'){
			goTo(self.el, 'right');
		}else{
			goTo(self.el, 'left');
		}
}*/