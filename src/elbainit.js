	//Declare a private variable to hold the options
	var _options;

	//Declare an object holding the main parts of the gallery
	var _base = {
		el : null,
		slides : [],
		wrapper : null,
		count : 0,
		navigation : {
			left : null,
			right : null,
			dots : null
		}
	};	

	var self = this;

	//self.el = el;
	_base.el = self.el = el;
	self.animated = false;

	//Overwrite the default options
	_options = self.options = extend( self.defaults, settings );

	//Init the pointer to the visible slide
	self.pointer = 0;

	//Init pointer for loading slides
	self.loaderPointer = 0;

	/**
	 * Store the slides into _base.slides array
	 */
	_createSlideArray(_base);

	/**
	 * Wrap the carousel into the elba-wrapper class div
	 */
	_setupWrapper(_base);

	/**
	 * Clone head and tail of the gallery to make the sliding show circular
	 */
	_setUpNavAndImg(_base, _options);

	self.init(_base,_options);