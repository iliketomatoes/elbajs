function CarouselHandler(base, options){

	var self = this;

	self.slides = [];
	self.count = 0;
	self.navigation = {
		left : null,
		right : null,
		dots : null
	};

	// First we create an array of slides to lazy load
    self.createSlideArray(options.selector, base);

    // Then set up the carousel wrapper
    self.setupWrapper(base);

    if(self.count > 1){
    	self.cloningHeadAndTail(base);

    	//Setting up the navigation
	    if(options.navigation){
	    	self.setupNavigation('left');
			self.setupNavigation('right');
	    }

	    if(options.dots){
	    	self.setupDots(options.dotsContainer);
	    }
    }

	self.setupElbaIslands();
}

CarouselHandler.prototype.createSlideArray = function(selector, parentSelector){
	var self = this;
	var parent = parentSelector || document;
	var nodelist = parent.querySelectorAll(selector);
	self.count 	= nodelist.length;
	//converting nodelist to array
	for(var i = self.count; i--; self.slides.unshift(nodelist[i])){}
};

CarouselHandler.prototype.cloningHeadAndTail = function(base){
	var self = this;

	if(self.count > 1){
		var cloneTail = self.slides[self.count - 1].cloneNode(true);
		base.insertBefore(cloneTail, base.firstChild);
		self.slides.unshift(cloneTail);

		var cloneHead = self.slides[1].cloneNode(true);
		base.appendChild(cloneHead);
		self.slides.push(cloneHead);
		self.count += 2;
	}	
};

CarouselHandler.prototype.setupWrapper = function(base){
	var self = this;

	self.wrapper = document.createElement( 'div' );
	self.wrapper.className = 'elba-wrapper';
	self.wrapper.wrap(base);
};

CarouselHandler.prototype.setupNavigation = function(direction){
	var self = this;

	self.navigation[direction] = document.createElement( 'a' );
	self.navigation[direction].className = 'elba-' + direction + '-nav';
	self.navigation[direction].innerHtml = direction;
	self.wrapper.appendChild(self.navigation[direction]);
};

CarouselHandler.prototype.setupDots = function(dotsContainer){
	var self = this;

	self.navigation.dots = [];

	var actualContainer;

	if(dotsContainer){
		actualContainer = document.getElementById(dotsContainer);
	}else{
		actualContainer = document.createElement('div');
		actualContainer.className = 'elba-dots-ctr';
		self.wrapper.appendChild(actualContainer);
	}

	for(var i = 1; i < self.count - 1; i++){
		self.navigation.dots[i]  = document.createElement('a');
		self.navigation.dots[i].className  = 'elba-dot';
		actualContainer.appendChild(self.navigation.dots[i]);
	}

};

CarouselHandler.prototype.setupElbaIslands = function(){
	var self = this;
	self.slides.forEach(function(el){
		var elbaIsland = document.createElement( 'img' );
		elbaIsland.className = 'elba-island';
		el.appendChild(elbaIsland);
	});
};

CarouselHandler.prototype.getSlides = function(){
	return this.slides;
};

CarouselHandler.prototype.getLeftNav = function(){
	return this.navigation.left;
};

CarouselHandler.prototype.getRightNav = function(){
	return this.navigation.right;
};

CarouselHandler.prototype.getDots = function(){
	return this.navigation.dots;
};