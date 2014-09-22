//extends constructor
Elba.prototype = {

	defaults : {
		selector : '.elba',
		separator : '|',
		breakpoints : false,
		successClass : 'elba-loaded',
		errorClass : 'elba-error',
		src : 'data-src',
		error : false,
		success : false
	},

	_init : function(){
		var self = this;
		// First we create an array of images to lazy load
		createImageArray(options.selector, self.el);
		setImagesWidth();
		self._setupWrapper();
		self._setupLoader();
		self._setupNavigation('left');
		self._setupNavigation('right');
		self._setupCarousel();
		self._setupImages();
	},
	_setupWrapper : function(){
		var self = this;

		wrapper = document.createElement( 'div' );
		wrapper.className = 'elba-wrapper';
		wrapper.wrap(self.el);
	},
	_setupLoader : function(){

		loader = document.createElement('div');
	},
	_setupNavigation : function(direction){
		var self = this;
		navigation[direction] = document.createElement( 'a' );
		navigation[direction].className = 'elba-' + direction + '-nav';
		navigation[direction].innerHtml = direction;
		wrapper.appendChild(navigation[direction]);

		navigation[direction].addEventListener('click', function(ev) { 
			ev.preventDefault();
			self._swipe(direction);
			});
	},
	_setupCarousel : function(){
		var self = this;

		var carouselWidth = count * 100;
			carouselWidth += '%'; 
		self.el.style.width = carouselWidth;
	},
	_setupImages : function(){
		var self = this;

		//handle multi-served image src
		each(options.breakpoints, function(object){
			if(object.width >= window.screen.width) {
				source = object.src;
				return false;
			}
		});

		prepareElbaIsland();

		for(var i = 0; i < images.length; i++){
			var image = images[i];
 			if(image) {
				self._load(image);
 			} 
 		}
	},
	_load : function(ele){
		if(!isElementLoaded(ele)) loadImage(ele);
	},
	_swipe : function(direction){
		var self = this, leftOffset;

		if(direction === 'right'){
			if(pointer + 1 >= count ){
				console.log('maximum');
				return false;
			}
			pointer++;
			leftOffset = intVal(self.el.style.left) - intVal(images[pointer].offsetWidth);
			self.el.style.left = leftOffset + 'px'; 
		}else{
			if(pointer - 1 < 0 ){
				console.log('minimum');
				return false;
			}
			pointer--;
			leftOffset = intVal(self.el.style.left) + intVal(images[pointer].offsetWidth);
			self.el.style.left = leftOffset + 'px'; 
		}
	}

};	