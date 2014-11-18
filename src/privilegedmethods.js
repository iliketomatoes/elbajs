/* 
====================================================
EVERYTHING STARTS HERE
Privileged because they can access private functions
====================================================*/

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
		self.base.el.style.left = (- getContainerWidth(self.base.container)) + 'px';
	
		//Then we setup the navigation arrows
	    if(self.options.navigation){
	    	_setupNavigation(self.base,'left');
			_setupNavigation(self.base,'right');

			//Attach events to the navigation arrows
			self.base.navigation.left.addEventListener('click', function(ev) { 
				ev.preventDefault();
				self.goTo('left');
				if(self.options.slideshow){
					self.startSlideshow();
				}
				}, false);

			self.base.navigation.right.addEventListener('click', function(ev) { 
				ev.preventDefault();
				self.goTo('right');
				if(self.options.slideshow){
					self.startSlideshow();
				}
				}, false);
	    }

	    //Setting up the dots
	    if(self.options.dots){
	    	_setupDots(self.base, self.options.dotsContainer);

	    	classie.add(self.base.navigation.dots[self.base.pointer], 'active-dot');

	    	var dotHandler = function(i){

	    		return function(){
	    			var index = self.base.navigation.dots[i].getAttribute('data-target');

	    			if(parseInt(index) === self.base.pointer){
						return false;
					}else{
						self.goTo(index);
						}
		    		if(self.options.slideshow){
						self.startSlideshow();
					}

					return false;
	    		};	
	    	};

	    	//Binding the click event to the dots
	    	for(var i = 1; i < self.base.slides.length - 1; i++){
					self.base.navigation.dots[i].setAttribute('data-target', i);
					self.base.navigation.dots[i].addEventListener('click', dotHandler(i), false);
				}
	    }

    }

    //Set the width of each slide
    _setSlidesWidth(self.base);

	//Set images' src
	_setSource(self.base, self.options);

	//Starting lazy load 
	_lazyLoadImages(self.base, self.options);

	
	//Bind resize event
	window.addEventListener('resize', function(){
		_resizeHandler(self.base, self.options);
	},false);

	//Let's bind the touchevents
	self.bindTouchEvents();

	if(self.options.slideshow){

		// Set the name of the hidden property and the change event for visibility
		var hidden, visibilityChange; 
		if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support 
		  hidden = 'hidden';
		  visibilityChange = 'visibilitychange';
		} else if (typeof document.mozHidden !== 'undefined') {
		  hidden = 'mozHidden';
		  visibilityChange = 'mozvisibilitychange';
		} else if (typeof document.msHidden !== 'undefined') {
		  hidden =' msHidden';
		  visibilityChange = 'msvisibilitychange';
		} else if (typeof document.webkitHidden !== 'undefined') {
		  hidden = 'webkitHidden';
		  visibilityChange = 'webkitvisibilitychange';
		}

		if (typeof document[hidden] !== 'undefined') {
			// If the page is hidden, pause the slideshow;
			// if the page is shown, play the slideshow
			var handleVisibilityChange = function() {
			  if (document[hidden]) {
			    self.clearSlideshow();
			  } else {
			    self.startSlideshow();
			  }
			};

			// Handle page visibility change   
  			document.addEventListener(visibilityChange, handleVisibilityChange, false);
		}

		//We start the slideshow
		self.startSlideshow();
	}
};


/**
* Manages which direction and which picture to slide to
* @param {String} || {Number} accepts 'right','left'
* or the numerical index of the slide
*/
this.goTo = function(direction){
	var self = this;

	if(!self.base.animated){
		if(typeof direction === 'string' && isNaN(direction)){
		var count = self.base.slides.length;
		if(direction === 'right'){
			if(self.base.pointer + 1 >= count){
				return false;
			}
			self.base.directionHint = 'right';
			self.base.pointer++;
			_lazyLoadImages(self.base, self.options);
			animate(self.base, self.options,'right');
		}else{
			if(self.base.pointer - 1 < 0 ){
				return false;
			}
			self.base.directionHint = 'left';
			self.base.pointer--;
			_lazyLoadImages(self.base, self.options);
			animate(self.base, self.options,'left');
			}
		}else if(!isNaN(direction)){
			var oldPointer = self.base.pointer;
			self.base.pointer = parseInt(direction);
			if(self.base.pointer > oldPointer){
				self.base.directionHint = 'right';
				_lazyLoadImages(self.base, self.options);
				animate(self.base, self.options, 'right');
			}else{
				self.base.directionHint = 'left';
				_lazyLoadImages(self.base, self.options);
				animate(self.base, self.options, 'left');
			}	
		}

		if(self.options.dots){
	        _updateDots(self.base);
	    }
	}
	
};


this.bindTouchEvents = function(){

	var self = this;

	var touchStarted = false, // detect if a touch event is sarted
		swipeTreshold = 80,
		taptreshold = 200,
		precision =  60 / 2, // touch events boundaries ( 60px by default )
		tapNum = 0,
		currX, currY, cachedX, cachedY, tapTimer;

	var getPointerEvent = function(event) {
			return event.targetTouches ? event.targetTouches[0] : event;
		};

	/*var	sendEvent = function(elm, eventName, originalEvent, data) {
			var customEvent = document.createEvent('Event');
			data = data || {};
			data.x = currX;
			data.y = currY;
			data.distance = data.distance;
			
			customEvent.originalEvent = originalEvent;
			for (var key in data) {
				customEvent[key] = data[key];
			}
			customEvent.initEvent(eventName, true, true);
			elm.dispatchEvent(customEvent);
		};*/

	var onTouchStart = function(e) {

		//From http://stackoverflow.com/questions/9506041/javascript-events-mouseup-not-firing-after-mousemove
		if(e.type === 'mousedown') e.preventDefault();

		var pointer = getPointerEvent(e);
			// caching the current x
			cachedX = currX = pointer.pageX;
			// caching the current y
			cachedY = currY = pointer.pageY;
			// a touch event is detected
			touchStarted = true;
			tapNum++;
			// detecting if after 200ms the finger is still in the same position
			clearTimeout(tapTimer);
			tapTimer = setTimeout(function() {
				if (
					cachedX >= currX - precision &&
					cachedX <= currX + precision &&
					cachedY >= currY - precision &&
					cachedY <= currY + precision &&
					!touchStarted
				) {
					// Here you get the Tap event
					//sendEvent(e.target, (tapNum === 2) ? 'dbltap' : 'tap', e);
				}
				tapNum = 0;
			}, taptreshold);

	};

	var	onTouchEnd = function() {

		var eventsArr = [],
			deltaY = cachedY - currY,
			deltaX = cachedX - currX;
			touchStarted = false;

			if (deltaX <= -swipeTreshold){
				eventsArr.push('swiperight');
				//console.log('swiperight');
				self.goTo('left');
			}
				

			if (deltaX >= swipeTreshold){
				eventsArr.push('swipeleft');
				//console.log('swipeleft');
				self.goTo('right');
			}
				

			if (deltaY <= -swipeTreshold){
				eventsArr.push('swipedown');
				//console.log('swipedown');
			}
				

			if (deltaY >= swipeTreshold){
				eventsArr.push('swipeup');
				//console.log('swipeup');
			}
				

			if (eventsArr.length) {
				for (var i = 0; i < eventsArr.length; i++) {
					var eventName = eventsArr[i];
					/*sendEvent(e.target, eventName, e, {
						distance: {
							x: Math.abs(deltaX),
							y: Math.abs(deltaY)
						}
					});*/
				}
			}

			if(self.options.slideshow){
					self.startSlideshow();
				}

	};

	var onTouchMove = function(e) {

		var pointer = getPointerEvent(e);
			currX = pointer.pageX;
			currY = pointer.pageY;

	};

	//setting the events listeners
	setListener(self.base.el, self.touchHandler.touchEvents.touchStart + ' mousedown', onTouchStart);
	setListener(self.base.el, self.touchHandler.touchEvents.touchEnd + ' mouseup', onTouchEnd);
	setListener(self.base.el, self.touchHandler.touchEvents.touchMove + ' mousemove', onTouchMove);
};

