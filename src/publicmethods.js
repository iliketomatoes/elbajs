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

	init : function(){
		var self = this;
		
		
		self.setupWrapper();
		self.setupNavigation('left');
		self.setupNavigation('right');
		self.setupCarousel();
		self.setupImages();
	},
	setupWrapper : function(){
		var self = this;

		wrapper = document.createElement( 'div' );
		wrapper.className = 'elba-wrapper';
		wrapper.wrap(self.el);
	},
	setupNavigation : function(direction){
		var self = this;
		navigation[direction] = document.createElement( 'a' );
		navigation[direction].className = 'elba-' + direction + '-nav';
		navigation[direction].innerHtml = direction;
		wrapper.appendChild(navigation[direction]);

		navigation[direction].addEventListener('click', function(ev) { 
			ev.preventDefault();
			self.swipe(direction);
			});
	},
	setupCarousel : function(){
		var self = this;

		var carouselWidth = count * 100;
			carouselWidth += '%'; 
		self.el.style.width = carouselWidth;
	},
	setupImages : function(){
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
				self.load(image);
 			} 
 		}
	},
	load : function(ele){
		if(!isElementLoaded(ele)) loadImage(ele);
	},
	swipe : function(direction){
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