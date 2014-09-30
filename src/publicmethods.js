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
	easing: 'easeInOutCubic'
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

Elba.prototype.goTo = function(direction){
	var self = this;
	if(typeof direction === 'string'){
		var count = self.slides.length;
		if(direction === 'right'){
			if(self.pointer + 1 >= count ){
				return false;
			}
			self.pointer++;
			animate.call(self, 'right');
		}else{
			if(self.pointer - 1 < 0 ){
				return false;
			}
			self.pointer--;
			animate.call(self, 'left');
		}
	}else{
		self.el.style.left = intVal(self.getLeftOffset()) + 'px';
	}	
};

Elba.prototype.getLeftOffset = function(){
	var self = this;	
	return - (self.getContainerWidth() * self.pointer);
};

Elba.prototype.setImageSize = function(elbaIsland){
	var self = this;

	var imgRatio = elbaIsland.naturalHeight / elbaIsland.naturalWidth;
	
    var containerWidth = self.getContainerWidth();
    var containerHeight = self.getContainerHeight();
    var containerRatio = containerHeight / containerWidth;

    var newHeight, newWidth;

    if (containerRatio >= imgRatio){
    	elbaIsland.height = newHeight = Math.ceil(containerHeight);
    	elbaIsland.width = newWidth = Math.ceil(containerHeight / imgRatio);
    }else{
    	elbaIsland.height = newHeight = Math.ceil(containerWidth * imgRatio);
    	elbaIsland.width = newWidth = Math.ceil(containerWidth);
    }

    var centerX = (containerWidth - newWidth) / 2;
	var centerY = (containerHeight - newHeight) / 2;

	elbaIsland.style.left = Math.ceil(centerX) + 'px';
	elbaIsland.style.top = Math.ceil(centerY) + 'px';
};


