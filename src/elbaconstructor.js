
var isRetina = window.devicePixelRatio > 1;

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

function Elba(el, settings){

	var self = this;

	var defaults = {
		selector : '.elba',
		separator : '|',
		breakpoints : false,
		successClass : 'elba-loaded',
		errorClass : 'elba-error',
		container : 'elba-wrapper',
		src : 'data-src',
		error : false,
		success : false,
		duration : 700,
		easing: 'easeInOutSine',
		navigation : true,
		dots: true,
		dotsContainer: false, 
		slideshow : 5000,
		preload : 1,
		swipeThreshold : 60,
		epsilon : 0.2
	};	

	if(typeof el === 'undefined') {
		throw new Error();
	}

	//Declare an object holding the main parts of the gallery
	self.base = {
		el : el,
		container : null,
		containerWidth : 0,
		slides : [],
		wrapper : null,
		count : 0,
		source : 0,
		navigation : {
			left : null,
			right : null,
			dots : null
		},
		//Init the pointer to the visible slide
		pointer : 0,
		//Hint for the direction to load
		directionHint : 'right',
		resizeTimeout : null,
		animated : false
	};

	//Overwrite the default options
	self.options = extend(defaults, settings);

	/**
	 * Store the slides into self.base.slides array
	 */
	ElbaBuilder.createSlideArray(self.base, self.options);

	/**
	 * Wrap the carousel into the elba-wrapper class div
	 */
	ElbaBuilder.setupWrapper(self.base);

	/**
	 * Clone head and tail of the gallery to make the sliding show circular
	 */
	ElbaBuilder.cloneHeadAndTail(self.base);

	//Find the gallery container to adapt the size to
	self.base.container = getContainer(self.base.el, self.options.container);

	self.base.containerWidth = getContainerWidth(self.base.container);

	//We move the first slide to the right because of the head clone
	if(self.base.count > 1){

		Animator.offset(self.base.el, - self.base.containerWidth);
	
		//Then we setup the navigation arrows
	    if(self.options.navigation){
	    	ElbaBuilder.setupNavigation(self.base, self.options,'left');
			ElbaBuilder.setupNavigation(self.base, self.options,'right');
	    }

	    //Setting up the dots
	    if(self.options.dots){
	    	ElbaBuilder.setupDots(self.base, self.options.dotsContainer);
	    	classie.add(self.base.navigation.dots[self.base.pointer], 'active-dot');
	    }

    }

    //By calling destroy we are capable to add the .elba-loading class to each slide
    EventHandler.destroy(self.base, self.options);

    self.bindEvents();

    self.loadImages();
			
}
