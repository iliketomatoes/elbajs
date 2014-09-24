/* private functions
************************************/
function setupWrapper(base){
	wrapper = document.createElement( 'div' );
	wrapper.className = 'elba-wrapper';
	wrapper.wrap(base);
}

function createSlideArray(selector, parentSelector) {
		var parent = parentSelector || document;
 		var nodelist 	= parent.querySelectorAll(selector);
 		count 			= nodelist.length;
 		//converting nodelist to array
 		for(var i = count; i--; slides.unshift(nodelist[i])){}
	 }

function setupNavigation(direction){
	navigation[direction] = document.createElement( 'a' );
	navigation[direction].className = 'elba-' + direction + '-nav';
	navigation[direction].innerHtml = direction;
	wrapper.appendChild(navigation[direction]);
}

function setupCarouselWidth(base){
	var carouselWidth = count * 100;
		carouselWidth += '%'; 
	base.style.width = carouselWidth;
}	

function isElementLoaded(ele) {
	var elbaIsland = ele.querySelector('.elba-island');

	if(elbaIsland){
		return classie.has(elbaIsland, options.successClass);
 	}else{
 		return false;
 	}
}

function setupElbaIslands(){
	slides.forEach(function(el){
		var nodeContent = el.querySelector('.elba-content');
		var elbaIsland = document.createElement( 'div' );
		elbaIsland.className = 'elba-island';
		if(nodeContent){
			elbaIsland.wrap(nodeContent);
		}else{
			el.appendChild(elbaIsland);
		}
	});
}

function setupLazySlide(loaderPointer){
	var slide = slides[loaderPointer];
	if(!isElementLoaded(slide)) loadLazyImage(slide);	
}

function setupSlides(){
	for(var i = 0; i < slides.length; i++){
			var slide = slides[i];
 			if(slide) {
				loadSlide(slide);
 			} 
 		}
}	 

function loadSlide(ele){
	if(!isElementLoaded(ele)) loadImage(ele);
}

function loadImage(ele){
			
			var dataSrc = ele.getAttribute(source || options.src); // fallback to default data-src
			var elbaIsland = ele.querySelector('.elba-island');

			if(dataSrc){
				var dataSrcSplitted = dataSrc.split(options.separator);
				var src = dataSrcSplitted[isRetina && dataSrcSplitted.length > 1 ? 1 : 0];
				var img = new Image();
				
				img.onerror = function() {
					if(options.error) options.error(ele, "invalid");
					ele.className = ele.className + ' ' + options.errorClass;
				}; 
				img.onload = function() {
					// Is element an image or should we add the src as a background image?
					if(ele.nodeName.toLowerCase() === 'img'){
						ele.src = src;
					}else{
						elbaIsland.style.backgroundImage = 'url("' + src + '")';
					}

					classie.add(ele,'no-bg-img');
					classie.add(elbaIsland,  options.successClass);
	
					if(options.success) options.success(ele);
				};
				img.src = src; //preload image
			} else {
				if(options.error) options.error(ele, "missing");
				ele.className = ele.className + ' ' + options.errorClass;
			}	
	 }

function loadLazyImage(ele){
			
			var dataSrc = ele.getAttribute(source || options.src); // fallback to default data-src
			var elbaIsland = ele.querySelector('.elba-island');

			if(dataSrc){
				var dataSrcSplitted = dataSrc.split(options.separator);
				var src = dataSrcSplitted[isRetina && dataSrcSplitted.length > 1 ? 1 : 0];
				var img = new Image();
				
				img.onerror = function() {
					if(options.error) options.error(ele, "invalid");
					ele.className = ele.className + ' ' + options.errorClass;
				}; 
				img.onload = function() {
					// Is element an image or should we add the src as a background image?
					if(ele.nodeName.toLowerCase() === 'img'){
						ele.src = src;
					}else{
						elbaIsland.style.backgroundImage = 'url("' + src + '")';
					}

					classie.add(ele,'no-bg-img');
					classie.add(elbaIsland,  options.successClass);
	
					if(options.success) options.success(ele);

					if(loaderPointer + 1 < count){
						loaderPointer++;
						setupLazySlide(loaderPointer);
					}
					
				};
				img.src = src; //preload image
			} else {
				if(options.error) options.error(ele, "missing");
				ele.className = ele.className + ' ' + options.errorClass;
			}	
	 }	 	 

function setSlidesWidth(){

	var windowWidth = getWindowWidth();

	slides.forEach(function(el){
		el.style.width = windowWidth + 'px';
	});


}

function setSource(){
	source = 0;
	var mediaQueryMin = 0;
	var screenWidth = getWindowWidth();
	//handle multi-served image src
	each(options.breakpoints, function(object){
		console.log(mediaQueryMin);

		if(object.width <= screenWidth && Math.abs(screenWidth - object.width) < Math.abs(screenWidth - mediaQueryMin)){
			mediaQueryMin = object.width;
			source = object.src;
			return true;
		}
	});
}

// taken from https://github.com/desandro/vanilla-masonry/blob/master/masonry.js by David DeSandro
// original debounce by John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
function resizeHandler() {
		var self = this;
		function delayed() {
			doResize(self.el);
			self._resizeTimeout = null;
		}

		if ( self._resizeTimeout ) {
			clearTimeout( self._resizeTimeout );
		}

		self._resizeTimeout = setTimeout( delayed, 100 );
	}

function doResize(ele){
	setSlidesWidth();

	for(var i = 0; i < count && i !== pointer; i++){}	

	var leftOffset = - (getWindowWidth() * i);

	leftOffset += 'px'; 
	ele.style[vendorTransform] = 'translateX(' + leftOffset+ ')';

	var oldSource = source;
	setSource();

	if(oldSource !== source){
		destroy();
		setupSlides();
	}
}


function destroy(){
	for(var i = 0; i < slides.length; i++){
			var slide = slides[i];
 			if(slide) {
				var elbaIsland = slide.querySelector('.elba-island');
				classie.remove(slide,'no-bg-img');
				classie.remove(elbaIsland,  options.successClass);
 			} 
 		}
}
	 