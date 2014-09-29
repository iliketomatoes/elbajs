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

function cloningHeadAndTail(base){

	if(count > 1){
		var cloneTail = slides[count - 1].cloneNode(true);
		base.insertBefore(cloneTail, base.firstChild);
		slides.unshift(cloneTail);

		var cloneHead = slides[1].cloneNode(true);
		base.appendChild(cloneHead);
		slides.push(cloneHead);
		count += 2;
	}
	
}	

function setupNavigation(direction){
	navigation[direction] = document.createElement( 'a' );
	navigation[direction].className = 'elba-' + direction + '-nav';
	navigation[direction].innerHtml = direction;
	wrapper.appendChild(navigation[direction]);
}

function setSlidesWidth(){

	var containerWidth = getContainerWidth();

	slides.forEach(function(el){
		carouselWidth += containerWidth;
		el.style.width = containerWidth + 'px';
	});

	base.style.width = carouselWidth + 'px';

}

function isElementLoaded(ele) {
	return classie.has(ele, options.successClass);
}

function setupElbaIslands(){
	slides.forEach(function(el){
		var elbaIsland = document.createElement( 'img' );
		elbaIsland.className = 'elba-island';
		el.appendChild(elbaIsland);
	});
}

function setupLazySlide(loaderPointer){
	var slide = slides[loaderPointer];
	 loadLazyImage(slide);	
}

function loadLazyImage(ele){
			
			if(isElementLoaded(ele)){
				if(count > 1 && ((loaderPointer + 1) < (count - 1))){
						loaderPointer++;
						setupLazySlide(loaderPointer);
					}
			}

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
					
					elbaIsland.src = src;

					//setImageData(elbaIsland);
					setImageSize(elbaIsland);

					classie.add(ele,'no-bg-img');
					classie.add(ele,  options.successClass);
	
					if(options.success) options.success(ele);

					//Update the Head and Tail clone
					if(count > 1 && (loaderPointer === 1 || loaderPointer === 0 || loaderPointer === (count - 1) || loaderPointer === (count - 2))){

						var parentClone,elbaClone;

						if(loaderPointer === 1){
							parentClone = slides[count - 1];
						}else if(loaderPointer === (count - 1)){
							parentClone = slides[1];
							}else if(loaderPointer === 0){
								parentClone = slides[count - 2];
								}else{
									parentClone = slides[0];
								}
						
						if(!isElementLoaded(parentClone)){
							elbaClone = parentClone.querySelector('.elba-island');

							elbaClone.src = src;
							setImageSize(elbaClone);
							
							classie.add(parentClone,'no-bg-img');
							classie.add(parentClone,  options.successClass);
						}
						
					}

					if(count > 1 && loaderPointer + 1 < count - 1){
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



function setSource(){
	source = 0;
	var mediaQueryMin = 0;
	var screenWidth = getContainerWidth();
	//handle multi-served image src
	each(options.breakpoints, function(object){
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

	goTo(ele);

	var oldSource = source;
	setSource();

	if(oldSource !== source){
		destroy();
		setupLazySlide(loaderPointer);
	}else{
		for(var i = 0; i < slides.length; i++){
			var slide = slides[i];
 			if(slide) {
				var elbaIsland = slide.querySelector('.elba-island');
				setImageSize(elbaIsland);
 			} 
 		}
	}
}


function destroy(){
	if(count > 1){
		loaderPointer   = 1;
	}else{
		loaderPointer   = 0;
	}
	
	for(var i = 0; i < slides.length; i++){
			var slide = slides[i];
 			if(slide) {
				classie.remove(slide,'no-bg-img');
				classie.remove(slide,  options.successClass);
 			} 
 		}
}


function goTo(ele, direction){

	if(typeof direction === 'string'){
		if(direction === 'right'){
			if(pointer + 1 >= count ){
				return false;
			}
			pointer++;
			animate(ele, intVal(getLeftOffset()), 'right');
		}else{
			if(pointer - 1 < 0 ){
				return false;
			}
			pointer--;
			animate(ele, intVal(getLeftOffset()), 'left');
		}
	}else{
		ele.style.left = intVal(getLeftOffset()) + 'px';
	}	
}





