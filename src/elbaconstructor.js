//var classie = window.classie;
var isRetina = window.devicePixelRatio > 1;

function init(context, el, settings){

	var self = context;

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
		duration : 1000,
		easing: 'easeInOutCubic',
		navigation : true,
		dots: true,
		dotsContainer: false, 
		slideshow : 5000,
		preload : 1,
		textLeft : '\u2190',
		textRight : '\u2192'
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

    self.bindEvents();

    self.loadImages();
			
}

function Elba(el, settings){
		init(this, el, settings);
	}	