/* 
====================================
PRIVATE FUNCTIONS
====================================*/

/**
* Store the slides into _base.slides array
* @param {Object} _base
*/
var _createSlideArray = function(_base){
	var parent = _base.el || document;
	var nodelist = parent.querySelectorAll(_options.selector);
	_base.count 	= nodelist.length;
	//converting nodelist to array
	for(var i = _base.count; i--; _base.slides.unshift(nodelist[i])){}
};

/**
* Wrap the carousel into the elba-wrapper class div
* @param {Object} _base
*/
var _setupWrapper = function(_base){
	_base.wrapper = document.createElement( 'div' );
	_base.wrapper.className = 'elba-wrapper';
	_base.wrapper.wrap(_base.el);
};

/**
* Clone head and tail of the gallery to make the sliding show circular,
* set up the navigation, attach empty images to each slide
* @param {Object} _base
* @param {Object} _options
*/
var _setUpNavAndImg = function(_base, _options){
	if(_base.count > 1){
		var cloneTail = _base.slides[_base.count - 1].cloneNode(true);
		_base.el.insertBefore(cloneTail, _base.el.firstChild);
		_base.slides.unshift(cloneTail);

		var cloneHead = _base.slides[1].cloneNode(true);
		_base.el.appendChild(cloneHead);
		_base.slides.push(cloneHead);
		_base.count += 2;

		//Setting up the navigation
	    if(_options.navigation){

	    	/**
			* Set up arrows for the navigation
			* @param {String} direction
			*/
			var _setupNavigation = function(direction){
				_base.navigation[direction] = document.createElement( 'a' );
				_base.navigation[direction].className = 'elba-' + direction + '-nav';
				_base.navigation[direction].innerHtml = direction;
				_base.wrapper.appendChild(_base.navigation[direction]);
			};

	    	_setupNavigation('left');
			_setupNavigation('right');
	    }

	    if(_options.dots){

	    	/**
			* Set up the navigation dots
			* @param {String} the container's ID which holds the dots
			*/
	    	var _setupDots = function(dotsContainer){

				_base.navigation.dots = [];

				var actualContainer;

				if(dotsContainer){
					actualContainer = document.getElementById(dotsContainer);
				}else{
					actualContainer = document.createElement('div');
					actualContainer.className = 'elba-dots-ctr';
					_base.wrapper.appendChild(actualContainer);
				}

				for(var i = 1; i < _base.count - 1; i++){
					_base.navigation.dots[i]  = document.createElement('a');
					_base.navigation.dots[i].className  = 'elba-dot';
					actualContainer.appendChild(_base.navigation.dots[i]);
				}

			};

	    	_setupDots(_options.dotsContainer);
	    }
	}

	//Append an empty image tag to each slide
	_base.slides.forEach(function(el){
		var elbaIsland = document.createElement( 'img' );
		elbaIsland.className = 'elba-island';
		el.appendChild(elbaIsland);
	});	
};

function loadLazyImage(loadIndex){

	var self = this;
	var loaderPointer = loadIndex || self.loaderPointer;
	var ele = self.slides[loaderPointer];
	var count = self.slides.length;

	if(isElementLoaded(ele, self.options.successClass)){
		if(count > 1 && ((loaderPointer + 1) < (count - 1))){
				loaderPointer++;
				loadLazyImage.call(self,loaderPointer);
			}
	}

	var dataSrc = ele.getAttribute(self.source || self.options.src); // fallback to default data-src
	var elbaIsland = ele.querySelector('.elba-island');

	if(dataSrc){
		var dataSrcSplitted = dataSrc.split(self.options.separator);
		var src = dataSrcSplitted[isRetina && dataSrcSplitted.length > 1 ? 1 : 0];
		var img = new Image();
		
		img.onerror = function() {
			if(self.options.error) self.options.error(ele, "invalid");
			ele.className = ele.className + ' ' + self.options.errorClass;

			if(count > 1 && loaderPointer + 1 < count - 1){
				loaderPointer++;
				loadLazyImage.call(self,loaderPointer);
			}
		}; 
		img.onload = function() {
			
			elbaIsland.src = src;

			self.setImageSize(elbaIsland);

			classie.add(ele,'no-bg-img');
			classie.add(ele,  self.options.successClass);

			if(self.options.success) self.options.success(ele);

			//Update the Head and Tail clone
			if(count > 1 && (loaderPointer === 1 || loaderPointer === 0 || loaderPointer === (count - 1) || loaderPointer === (count - 2))){

				var parentClone,elbaClone;

				if(loaderPointer === 1){
					parentClone = self.slides[count - 1];
				}else if(loaderPointer === (count - 1)){
					parentClone = self.slides[1];
					}else if(loaderPointer === 0){
						parentClone = self.slides[count - 2];
						}else{
							parentClone = self.slides[0];
						}
				
				if(!isElementLoaded(parentClone, self.options.successClass)){
					elbaClone = parentClone.querySelector('.elba-island');

					elbaClone.src = src;
					self.setImageSize(elbaClone);
					
					classie.add(parentClone,'no-bg-img');
					classie.add(parentClone,  self.options.successClass);
				}
				
			}

			if(count > 1 && loaderPointer + 1 < count - 1){
				loaderPointer++;
				loadLazyImage.call(self,loaderPointer);
			}
			
		};
		img.src = src; //preload image
	} else {
		if(self.options.error) self.options.error(ele, "missing");
		ele.className = ele.className + ' ' + self.options.errorClass;
	}	
}	 	 


// taken from https://github.com/desandro/vanilla-masonry/blob/master/masonry.js by David DeSandro
// original debounce by John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
function resizeHandler() {
		var self = this;
		function delayed() {
			doResize.call(self);
			self._resizeTimeout = null;
		}

		if ( self._resizeTimeout ) {
			clearTimeout( self._resizeTimeout );
		}

		self._resizeTimeout = setTimeout( delayed, 200 );
	}

function doResize(){
	var self = this;

	self.setSlidesWidth();
	self.goTo();

	var oldSource = self.source;
	self.setSource();

	if(oldSource !== self.source){
		destroy.call(self);
		loadLazyImage.call(self);
	}else{
		for(var i = 0; i < self.slides.length; i++){
			var slide = self.slides[i];
 			if(slide) {
				var elbaIsland = slide.querySelector('.elba-island');
				self.setImageSize(elbaIsland);
 			} 
 		}
	}
}


function destroy(){
	var self = this;
	var count = self.slides.length;
	if(count > 1){
		self.loaderPointer   = 1;
	}else{
		self.loaderPointer   = 0;
	}
	
	for(var i = 0; i < count; i++){
			var slide = self.slides[i];
 			if(slide) {
				classie.remove(slide,'no-bg-img');
				classie.remove(slide,  self.options.successClass);
 			} 
 		}
}

