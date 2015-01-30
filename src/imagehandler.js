
var ImageHandler = {

	/**
	* Set the width of each slide
	* @param {Object} base
	*/
	setSlidesWidth : function(base){
		var containerWidth = getContainerWidth(base.container);
		var carouselWidth = 0;

		base.slides.forEach(function(el){
			carouselWidth += containerWidth;
			el.style.width = containerWidth + 'px';
		});

		base.el.style.width = carouselWidth + 'px';
	},

	/**
	* Pick the source among the possible sources declared in the <figure> elements
	* @param {Object} base
	* @param {Object} options
	*/
	setSource : function(base, options){
		//IMPORTANT : Always re-init the base.source to 0
		base.source = 0;

		var mediaQueryMin = 0;
		var screenWidth = getContainerWidth(base.container);

		//handle multi-served image src
		each(options.breakpoints, function(object){
			if(object.width <= screenWidth && Math.abs(screenWidth - object.width) < Math.abs(screenWidth - mediaQueryMin)){
				mediaQueryMin = object.width;
				base.source = object.src;
				return true;
			}
		});
	},

	/**
	* Set the right size of the freshly loaded img
	* @param {Object} base
	* @param {HTMLElement} image
	*/
	setImageSize : function(base, img){

		var imgRatio = img.naturalHeight / img.naturalWidth;
		
	    var containerWidth = getContainerWidth(base.container);
	    var containerHeight = getContainerHeight(base.container);
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
	},

	/**
	* Lazy load the images
	* @param {Object} base
	* @param {Object} options
	* [@param {Number} the slide to be loaded]
	*/
	lazyLoadImages : function(base, options, loadIndex){

		var self = this;

		var loaderPointer = loadIndex || base.pointer;
		var ele = base.slides[loaderPointer];

		if(!ele) return false;

		if(isElementLoaded(ele, options.successClass) || isElementLoaded(ele, options.errorClass)){
			self.loadNext(base, options, loaderPointer);
		}

		var dataSrc = ele.getAttribute(base.source || options.src); // fallback to default data-src
		
		//We get the <img class="elba-island"> element 
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

				self.setImageSize(base, elbaIsland);

				classie.add(ele, 'no-bg-img');
				classie.add(ele, options.successClass);

				if(options.success) options.success(ele);

				//Update the Head and Tail clone
				if(base.count > 1 && (loaderPointer === 1 || loaderPointer === 0 || loaderPointer === (base.count - 1) || loaderPointer === (base.count - 2))){

					var parentClone,elbaClone;

					if(loaderPointer === 1){
						parentClone = base.slides[base.count - 1];
					}else if(loaderPointer === (base.count - 1)){
						parentClone = base.slides[1];
						}else if(loaderPointer === 0){
							parentClone = base.slides[base.count - 2];
							}else{
								parentClone = base.slides[0];
							}
					
					if(!isElementLoaded(parentClone, options.successClass)){
						elbaClone = parentClone.querySelector('.elba-island');

						elbaClone.src = src;
						self.setImageSize(base, elbaClone);
						
						classie.add(parentClone,'no-bg-img');
						classie.add(parentClone,  options.successClass);
					}
					
				}
				self.loadNext(base, options, loaderPointer);
			};

			img.src = src; //preload image

		} else {
			self.loadNext(base, options, loaderPointer);
			if(options.error) options.error(ele, "missing");
			ele.className = ele.className + ' ' + options.errorClass;	
		}	
	},

	/**
	* Helper called in the previous _lazyLoadImages function
	* @param {Object} base
	* @param {Object} options
	* [@param {Number} the slide to be loaded]
	*/
	loadNext : function(base, options, loaderPointer){

		var self = this;

		if(base.directionHint === 'right'){
			if(base.count > 1 && ( (loaderPointer + 1) < (base.count - 1) ) && Math.abs( (loaderPointer + 1) - base.pointer ) <= options.preload){
				loaderPointer++;
				self.lazyLoadImages(base, options, loaderPointer);
			}
		}else if(base.count > 1 && ( (loaderPointer - 1) > 0 ) && Math.abs( (loaderPointer - 1) - base.pointer ) <= options.preload){
				loaderPointer--;
				self.lazyLoadImages(base, options, loaderPointer);
			}else{
				return false;
			}
	}	 	 

};






