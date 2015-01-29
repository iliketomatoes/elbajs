/* 
====================================
PRIVATE METHODS
====================================*/

var ElbaBuilder = {

	/**
	* Store the slides into base.slides array
	* @param {Object} base
	* @param {Object} options
	*/
	createSlideArray : function(base, options){

		var nodelist = base.el.querySelectorAll(options.selector);

		base.count = nodelist.length;

		//converting nodelist to array
		for(var i = base.count; i--; base.slides.unshift(nodelist[i])){}
	},
	
	/**
	* Wrap the carousel into the elba-wrapper class div
	* @param {Object} base
	*/
	setupWrapper : function(base){
		base.wrapper = document.createElement( 'div' );
		base.wrapper.className = 'elba-wrapper';
		base.wrapper.wrap(base.el);
	},

	/**
	* Clone head and tail of the gallery to make the sliding show circular
	* and attach empty images to each slide
	* @param {Object} base
	* @param {Object} options
	*/
	cloneHeadAndTail : function(base){
		if(base.count > 1){
			//Update the pointer
			base.pointer = 1;

			var cloneTail = base.slides[base.count - 1].cloneNode(true);
			base.el.insertBefore(cloneTail, base.el.firstChild);
			base.slides.unshift(cloneTail);

			var cloneHead = base.slides[1].cloneNode(true);
			base.el.appendChild(cloneHead);
			base.slides.push(cloneHead);
			base.count += 2;
		}

		//Append an empty image tag to each slide
		base.slides.forEach(function(el){
			var elbaIsland = document.createElement( 'img' );
			elbaIsland.className = 'elba-island';
			el.appendChild(elbaIsland);
		});	
	},

	/**
	* Set up arrows for the navigation
	* @param {Object} base
	* @param {Object} options
	* @param {String} direction
	*/
	setupNavigation : function(base, options, direction){

		var t;

		base.navigation[direction] = document.createElement( 'a' );
		base.navigation[direction].className = 'elba-' + direction + '-nav';
		
		if(direction === 'left'){
			t = document.createTextNode(options.textLeft);
			base.navigation[direction].appendChild(t); 
		}else{
			t = document.createTextNode(options.textRight);
			base.navigation[direction].appendChild(t); 
		}

		base.wrapper.appendChild(base.navigation[direction]);
	},

	/**
	* Set up the navigation dots
	* @param {Object} base
	* @param {String} the container's ID which holds the dots
	*/
	setupDots : function(base, dotsContainer){

		base.navigation.dots = [];

		var actualContainer;

		if(dotsContainer){
			actualContainer = document.getElementById(dotsContainer);
		}else{
			actualContainer = document.createElement('div');
			actualContainer.className = 'elba-dots-ctr';
			base.wrapper.appendChild(actualContainer);
		}

		for(var i = 1; i < base.count - 1; i++){
			base.navigation.dots[i]  = document.createElement('a');
			base.navigation.dots[i].className  = 'elba-dot';
			actualContainer.appendChild(base.navigation.dots[i]);
		}

	}

};
