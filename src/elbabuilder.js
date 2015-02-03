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

		// create svg
		var svgURI = 'http://www.w3.org/2000/svg';
			
		base.navigation[direction] = document.createElement( 'a' );
		base.navigation[direction].className = 'elba-' + direction + '-nav';
		
		if(direction === 'left'){

			var svgLeft = document.createElementNS( svgURI, 'svg' );
			// SVG attributes, like viewBox, are camelCased. That threw me for a loop
			svgLeft.setAttribute( 'viewBox', '0 0 100 100' );
			// create arrow
			var pathLeft = document.createElementNS( svgURI, 'path' );
			pathLeft.setAttribute( 'd', 'M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z' );
			pathLeft.setAttribute( 'transform', 'translate(15,0)' );
			// add class so it can be styled with CSS
			pathLeft.setAttribute( 'class', 'elba-svg-arrow' );
			svgLeft.appendChild( pathLeft );

			base.navigation[direction].appendChild(svgLeft);

		}else{

			// add svg to page
			var svgRight = document.createElementNS( svgURI, 'svg' );
			// SVG attributes, like viewBox, are camelCased. That threw me for a loop
			svgRight.setAttribute( 'viewBox', '0 0 100 100' );
			// create arrow
			var pathRight = document.createElementNS( svgURI, 'path' );
			pathRight.setAttribute( 'd', 'M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z' );
			// add class so it can be styled with CSS
			pathRight.setAttribute( 'class', 'elba-svg-arrow' );
			pathRight.setAttribute( 'transform', 'translate(85,100) rotate(180)' );
			svgRight.appendChild( pathRight );

			base.navigation[direction].appendChild(svgRight);
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
