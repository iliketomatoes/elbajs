/*! elba - v0.1.0 - 2014-10-05
* https://github.com/dedalodesign/elbajs
* Copyright (c) 2014 ; Licensed  */
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

( function( window ) {

'use strict';

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

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = classie;
} else {
  // browser global
  window.classie = classie;
}

})( window );


/*
 * Wrap an HTMLElement around each element in an HTMLElement array.
 */
( function( window ) {

'use strict';

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

})( window );


/*
 * Set function scope's trick
 */
( function() {

'use strict';

Function.prototype.setScope = function(scope) {
  var f = this;
  return function() {
    f.apply(scope);
  };
};

})();

;(function(elbaJS) {

	'use strict';
	
	if (typeof define === 'function' && define.amd) {
        	// Register elba as an AMD module
        	define(elbaJS);
	} else {
        	// Register elba on window
        	window.Elba = elbaJS();
	}
})
(function () {

'use strict';
 
	var classie = window.classie;
	var isRetina = window.devicePixelRatio > 1;

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

  	var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  	//from http://easings.net/
  	var easingObj = {
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

	//Elba constructor
	function Elba( el, settings ) {
		
		var self = this;

		self.el = el;
		self.animated = false;
		self.options 	= extend( self.defaults, settings );
		
		self.pointer 		= 0;
		self.loaderPointer   = 0;

		var ELBA = new CarouselHandler(self.el, self.options);

		self.slides = ELBA.getSlides();

		self.container = getContainer(el, self.options.container);

		self.setSlidesWidth();

		if(self.slides.length > 1){
			self.pointer 		= 1;
			self.loaderPointer   = 1;
			self.el.style.left = (- self.getContainerWidth()) + 'px';

			//Bind navigation events
			if(self.options.navigation){
			bindEvent(ELBA.getLeftNav(), 'click', function(ev) { 
				ev.preventDefault();
				self.goTo('left');
				if(self.options.slideshow){
					self.startSlideshow();
				}
				});

			bindEvent(ELBA.getRightNav(), 'click', function(ev) { 
				ev.preventDefault();
				self.goTo('right');
				if(self.options.slideshow){
					self.startSlideshow();
				}
				});
			}
			
			if(self.options.dots){
				self.dots = ELBA.getDots();

				classie.add(self.dots[self.pointer], 'active-dot');

				for(var i = 1; i < self.slides.length - 1; i++){
					self.dots[i].setAttribute('data-target', i);
					bindEvent(self.dots[i], 'click', function(ev){
						ev.preventDefault();
						self.dotTo(this.getAttribute('data-target'));
						if(self.options.slideshow){
							self.startSlideshow();
						}
					});
				}

			}
		}

		//Set images' src
		self.setSource();
		
		//Starting lazy load 
		loadLazyImage.call(self);

		//Bind resize event
		bindEvent(window, 'resize', resizeHandler.setScope(self));

		if(self.options.slideshow){
			self.startSlideshow();
		}
	
function isElementLoaded(ele, successClass) {
	return classie.has(ele, successClass);
}

function loadLazyImage(loadIndex){

	var self = this;
	var loaderPointer = loadIndex || self.loaderPointer;
	var ele = self.slides[loaderPointer];
	var count = self.slides.length;

	if(isElementLoaded(ele, self.options.successClass)){
		if(count > 1 && ((loaderPointer + 1) < (count - 1))){
				loaderPointer++;
				loadLazyImage.call(self,loaderPointer);
			}
	}

	var dataSrc = ele.getAttribute(self.source || self.options.src); // fallback to default data-src
	var elbaIsland = ele.querySelector('.elba-island');

	if(dataSrc){
		var dataSrcSplitted = dataSrc.split(self.options.separator);
		var src = dataSrcSplitted[isRetina && dataSrcSplitted.length > 1 ? 1 : 0];
		var img = new Image();
		
		img.onerror = function() {
			if(self.options.error) self.options.error(ele, "invalid");
			ele.className = ele.className + ' ' + self.options.errorClass;

			if(count > 1 && loaderPointer + 1 < count - 1){
				loaderPointer++;
				loadLazyImage.call(self,loaderPointer);
			}
		}; 
		img.onload = function() {
			
			elbaIsland.src = src;

			self.setImageSize(elbaIsland);

			classie.add(ele,'no-bg-img');
			classie.add(ele,  self.options.successClass);

			if(self.options.success) self.options.success(ele);

			//Update the Head and Tail clone
			if(count > 1 && (loaderPointer === 1 || loaderPointer === 0 || loaderPointer === (count - 1) || loaderPointer === (count - 2))){

				var parentClone,elbaClone;

				if(loaderPointer === 1){
					parentClone = self.slides[count - 1];
				}else if(loaderPointer === (count - 1)){
					parentClone = self.slides[1];
					}else if(loaderPointer === 0){
						parentClone = self.slides[count - 2];
						}else{
							parentClone = self.slides[0];
						}
				
				if(!isElementLoaded(parentClone, self.options.successClass)){
					elbaClone = parentClone.querySelector('.elba-island');

					elbaClone.src = src;
					self.setImageSize(elbaClone);
					
					classie.add(parentClone,'no-bg-img');
					classie.add(parentClone,  self.options.successClass);
				}
				
			}

			if(count > 1 && loaderPointer + 1 < count - 1){
				loaderPointer++;
				loadLazyImage.call(self,loaderPointer);
			}
			
		};
		img.src = src; //preload image
	} else {
		if(self.options.error) self.options.error(ele, "missing");
		ele.className = ele.className + ' ' + self.options.errorClass;
	}	
}	 	 


// taken from https://github.com/desandro/vanilla-masonry/blob/master/masonry.js by David DeSandro
// original debounce by John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
function resizeHandler() {
		var self = this;
		function delayed() {
			doResize.call(self);
			self._resizeTimeout = null;
		}

		if ( self._resizeTimeout ) {
			clearTimeout( self._resizeTimeout );
		}

		self._resizeTimeout = setTimeout( delayed, 200 );
	}

function doResize(){
	var self = this;

	self.setSlidesWidth();
	self.goTo();

	var oldSource = self.source;
	self.setSource();

	if(oldSource !== self.source){
		destroy.call(self);
		loadLazyImage.call(self);
	}else{
		for(var i = 0; i < self.slides.length; i++){
			var slide = self.slides[i];
 			if(slide) {
				var elbaIsland = slide.querySelector('.elba-island');
				self.setImageSize(elbaIsland);
 			} 
 		}
	}
}


function destroy(){
	var self = this;
	var count = self.slides.length;
	if(count > 1){
		self.loaderPointer   = 1;
	}else{
		self.loaderPointer   = 0;
	}
	
	for(var i = 0; i < count; i++){
			var slide = self.slides[i];
 			if(slide) {
				classie.remove(slide,'no-bg-img');
				classie.remove(slide,  self.options.successClass);
 			} 
 		}
}


//Closing Elba constructor
}


/* Extending Elba constructor
************************************/
Elba.prototype.defaults = {
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
	slideshow : 5000
};

Elba.prototype.getContainerWidth = function(){
	var self = this;
	return getContainerWidth(self.container);
};

Elba.prototype.getContainerHeight = function(){
	var self = this;
	return getContainerHeight(self.container);
};		

Elba.prototype.setSlidesWidth = function(){
	var self = this;
	var containerWidth = self.getContainerWidth();
	var carouselWidth = 0;

	self.slides.forEach(function(el){
		carouselWidth += containerWidth;
		el.style.width = containerWidth + 'px';
	});

	self.el.style.width = carouselWidth + 'px';
};

Elba.prototype.setSource = function(){
	var self = this;
	self.source = 0;
	var mediaQueryMin = 0;
	var screenWidth = self.getContainerWidth();
	//handle multi-served image src
	each(self.options.breakpoints, function(object){
		if(object.width <= screenWidth && Math.abs(screenWidth - object.width) < Math.abs(screenWidth - mediaQueryMin)){
			mediaQueryMin = object.width;
			self.source = object.src;
			return true;
		}
	});
};

Elba.prototype.goTo = function(direction){
	var self = this;
	if(typeof direction === 'string' && isNaN(direction)){
		var count = self.slides.length;
		if(direction === 'right'){
			if(self.pointer + 1 >= count){
				return false;
			}
			self.pointer++;
			animate.call(self, 'right');
		}else{
			if(self.pointer - 1 < 0 ){
				return false;
			}
			self.pointer--;
			animate.call(self, 'left');
		}
	}else if(!isNaN(direction)){
		var oldPointer = self.pointer;
		self.pointer = parseInt(direction);
		if(self.pointer > oldPointer){
			animate.call(self, 'right');
		}else{
			animate.call(self, 'left');
		}	
	}else{
		self.el.style.left = intVal(self.getLeftOffset()) + 'px';
	}	
};

Elba.prototype.dotTo = function(index){
	var self = this;

	if(parseInt(index) === self.pointer){
		return false;
	}else{
		self.goTo(index);
	}

};

Elba.prototype.updateDots = function(){
	var self = this;

	self.dots.forEach(function(el){
		classie.remove(el,'active-dot');
	});

	var index;

	if(self.pointer === self.slides.length - 1){
		index = 1;
	}else if(self.pointer === 0){
		index = self.slides.length - 2;
	}else{
		index = self.pointer;
	}

	classie.add(self.dots[index],'active-dot');

};

Elba.prototype.getLeftOffset = function(){
	var self = this;	
	return - (self.getContainerWidth() * self.pointer);
};

Elba.prototype.setImageSize = function(elbaIsland){
	var self = this;

	var imgRatio = elbaIsland.naturalHeight / elbaIsland.naturalWidth;
	
    var containerWidth = self.getContainerWidth();
    var containerHeight = self.getContainerHeight();
    var containerRatio = containerHeight / containerWidth;

    var newHeight, newWidth;

    if (containerRatio >= imgRatio){
    	elbaIsland.height = newHeight = Math.ceil(containerHeight);
    	elbaIsland.width = newWidth = Math.ceil(containerHeight / imgRatio);
    }else{
    	elbaIsland.height = newHeight = Math.ceil(containerWidth * imgRatio);
    	elbaIsland.width = newWidth = Math.ceil(containerWidth);
    }

    var centerX = (containerWidth - newWidth) / 2;
	var centerY = (containerHeight - newHeight) / 2;

	elbaIsland.style.left = Math.ceil(centerX) + 'px';
	elbaIsland.style.top = Math.ceil(centerY) + 'px';
};

Elba.prototype.startSlideshow = function(){
	var self = this;
	if(self.slides.length > 1){
		if(self.slideshow){
		clearInterval(self.slideshow);
	}	
	self.slideshow = setInterval(function(){
		if(classie.has(self.slides[self.pointer + 1],'elba-loaded')){
			self.goTo('right');
		}
	},self.options.slideshow);

	}
};

Elba.prototype.clearSlideshow = function(){
	var self = this;	
	if(self.slideshow){
		clearInterval(self.slideshow);
	}
};



function animate(direction) {
  
  var self = this;
  var ele = self.el;    
  var target = self.getLeftOffset();
  var count = self.slides.length;

  if(self.animated){
    return false;
  }

  self.animated = true;

  var startingOffset = intVal(ele.style.left);
  
  var deltaOffset = Math.abs(startingOffset - target);
  if(direction === 'right') deltaOffset = -deltaOffset;

  var duration = self.options.duration; // duration of animation in milliseconds.
  var epsilon = (1000 / 60 / duration) / 4;

  var easeing = getBezier(easingObj[self.options.easing],epsilon);

  var start = null, myReq;

   function animationStep(timestamp) {
      if (start === null) start = timestamp;

      var timePassed = (timestamp - start);
      var progress = timePassed / duration;

      if (progress > 1) progress = 1;

      var delta = easeing(progress).toFixed(6);
        step(ele, delta, startingOffset, deltaOffset);

      if (progress == 1){
        progress = 1;
        if(count > 1){
          if(self.pointer === (count - 1)){
            self.pointer = 1;
            ele.style.left = intVal(self.getLeftOffset()) + 'px';
          }else if(self.pointer === 0){
            self.pointer = count - 2;
            ele.style.left = intVal(self.getLeftOffset()) + 'px';
          }
        }
         self.animated = false;
         start = null;
         cancelAnimationFrame(myReq);
         if(self.dots){
            self.updateDots();
          }
      }else{
        requestAnimationFrame(animationStep);
      }

    }
  
  //Global variables                              
  if(requestAnimationFrame && cancelAnimationFrame){

  myReq = requestAnimationFrame(animationStep);

  }else{

      //TODO a bettert fallback if window.requestAnimationFrame is not supported
      var id = setInterval(function() {

      if (start === null) start = new Date();  

      var timePassed = new Date() - start;
      var progress = timePassed / duration;

      if (progress > 1) progress = 1;

      var delta = easeing(progress).toFixed(6);

      step(ele, delta, startingOffset, deltaOffset);
      
      if (progress == 1) {

        if(count > 1){
          if(self.pointer === (count - 1)){
            self.pointer = 1;
            ele.style.left = intVal(self.getLeftOffset()) + 'px';
          }else if(self.pointer === 0){
            self.pointer = count - 2;
            ele.style.left = intVal(self.getLeftOffset()) + 'px';
          }
        }
         clearInterval(id);
         start = null;
         self.animated = false;
         if(self.dots){
            self.updateDots();
          }
      }
    },25);
  }                             

}


function step(ele, delta, startingOffset, deltaOffset){
  var actualOffset = startingOffset + (deltaOffset * delta);
  ele.style.left = Math.ceil(actualOffset) + 'px'; 
}

function getBezier(easingArr, epsilon){
  return bezier(easingArr[0], easingArr[1], easingArr[2], easingArr[3], epsilon);
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

    t0 = 0, t1 = 1, t2 = x;

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








function CarouselHandler(base, options){

	var self = this;

	self.slides = [];
	self.count = 0;
	self.navigation = {
		left : null,
		right : null,
		dots : null
	};

	// First we create an array of slides to lazy load
    self.createSlideArray(options.selector, base);

    // Then set up the carousel wrapper
    self.setupWrapper(base);

    if(self.count > 1){
    	self.cloningHeadAndTail(base);

    	//Setting up the navigation
	    if(options.navigation){
	    	self.setupNavigation('left');
			self.setupNavigation('right');
	    }

	    if(options.dots){
	    	self.setupDots(options.dotsContainer);
	    }
    }

	self.setupElbaIslands();
}

CarouselHandler.prototype.createSlideArray = function(selector, parentSelector){
	var self = this;
	var parent = parentSelector || document;
	var nodelist = parent.querySelectorAll(selector);
	self.count 	= nodelist.length;
	//converting nodelist to array
	for(var i = self.count; i--; self.slides.unshift(nodelist[i])){}
};

CarouselHandler.prototype.cloningHeadAndTail = function(base){
	var self = this;

	if(self.count > 1){
		var cloneTail = self.slides[self.count - 1].cloneNode(true);
		base.insertBefore(cloneTail, base.firstChild);
		self.slides.unshift(cloneTail);

		var cloneHead = self.slides[1].cloneNode(true);
		base.appendChild(cloneHead);
		self.slides.push(cloneHead);
		self.count += 2;
	}	
};

CarouselHandler.prototype.setupWrapper = function(base){
	var self = this;

	self.wrapper = document.createElement( 'div' );
	self.wrapper.className = 'elba-wrapper';
	self.wrapper.wrap(base);
};

CarouselHandler.prototype.setupNavigation = function(direction){
	var self = this;

	self.navigation[direction] = document.createElement( 'a' );
	self.navigation[direction].className = 'elba-' + direction + '-nav';
	self.navigation[direction].innerHtml = direction;
	self.wrapper.appendChild(self.navigation[direction]);
};

CarouselHandler.prototype.setupDots = function(dotsContainer){
	var self = this;

	self.navigation.dots = [];

	var actualContainer;

	if(dotsContainer){
		actualContainer = document.getElementById(dotsContainer);
	}else{
		actualContainer = document.createElement('div');
		actualContainer.className = 'elba-dots-ctr';
		self.wrapper.appendChild(actualContainer);
	}

	for(var i = 1; i < self.count - 1; i++){
		self.navigation.dots[i]  = document.createElement('a');
		self.navigation.dots[i].className  = 'elba-dot';
		actualContainer.appendChild(self.navigation.dots[i]);
	}

};

CarouselHandler.prototype.setupElbaIslands = function(){
	var self = this;
	self.slides.forEach(function(el){
		var elbaIsland = document.createElement( 'img' );
		elbaIsland.className = 'elba-island';
		el.appendChild(elbaIsland);
	});
};

CarouselHandler.prototype.getSlides = function(){
	return this.slides;
};

CarouselHandler.prototype.getLeftNav = function(){
	return this.navigation.left;
};

CarouselHandler.prototype.getRightNav = function(){
	return this.navigation.right;
};

CarouselHandler.prototype.getDots = function(){
	return this.navigation.dots;
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

function bindEvent(ele, type, fn) {
     if (ele.attachEvent) {
            ele.attachEvent && ele.attachEvent('on' + type, fn);
          } else {
                 ele.addEventListener(type, fn, false);
          }
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


return Elba;
});