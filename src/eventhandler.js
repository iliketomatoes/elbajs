
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

		ImageHandler.setSlidesWidth(base);
		
		//Fix the gallery offset since it's been resized
		left(base.el, getLeftOffset(base.container, base.pointer));
		//base.el.style.left = getLeftOffset(base.container, base.pointer) + 'px';

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

/*Tabella.prototype.attachEvents = function(){

	var self = this;

	Animator.easing = self.options.easing;

	self.arrows.arrowLeft.addEventListener('click', function(){
		self.move('left');
	});
	self.arrows.arrowRight.addEventListener('click', function(){
		self.move('right');
	});

	var position,
		cachedPosition,
		startingOffset,
		numberOfPeriods = self.options.periods.length,
		slidingPeriodRow = self.periodRow.querySelector('.t-sliding-row'),
		legalPosition = true,
		delta,
		currentCellWidth,
		tick = 0,
		startingPointer;

	self.slidingRows.forEach(function(el){

		//setting the events listeners
		setListener(el, Toucher.touchEvents.start, function(e){
			//e.preventDefault();
			startingOffset = Animator.offset(slidingPeriodRow);
			cachedPosition = Toucher.onTouchStart(e);
			currentCellWidth = parseInt(self.currentCellWidth);
			tick = 0;
			startingPointer = self.pointer;
		});

		setListener(el, Toucher.touchEvents.move, function(e){
			//e.preventDefault();
			position = Toucher.onTouchMove(e);
			
			if(position && legalPosition){

				delta = position.currX - cachedPosition.cachedX;

				//Let's drag the sliding rows around
				Animator.drag(self.slidingRows, (delta + parseInt(startingOffset)));

				tick = Math.abs(Math.floor(delta / self.options.swipeTreshold));

				if(self.options.swipeSingleTick && tick >= 1) tick = 1;

				//Swipe right
				if(delta >= 0){ 

					if(self.pointer === 0){                  

						if(Math.abs(parseInt(Animator.offset(slidingPeriodRow))) >= self.options.edgeTreshold) legalPosition = false;
						
					}else{
						self.pointer = startingPointer - tick;
					}

					//Swipe left	
					}else{
						
						if(self.pointer === numberOfPeriods - self.currentBreakpoint.cellBreakpoint[1]){
		
							var offset = Math.abs(parseInt(Animator.offset(slidingPeriodRow)));
							var slidingRowWidth = slidingPeriodRow.clientWidth;

							if(offset >= self.options.edgeTreshold + (currentCellWidth * self.pointer)){
								legalPosition = false;
							}
						}else{
							self.pointer = startingPointer + tick;
						}
					}
				cachedPosition = position;
			}
		});

		setListener(el, Toucher.touchEvents.end, function(){
			//e.preventDefault();
			Toucher.onTouchEnd();
			startingOffset = 0;
			var offset = parseInt(Animator.offset(slidingPeriodRow));
			self.resetDragging(parseInt(offset + self.pointer * currentCellWidth));
			legalPosition = true;
			self.updateArrows();					
		});

	});	

};


Tabella.prototype.resetDragging = function(offset){
	var self = this;
	Animator.stopDragging();
	Animator.animate(self.slidingRows, offset, getReboundTime(offset, self.options.reboundSpeed), 'easeOutBack');
};*/

