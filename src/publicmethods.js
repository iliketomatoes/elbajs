/* public functions
*************************************/

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
	easing: 'easeInOutCubic',
	navigation : true,
	dots: true,
	dotsContainer: false, 
	slideshow : 5000
};
	
Elba.prototype.goTo = function(direction){
	var self = this;
	if(typeof direction === 'string' && isNaN(direction)){
		var count = self.base.slides.length;
		if(direction === 'right'){
			if(self.base.pointer + 1 >= count){
				return false;
			}
			self.base.pointer++;
			animate(self.base, self.options,'right');
		}else{
			if(self.base.pointer - 1 < 0 ){
				return false;
			}
			self.base.pointer--;
			animate(self.base, self.options,'left');
		}
	}else if(!isNaN(direction)){
		var oldPointer = self.base.pointer;
		self.base.pointer = parseInt(direction);
		if(self.base.pointer > oldPointer){
			animate(self.base, self.options, 'right');
		}else{
			animate(self.base, self.options, 'left');
		}	
	}
};

Elba.prototype.dotTo = function(index){
	var self = this;

	if(parseInt(index) === self.base.pointer){
		return false;
	}else{
		self.goTo(index);
	}

};

Elba.prototype.startSlideshow = function(){
	var self = this;
	if(self.base.slides.length > 1){
		if(self.slideshow){
		clearInterval(self.slideshow);
	}	
	self.slideshow = setInterval(function(){
		//TODO: animate only if it is in the viewport
		if(classie.has(self.base.slides[self.base.pointer + 1],'elba-loaded')){
			self.goTo('right');
		}
	},self.options.slideshow);

	}
};

Elba.prototype.clearSlideshow = function(){
	var self = this;	
	if(self.slideshow){
		clearInterval(self.slideshow);
	}
};


