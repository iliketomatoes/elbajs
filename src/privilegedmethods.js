this.init = function(){

	var self = this;

	/**
	 * Store the slides into self.base.slides array
	 */
	_createSlideArray(self.base,self.options);

	/**
	 * Wrap the carousel into the elba-wrapper class div
	 */
	_setupWrapper(self.base);

	/**
	 * Clone head and tail of the gallery to make the sliding show circular
	 */
	_cloneHeadAndTail(self.base);

	//Find the gallery container to adapt the size to
	self.base.container = getContainer(self.base.el, self.options.container);
	
	//We move the first slide to the right because of the head clone
	if(self.base.count > 1){
		self.base.el.style.left = (- self.getContainerWidth()) + 'px';
	}

	//Setting up the navigation arrows
    if(self.options.navigation){
    	_setupNavigation(self.base,'left');
		_setupNavigation(self.base,'right');

		//Attach events to the navigation arrows
		bindEvent(self.base.navigation.left, 'click', function(ev) { 
			ev.preventDefault();
			self.goTo('left');
			if(self.options.slideshow){
				self.startSlideshow();
			}
			});

		bindEvent(self.base.navigation.right, 'click', function(ev) { 
			ev.preventDefault();
			self.goTo('right');
			if(self.options.slideshow){
				self.startSlideshow();
			}
			});
    }

    //Setting up the dots
    if(self.options.dots){
    	_setupDots(self.base, self.options.dotsContainer);

    	classie.add(self.base.navigation.dots[self.base.pointer], 'active-dot');

			for(var i = 1; i < self.base.slides.length - 1; i++){
				self.base.navigation.dots[i].setAttribute('data-target', i);
				bindEvent(self.base.navigation.dots[i], 'click', function(ev){
					ev.preventDefault();
					self.dotTo(this.getAttribute('data-target'));
					if(self.options.slideshow){
						self.startSlideshow();
					}
				});
			}
    }

    //Set the width of each slide
    _setSlidesWidth(self.base);

	//Set images' src
	_setSource(self.base, self.options);

	//Starting lazy load 
	_lazyLoadImages(self.base, self.options);

	
	//Bind resize event
	bindEvent(window, 'resize', function(){
		_resizeHandler(self.base, self.options);
	});

	/*if(self.options.slideshow){
		self.startSlideshow();
	}*/
};

