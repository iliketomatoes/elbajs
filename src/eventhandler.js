
var EventHandler = {
	/**
	* Update the dots after sliding 
	* @param {Object} base
	*/
	updateDots : function(base){

	    base.navigation.dots.forEach(function(el){
	    	if(!!el){
	    		classie.remove(el,'active-dot');
	    	}
	    });

	    var index;

	    if(base.pointer === base.slides.length - 1){
	      index = 1;
	      }else if(base.pointer === 0){
	        index = base.slides.length - 2;
	        }else{
	          index = base.pointer;
	    }

	    if(!!base.navigation.dots[index]){
	    	classie.add(base.navigation.dots[index],'active-dot');
	    }
	    
	},


	/**
	* Destroy some variables before reloading the right size images
	* @param {Object} base
	* @param {Object} options
	*/
	destroy : function(base, options){

		var count = base.slides.length;
		
		for(var i = 0; i < count; i++){
				var slide = base.slides[i];
	 			if(slide) {
					classie.remove(slide,'no-bg-img');
					classie.remove(slide,  options.successClass);
	 			} 
	 		}
	},


	/**
	* The function which actually takes care about resizing (and maybe loading new images)
	* @param {Object} base
	* @param {Object} options
	*/
	doResize : function(base, options){

		var self = this;

		base.containerWidth = getContainerWidth(base.container);

		//Set the width of each slide
		ImageHandler.setSlidesWidth(base);
		
		//Fix the gallery offset since it's been resized
		Animator.offset(base.el, getLeftOffset(base.container, base.pointer));

		var oldSource = base.source;
		ImageHandler.setSource(base,options);
	

		//If the source changed, we re-init the gallery
		if(oldSource !== base.source){
			self.destroy(base, options);
			ImageHandler.lazyLoadImages(base, options);
		}else{
			//Otherwise we just resize the current images
			for(var i = 0; i < base.slides.length; i++){
				var slide = base.slides[i];
	 			if(slide) {
					var elbaIsland = slide.querySelector('.elba-island');
					ImageHandler.setImageSize(base, elbaIsland);
	 			} 
	 		}
		}
	},

	// taken from https://github.com/desandro/vanilla-masonry/blob/master/masonry.js by David DeSandro
	// original debounce by John Hann
	// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/

	/**
	* The function called in the callback after window resize event has been fired
	* @param {Object} base
	* @param {Object} options
	*/
	resizeHandler : function(base, options) {

		var self = this;
		
		function delayed() {
			self.doResize(base, options);
			base.resizeTimeout = null;
		}

		if ( base.resizeTimeout ) {
			clearTimeout( base.resizeTimeout );
		}

		base.resizeTimeout = setTimeout( delayed, 200 );
	}

};

