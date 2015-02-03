/*! elba - v0.4.0 - 2015-02-03
* https://github.com/iliketomatoes/elbajs
* Copyright (c) 2015 ; Licensed  */
;(function(elba) {

	'use strict';
	
	if (typeof define === 'function' && define.amd) {
        	// Register elba as an AMD module
        	define(elba);
	} else {
        	// Register elba on window
        	window.Elba = elba();
	}
	
})(function () {

	'use strict';
/*!
* classie v1.0.1
* class helper functions
* from bonzo https://github.com/ded/bonzo
* MIT license
* 
* classie.has( elem, 'my-class' ) -> true/false
* classie.add( elem, 'my-new-class' )
* classie.remove( elem, 'my-unwanted-class' )
* classie.toggle( elem, 'my-class' )
*/

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
	return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
	hasClass = function( elem, c ) {
		return elem.classList.contains( c );
	};
	addClass = function( elem, c ) {
		elem.classList.add( c );
	};
	removeClass = function( elem, c ) {
		elem.classList.remove( c );
	};
	}
	else {
		hasClass = function( elem, c ) {
			return classReg( c ).test( elem.className );
		};
		addClass = function( elem, c ) {
			if ( !hasClass( elem, c ) ) {
			  elem.className = elem.className + ' ' + c;
			}
		};
	removeClass = function( elem, c ) {
	elem.className = elem.className.replace( classReg( c ), ' ' );
	};
}

function toggleClass( elem, c ) {
	var fn = hasClass( elem, c ) ? removeClass : addClass;
	fn( elem, c );
}

var classie = {
	// full names
	hasClass: hasClass,
	addClass: addClass,
	removeClass: removeClass,
	toggleClass: toggleClass,
	// short names
	has: hasClass,
	add: addClass,
	remove: removeClass,
	toggle: toggleClass
};


/*
 * Wrap an HTMLElement around each element in an HTMLElement array.
 */


HTMLElement.prototype.wrap = function (elms) {
	// Convert `elms` to an array, if necessary.
	if (!elms.length) elms = [elms];
 
	// Loops backwards to prevent having to clone the wrapper on the
	// first element (see `child` below).
	for (var i = elms.length - 1; i >= 0; i--) {
		var child = (i > 0) ? this.cloneNode(true) : this;
		var el = elms[i];
 
		// Cache the current parent and sibling.
		var parent = el.parentNode;
		var sibling = el.nextSibling;
 
		// Wrap the element (is automatically removed from its current
		// parent).
		child.appendChild(el);
 
		// If the element had a sibling, insert the wrapper before
		// the sibling to maintain the HTML structure; otherwise, just
		// append it to the parent.
		if (sibling) {
			parent.insertBefore(child, sibling);
		} else {
			parent.appendChild(child);
		}
	}
};

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};

NodeList.prototype.remove = window.HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};

function extend( a, b ) {
	for( var key in b ) { 
		if( b.hasOwnProperty( key ) ) {
			a[key] = b[key];
		}
	}
	return a;
}

function getContainerWidth(container){
    if(typeof container !== 'undefined' && container){
        return container.offsetWidth;
    }else{
        return window.innerWidth || document.documentElement.clientWidth;
    }
}	 	

function getContainerHeight(container){
    if(typeof container !== 'undefined' && container){
        return container.offsetHeight;
    }else{
        return window.innerHeight || document.documentElement.clientHeight;
    }
}   

function each(object, fn){
	if(object && fn) {
		var l = object.length;
		for(var i = 0; i<l && fn(object[i], i) !== false; i++){}
	}
}

function intVal(x){
	if(x){
		return parseInt(x, 10);
	}else{
		return 0;
	}
}

function getLeftOffset(element , multiplier){
	return intVal(- (getContainerWidth(element) * multiplier));
}

function getContainer(el, parentClass){

	while (el && el.parentNode) {
		el = el.parentNode;
		if (el.className === parentClass) {
	  		return el;
		}
	}

	// Many DOM methods return null if they don't 
	// find the element they are searching for
	// It would be OK to omit the following and just
	// return undefined
	return null;
}

function isElementLoaded(ele, successClass) {
	return classie.has(ele, successClass);
}


/**
* Determine if an element is in the viewport, from:
* http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
* 
* @param {HTMLElement} el
*/
function isElementInViewport (el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

function setListener(elm, events, callback) {
	var eventsArray = events.split(' '),
		i = eventsArray.length;

	while (i--) {
		elm.addEventListener(eventsArray[i], callback, false);
	}
}


//http://stackoverflow.com/questions/7212102/detect-with-javascript-or-jquery-if-css-transform-2d-is-available
function getSupportedTransform() {
    var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
    for(var i = 0; i < prefixes.length; i++) {
        if(document.createElement('div').style[prefixes[i]] !== undefined) {
            return prefixes[i];
        }
    }
    return false;
}

function getReboundTime(space, speed){
	return Math.round((Math.abs(space) / speed) * 1000);
}


function slideTo(base, options, direction, newPointer, offset, duration){

	var expectedDuration = duration || options.duration;

	base.pointer = newPointer;
	base.directionHint = direction;
	ImageHandler.lazyLoadImages(base, options);
	Animator.animate(base, offset, options.duration, options.easing);

	if(options.dots){
	        EventHandler.updateDots(base);
	    }
}


	//Check the supported vendor prefix for transformations
	var vendorTransform  =  getSupportedTransform();				    

	//from http://easeings.net/
	var easeingObj = {
		easeInSine : [0.47, 0, 0.745, 0.715],
		easeOutSine : [0.39, 0.575, 0.565, 1],
		easeInOutSine : [0.445, 0.05, 0.55, 0.95],
		easeInQuad : [0.55, 0.085, 0.68, 0.53],
		easeOutQuad : [0.25, 0.46, 0.45, 0.94],
		easeInOutQuad : [0.455, 0.03, 0.515, 0.955],
		easeInCubic : [0.55, 0.055, 0.675, 0.19],
		easeOutCubic : [0.215, 0.61, 0.355, 1],
		easeInOutCubic : [0.645, 0.045, 0.355, 1],
		easeInQuart : [0.895, 0.03, 0.685, 0.22],
		easeOutQuart : [0.165, 0.84, 0.44, 1],
		easeInOutQuart : [0.77, 0, 0.175, 1],
		easeInQuint : [0.755, 0.05, 0.855, 0.06],
		easeOutQuint : [0.23, 1, 0.32, 1],
		easeInOutQuint : [0.86, 0, 0.07, 1],
		easeInExpo : [0.95, 0.05, 0.795, 0.035],
		easeOutExpo : [0.19, 1, 0.22, 1],
		easeInOutExpo : [1, 0, 0, 1],
		easeInCirc : [0.6, 0.04, 0.98, 0.335],
		easeOutCirc : [0.075, 0.82, 0.165, 1],
		easeInOutCirc : [0.785, 0.135, 0.15, 0.86],
		easeInBack : [0.6, -0.28, 0.735, 0.045],
		easeOutBack  : [0.175, 0.885, 0.32, 1.275],
		easeInOutBack  : [0.68, -0.55, 0.265, 1.55],
	};

	var lastTime = 0;

	//rAF polyfill
	if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };

    var requestAnimationFrame =  window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.requestAnimationFrame; 
		
	var cancelAnimationFrame = window.mozCancelAnimationFrame || window.cancelAnimationFrame;	   

	var Animator = {
		easeing : 'easeOutCubic',
		
		animated : false,
		
		dragged : null,

		getAnimationCurve : function(duration, easeing){
			var self = this,
				epsilon = (1000 / 60 / duration) / 4;

			return getBezier(easeing, epsilon);
			},

		actualAnimation : function(base, offset, duration, animationCurve, startingOffset){

			var self = this,
				el = base.el,
				targetOffset = startingOffset - offset,
				count = base.slides.length,
				start = null,
				myReq;

			function animationStep(timestamp){
			
				if (start === null) start = timestamp;

				var timePassed = (timestamp - start);
				var progress = timePassed / duration;

				if (progress >= 1) progress = 1;

				var delta = animationCurve(progress).toFixed(2);

				self.step(el, delta, startingOffset, targetOffset);

				if (progress === 1){

					cancelAnimationFrame(myReq);
					start = null;

					if(count > 1){
					    if(base.pointer === (count - 1)){
					        base.pointer = 1;
					        self.offset(el, getLeftOffset(base.container, base.pointer));
					    }else if(base.pointer === 0){
					        base.pointer = count - 2;
					        self.offset(el, getLeftOffset(base.container, base.pointer));
					    }
					}

					base.animated = false;

					}else{
					requestAnimationFrame(animationStep);
				}

			}

			myReq = requestAnimationFrame(animationStep);

			},

		step : function(el, delta, startingOffset, targetOffset){
			this.offset(el,parseInt(startingOffset) + parseInt((targetOffset - startingOffset) * delta));
			},

		offset : function(elem, length){

			if(typeof length === 'undefined'){

				if(vendorTransform){
					/**
					* @return {Number} the x offset of the translation
					*/
					var parsedXOffset = elem.style[vendorTransform] ? elem.style[vendorTransform].match(/-?\d+/g)[0] : 0;

					return parsedXOffset;
					}else{
						return elem.style.left;
					}		

				}else{
					if(vendorTransform){
						elem.style[vendorTransform] = 'translate(' + length + 'px, 0px)';
					}else{
						elem.style.left = length + 'px';
					}	
				}
			},

		animate : function(base, offset, duration, easeing){

			var self = this,
				easeingVar = easeing || self.easeing;

			var actualEaseing = getEaseing(easeingVar);	

			if(base.animated) return false;
			base.animated = true;

			var animationCurve = self.getAnimationCurve(duration, actualEaseing);

			self.actualAnimation(base, offset, duration, animationCurve, self.offset(base.el));

			},

		drag : function(target, length){
			var self = this;

			if(self.animated) return false;

			self.dragged = requestAnimationFrame(function(){
					self.offset(target, length);
			});
			
			},

		stopDragging : function(){
			var self = this;
			cancelAnimationFrame(self.dragged);
			}	

	};


	/* 
	====================================================
	FUNCTIONS DEALING WITH THE ACTUAL SLIDING ANIMATION
	====================================================*/
	function getEaseing(easeing){
		return easeingObj.hasOwnProperty(easeing) ? easeingObj[easeing] : easeingObj.easeInOutSine;
	}

	function getBezier(easeingArr, epsilon){
		return bezier(easeingArr[0], easeingArr[1], easeingArr[2], easeingArr[3], epsilon);
	}

	// from https://github.com/arian/cubic-bezier
	function bezier(x1, y1, x2, y2, epsilon){

	  	var curveX = function(t){
		    var v = 1 - t;
		    return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
	    };

	  	var curveY = function(t){
		    var v = 1 - t;
		    return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
	    };

	  	var derivativeCurveX = function(t){
		    var v = 1 - t;
		    return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (- t * t * t + 2 * v * t) * x2;
	    };

	  	return function(t){
	    	var x = t, t0, t1, t2, x2, d2, i;

		    // First try a few iterations of Newton's method -- normally very fast.
		    for (t2 = x, i = 0; i < 8; i++){
		      x2 = curveX(t2) - x;
		      if (Math.abs(x2) < epsilon) return curveY(t2);
		      d2 = derivativeCurveX(t2);
		      if (Math.abs(d2) < 1e-6) break;
		      t2 = t2 - x2 / d2;
		    }

		    t0 = 0;
		    t1 = 1; 
		    t2 = x;

		    if (t2 < t0) return curveY(t0);
		    if (t2 > t1) return curveY(t1);
		    // Fallback to the bisection method for reliability.
		    while (t0 < t1){
		      x2 = curveX(t2);
		      if (Math.abs(x2 - x) < epsilon) return curveY(t2);
		      if (x > x2) t0 = t2;
		      else t1 = t2;
		      t2 = (t1 - t0) * 0.5 + t0;
		    }
		    // Failure
		    return curveY(t2);
	    };
	}

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


	var msPointerEnabled = !!navigator.pointerEnabled || navigator.msPointerEnabled,
		msEventType = function(type) {
			var lo = type.toLowerCase(),
				ms = 'MS' + type;
			return navigator.msPointerEnabled ? ms : lo;
		},
		touchEvents = {
			start: msEventType('PointerDown') + ' touchstart mousedown',
			end: msEventType('PointerUp') + ' touchend mouseup',
			move: msEventType('PointerMove') + ' touchmove mousemove'
		},
		getPointerEvent = function(event) {
			return event.targetTouches ? event.targetTouches[0] : event;
		};

	var Toucher = {

		points : {
			cachedX : null,
			cachedY : null,
			currX : null,
			currY : null
		},

	    touchStarted : false,

	    touchEvents : touchEvents,

	    getPointerEvent : getPointerEvent,

	    onTouchStart : function(e) {

			var self = this;

			if(self.touchStarted === true) return false;
			
			var	pointer = self.getPointerEvent(e);

			// caching the current x
			self.points.cachedX = self.points.currX = pointer.pageX;
			// caching the current y
			self.points.cachedY = self.points.currY = pointer.pageY;
			// a touch event is detected
			self.touchStarted = true;

			return self.points;

		},

		onTouchEnd : function() {

			var self = this;

			if(self.touchStarted === false) return false;

			var	deltaY = self.points.cachedY - self.points.currY,
				deltaX = self.points.cachedX - self.points.currX;

			self.touchStarted = false;

			return {
				deltaX : deltaX,
				deltaY : deltaY
			};

		},

		onTouchMove : function(e) {
			var self = this;

			if(self.touchStarted === false) return false;

			var pointer = self.getPointerEvent(e);

			self.points.currX = pointer.pageX;
			self.points.currY = pointer.pageY;

			//We just want horizontal movements
			if(Math.abs(self.points.cachedY - self.points.currY) >= Math.abs(self.points.cachedX - self.points.currX)) return false;
		
			return self.points;
		}
	};







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
		swipeThreshold : 60
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

Elba.prototype.loadImages = function(){

	var self = this;

	//Set images' src
	ImageHandler.setSource(self.base, self.options);

	//Set the width of each slide
    ImageHandler.setSlidesWidth(self.base);

	//Starting lazy load 
	ImageHandler.lazyLoadImages(self.base, self.options);

};


Elba.prototype.bindEvents = function(){

	var self = this,
		position,
		startingOffset,
		cachedPosition,
		startingPointer,
		currentSlideWidth,
		tick = 0,
		delta;

	setListener(self.base.el, Toucher.touchEvents.start, function(e){
	
			startingOffset = parseInt(Animator.offset(self.base.el));
			cachedPosition = Toucher.onTouchStart(e);
			currentSlideWidth = parseInt(self.base.containerWidth);
			startingPointer = self.base.pointer;
		});

	setListener(self.base.el, Toucher.touchEvents.move, function(e){

			position = Toucher.onTouchMove(e);
			
			if(position){

				delta = position.currX - cachedPosition.cachedX;

				//Let's drag the slides around
				Animator.drag(self.base.el, (delta + startingOffset));

				cachedPosition = position;
			}
		});

	setListener(self.base.el, Toucher.touchEvents.end, function(){
		
			Toucher.onTouchEnd();

			var offset = Math.abs(Math.abs((currentSlideWidth * self.base.pointer)) - Math.abs(Animator.offset(self.base.el)));

			var duration = Math.floor(((currentSlideWidth - offset) * self.options.duration) / currentSlideWidth );
			console.log(duration);
			console.log(self.options.duration);

			Animator.stopDragging();

			if(Math.abs(delta) > self.options.swipeThreshold){

				if(delta > 0){
					slideTo(self.base, self.options, 'left', (self.base.pointer - 1), - (currentSlideWidth - offset), duration);
				}else{
					slideTo(self.base, self.options, 'right', (self.base.pointer + 1), currentSlideWidth - offset, duration);
				}
				
			}else{

				//Fix the gallery offset because it didn't reach the threshold.
				Animator.offset(self.base.el, getLeftOffset(self.base.container, self.base.pointer));
			}

			delta = 0;
			startingOffset = 0;
		});	

	if(self.options.navigation){
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

	//Setting up dots events
    if(self.options.dots){

    	var dotHandler = function(i){

    		return function(){
    			var index = parseInt(self.base.navigation.dots[i].getAttribute('data-target'));

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

  
    	for(var i = 1; i < self.base.slides.length - 1; i++){
				self.base.navigation.dots[i].setAttribute('data-target', i);
				self.base.navigation.dots[i].addEventListener('click', dotHandler(i), false);
			}
    }

    if(self.options.slideshow){

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

	//Bind resize event
	window.addEventListener('resize', function(){
		EventHandler.resizeHandler(self.base, self.options);
	}, false);
};

/**
* Manages which direction and which picture to slide to
* @param {String} || {Number} accepts 'right','left'
* or the numerical index of the slide
*/
Elba.prototype.goTo = function(direction){
	var self = this;

	if(!self.base.animated){

		if(typeof direction === 'string' && isNaN(direction)){
		var count = self.base.slides.length;
		if(direction === 'right'){
			if(self.base.pointer + 1 >= count){
				return false;
			}
			slideTo(self.base, self.options, 'right', (self.base.pointer + 1), self.base.containerWidth);
		}else{
			if(self.base.pointer - 1 < 0 ){
				return false;
			}
			slideTo(self.base, self.options, 'left', (self.base.pointer - 1), -self.base.containerWidth);
			}
		}else if(typeof direction === 'number'){
			var oldPointer = self.base.pointer;
			if(self.base.pointer > oldPointer){
				slideTo(self.base, self.options, 'right', direction, parseInt(self.base.containerWidth * (direction - oldPointer)));
			}else{
				slideTo(self.base, self.options, 'left', direction, -parseInt(self.base.containerWidth * (oldPointer - direction)));
			}	
		}

	}
	
};

/**
* A pretty self-explainatory method.
*/
Elba.prototype.startSlideshow = function(){
	var self = this;
	if(self.base.slides.length > 1){
		if(!!self.slideshow){
		clearInterval(self.slideshow);
	}	
	self.slideshow = setInterval(function(){
	
		if(!isElementInViewport(self.base.container)){
			return false;	
		}

		var nextSlide = self.base.slides[self.base.pointer + 1];

		if(!!nextSlide && (classie.has(nextSlide, self.options.successClass) || classie.has(nextSlide, self.options.errorClass))){
			self.goTo('right');
		}
	},self.options.slideshow);

	}
};

/**
* This method temporarly stops the slideshow,
* which is restarted after a click on a navigation button.
*/
Elba.prototype.clearSlideshow = function(){
	var self = this;	
	if(self.slideshow){
		clearInterval(self.slideshow);
	}
};

/**
* This method permanently stops the slideshow.
*/
Elba.prototype.stopSlideshow = function(){
	var self = this;	
	if(self.slideshow){
		clearInterval(self.slideshow);
	}
	self.options.slideshow = 0;
};

/**
* This function returns the current index of the slideshow
* @return {Number}
*/
Elba.prototype.getCurrent = function(){
	return this.base.pointer;
};



return Elba;
});