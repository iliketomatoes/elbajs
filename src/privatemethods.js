/* 
====================================
PRIVATE METHODS
====================================*/

/**
* Store the slides into _base.slides array
* @param {Object} _base
*/
var _createSlideArray = function(_base,_options){	

	var nodelist = _base.el.querySelectorAll(_options.selector);

	_base.count = nodelist.length;
	//converting nodelist to array
	for(var i = _base.count; i--; _base.slides.unshift(nodelist[i])){}

	return true;	
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
* Clone head and tail of the gallery to make the sliding show circular
* and attach empty images to each slide
* @param {Object} _base
* @param {Object} _options
*/
var _cloneHeadAndTail = function(_base){
	if(_base.count > 1){
		//Update the pointer
		_base.pointer = 1;

		var cloneTail = _base.slides[_base.count - 1].cloneNode(true);
		_base.el.insertBefore(cloneTail, _base.el.firstChild);
		_base.slides.unshift(cloneTail);

		var cloneHead = _base.slides[1].cloneNode(true);
		_base.el.appendChild(cloneHead);
		_base.slides.push(cloneHead);
		_base.count += 2;
	}

	//Append an empty image tag to each slide
	_base.slides.forEach(function(el){
		var elbaIsland = document.createElement( 'img' );
		elbaIsland.className = 'elba-island';
		el.appendChild(elbaIsland);
	});	
};

/**
* Set up arrows for the navigation
* @param {Object} _base
* @param {String} direction
*/
var _setupNavigation = function(_base, direction){
	_base.navigation[direction] = document.createElement( 'a' );
	_base.navigation[direction].className = 'elba-' + direction + '-nav';
	_base.navigation[direction].innerHtml = direction;
	_base.wrapper.appendChild(_base.navigation[direction]);
};

/**
* Set up the navigation dots
* @param {Object} _base
* @param {String} the container's ID which holds the dots
*/
var _setupDots = function(_base, dotsContainer){

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


/**
* Pick the source among the possible sources declared in the <figure> elements
* @param {Object} _base
* @param {Object} _options
*/
var _setSource = function(_base, _options){
	//IMPORTANT : Always re-init the _base.source to 0
	_base.source = 0;

	var mediaQueryMin = 0;
	var screenWidth = getContainerWidth(_base.container);

	//handle multi-served image src
	each(_options.breakpoints, function(object){
		if(object.width <= screenWidth && Math.abs(screenWidth - object.width) < Math.abs(screenWidth - mediaQueryMin)){
			mediaQueryMin = object.width;
			_base.source = object.src;
			return true;
		}
	});
};


/**
* Set the width of each slide
* @param {Object} _base
*/
var _setSlidesWidth = function(_base){
	var containerWidth = getContainerWidth(_base.container);
	var carouselWidth = 0;

	_base.slides.forEach(function(el){
		carouselWidth += containerWidth;
		el.style.width = containerWidth + 'px';
	});

	_base.el.style.width = carouselWidth + 'px';
};


/**
* Set the right size of the freshly loaded img
* @param {Object} _base
* @param {HTMLElement} image
*/
var _setImageSize = function(_base, img){

	var imgRatio = img.naturalHeight / img.naturalWidth;
	
    var containerWidth = getContainerWidth(_base.container);
    var containerHeight = getContainerHeight(_base.container);
    var containerRatio = containerHeight / containerWidth;

    var newHeight, newWidth;

    if (containerRatio >= imgRatio){
    	img.height = newHeight = Math.ceil(containerHeight);
    	img.width = newWidth = Math.ceil(containerHeight / imgRatio);
    }else{
    	img.height = newHeight = Math.ceil(containerWidth * imgRatio);
    	img.width = newWidth = Math.ceil(containerWidth);
    }

    var centerX = (containerWidth - newWidth) / 2;
	var centerY = (containerHeight - newHeight) / 2;

	img.style.left = Math.ceil(centerX) + 'px';
	img.style.top = Math.ceil(centerY) + 'px';
};

/**
* Lazy load the images
* @param {Object} _base
* @param {Object} _options
* [@param {Number} the slide to be loaded]
*/
var _lazyLoadImages = function(_base, _options, loadIndex){

	var loaderPointer = loadIndex || _base.pointer;
	var ele = _base.slides[loaderPointer];

	if(!!!ele) return false;

	if(isElementLoaded(ele, _options.successClass) || isElementLoaded(ele, _options.errorClass)){
		_loadNext(_base, _options, loaderPointer);
	}

	var dataSrc = ele.getAttribute(_base.source || _options.src); // fallback to default data-src
	
	//We get the <img class="elba-island"> element 
	var elbaIsland = ele.querySelector('.elba-island');

	if(dataSrc){

		var dataSrcSplitted = dataSrc.split(_options.separator);
		var src = dataSrcSplitted[isRetina && dataSrcSplitted.length > 1 ? 1 : 0];
		var img = new Image();
		
		img.onerror = function() {
			if(_options.error) _options.error(ele, "invalid");
			ele.className = ele.className + ' ' + _options.errorClass;
		}; 

		img.onload = function() {
			
			elbaIsland.src = src;

			_setImageSize(_base, elbaIsland);

			classie.add(ele, 'no-bg-img');
			classie.add(ele, _options.successClass);

			if(_options.success) _options.success(ele);

			//Update the Head and Tail clone
			if(_base.count > 1 && (loaderPointer === 1 || loaderPointer === 0 || loaderPointer === (_base.count - 1) || loaderPointer === (_base.count - 2))){

				var parentClone,elbaClone;

				if(loaderPointer === 1){
					parentClone = _base.slides[_base.count - 1];
				}else if(loaderPointer === (_base.count - 1)){
					parentClone = _base.slides[1];
					}else if(loaderPointer === 0){
						parentClone = _base.slides[_base.count - 2];
						}else{
							parentClone = _base.slides[0];
						}
				
				if(!isElementLoaded(parentClone, _options.successClass)){
					elbaClone = parentClone.querySelector('.elba-island');

					elbaClone.src = src;
					_setImageSize(_base, elbaClone);
					
					classie.add(parentClone,'no-bg-img');
					classie.add(parentClone,  _options.successClass);
				}
				
			}
			_loadNext(_base, _options, loaderPointer);
		};

		img.src = src; //preload image

	} else {
		_loadNext(_base, _options, loaderPointer);
		if(_options.error) _options.error(ele, "missing");
		ele.className = ele.className + ' ' + _options.errorClass;	
	}	
};	 	 

/**
* Helper called in the previous _lazyLoadImages function
* @param {Object} _base
* @param {Object} _options
* [@param {Number} the slide to be loaded]
*/
function _loadNext(_base, _options, loaderPointer){
	if(_base.directionHint === 'right'){
		if(_base.count > 1 && ( (loaderPointer + 1) < (_base.count - 1) ) && Math.abs( (loaderPointer + 1) - _base.pointer ) <= _options.preload){
			loaderPointer++;
			_lazyLoadImages(_base, _options, loaderPointer);
		}
	}else if(_base.count > 1 && ( (loaderPointer - 1) > 0 ) && Math.abs( (loaderPointer - 1) - _base.pointer ) <= _options.preload){
			loaderPointer--;
			_lazyLoadImages(_base, _options, loaderPointer);
		}else{
			return false;
		}
}


/**
* Update the dots after sliding 
* @param {Object} _base
*/
var _updateDots = function(_base){

    _base.navigation.dots.forEach(function(el){
    	if(!!el){
    		classie.remove(el,'active-dot');
    	}
    });

    var index;

    if(_base.pointer === _base.slides.length - 1){
      index = 1;
      }else if(_base.pointer === 0){
        index = _base.slides.length - 2;
        }else{
          index = _base.pointer;
    }

    if(!!_base.navigation.dots[index]){
    	classie.add(_base.navigation.dots[index],'active-dot');
    }
    
};


/**
* Destroy some variables before reloading the right size images
* @param {Object} _base
* @param {Object} _options
*/
var _destroy = function(_base, _options){

	var count = _base.slides.length;
	
	for(var i = 0; i < count; i++){
			var slide = _base.slides[i];
 			if(slide) {
				classie.remove(slide,'no-bg-img');
				classie.remove(slide,  _options.successClass);
 			} 
 		}
};


/**
* The function which actually takes care about resizing (and maybe loading new images)
* @param {Object} _base
* @param {Object} _options
*/
var _doResize = function(_base, _options){

	_setSlidesWidth(_base);
	
	//Fix the gallery offset since it's been resized
	_base.el.style.left = getLeftOffset(_base.container, _base.pointer) + 'px';

	var oldSource = _base.source;
	_setSource(_base,_options);

	//If the source changed, we re-init the gallery
	if(oldSource !== _base.source){
		_destroy(_base, _options);
		_lazyLoadImages(_base, _options);
	}else{
		//Otherwise we just resize the current images
		for(var i = 0; i < _base.slides.length; i++){
			var slide = _base.slides[i];
 			if(slide) {
				var elbaIsland = slide.querySelector('.elba-island');
				_setImageSize(_base, elbaIsland);
 			} 
 		}
	}
};

// taken from https://github.com/desandro/vanilla-masonry/blob/master/masonry.js by David DeSandro
// original debounce by John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/

/**
* The function called in the callback after window resize event has been fired
* @param {Object} _base
* @param {Object} _options
*/
var _resizeHandler = function(_base, _options) {
	
	function delayed() {
		_doResize(_base, _options);
		_base.resizeTimeout = null;
	}

	if ( _base.resizeTimeout ) {
		clearTimeout( _base.resizeTimeout );
	}

	_base.resizeTimeout = setTimeout( delayed, 200 );
};






