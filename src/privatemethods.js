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

//TODO
function loadImage(ele){
			
			var dataSrc = ele.getAttribute(source) || ele.getAttribute(options.src); // fallback to default data-src
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
				window.alert('noooo');
			}	
			/*var dataSrc = ele.getAttribute(source) || ele.getAttribute(options.src); // fallback to default data-src
			if(dataSrc) {
				var dataSrcSplitted = dataSrc.split(options.separator);
				var src = dataSrcSplitted[isRetina && dataSrcSplitted.length > 1 ? 1 : 0];
				var img = new Image();
				// cleanup markup, remove data source attributes
				each(options.breakpoints, function(object){
					ele.removeAttribute(object.src);
				});
				ele.removeAttribute(options.src);
				img.onerror = function() {
					if(options.error) options.error(ele, "invalid");
					ele.className = ele.className + ' ' + options.errorClass;
				}; 
				img.onload = function() {
					// Is element an image or should we add the src as a background image?
			      		ele.nodeName.toLowerCase() === 'img' ? ele.src = src : ele.style.backgroundImage = 'url("' + src + '")';	
					ele.className = ele.className + ' ' + options.successClass;	
					if(options.success) options.success(ele);
				};
				img.src = src; //preload image
			} else {
				if(options.error) options.error(ele, "missing");
				ele.className = ele.className + ' ' + options.errorClass;
			}*/
	 }	 

function setSlidesWidth(){

	var windowWidth = getWindowWidth();

	slides.forEach(function(el){
		el.style.width = windowWidth + 'px';
	});


}

function setSource(){
	var mediaQueryMin = 0;
	var screenWidth = window.screen.width);
	//handle multi-served image src
	each(options.breakpoints, function(object){
		console.log(object.width);

		if(object.width >= window.screen.width) {
			source = object.src;
			return false;
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

function doResize(base){
	setSlidesWidth();

	for(var i = 0; i < count && i !== pointer; i++){}	

	var leftOffset = - (getWindowWidth() * i);
	base.style.left = leftOffset + 'px';
}

	 