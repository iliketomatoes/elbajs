/* private functions
************************************/
function isElementLoaded(ele, successClass) {
	return classie.has(ele, successClass);
}

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

