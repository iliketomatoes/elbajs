/*! elba - v0.0.1 - 2014-09-29
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
 
	//vars
	var wrapper, base, container, pointer, loaderPointer, options, slides, count, isRetina, source, destroyed, carouselWidth = 0;

	var navigation = {
		left : null,
		right : null,
		dots : null
	};

	var classie = window.classie;

	var animated = false;

	//Elba constructor
	function Elba( el, settings ) {
		
		var self = this;

		base = self.el = el;
		destroyed 		= true;
		slides 			= [];
		options 		= extend( self.defaults, settings );
		isRetina		= window.devicePixelRatio > 1;
		pointer 		= 0;
		loaderPointer   = 0;

		// First we create an array of slides to lazy load
		createSlideArray(options.selector, base);
		if(count > 1){
			pointer 		= 1;
			loaderPointer   = 1;
			cloningHeadAndTail(base);
		}
			
		setupWrapper(base);
		container = getContainer(el, options.container);
		setSlidesWidth();

		if(count > 1){
			base.style.left = (-getContainerWidth()) + 'px';
		}

		setupNavigation('left');
		setupNavigation('right');

		//setupCarouselWidth(base);

		setupElbaIslands();

		setSource();
		//Init 
		
		setupLazySlide(loaderPointer);

		//Bind events
		window.addEventListener('resize', resizeHandler.setScope(self), false);

		navigation.left.addEventListener('click', function(ev) { 
			ev.preventDefault();
			self.swipe('left');
		}, false);

		navigation.right.addEventListener('click', function(ev) { 
			ev.preventDefault();
			self.swipe('right');
		}, false);
	}
Elba.prototype = {

	defaults : {
		selector : '.elba',
		separator : '|',
		breakpoints : false,
		successClass : 'elba-loaded',
		errorClass : 'elba-error',
		container : 'elba-wrapper',
		src : 'data-src',
		error : false,
		success : false,
		duration : 800,
		easing: null
	},
	swipe : function(direction){
		var self = this;

		if(direction === 'right'){
			goTo(self.el, 'right');
		}else{
			goTo(self.el, 'left');
		}
	}
};	
function setupWrapper(base){
	wrapper = document.createElement( 'div' );
	wrapper.className = 'elba-wrapper';
	wrapper.wrap(base);
}

function createSlideArray(selector, parentSelector) {
		var parent = parentSelector || document;
 		var nodelist 	= parent.querySelectorAll(selector);
 		count 			= nodelist.length;
 		//converting nodelist to array
 		for(var i = count; i--; slides.unshift(nodelist[i])){}
	 }

function cloningHeadAndTail(base){

	if(count > 1){
		var cloneTail = slides[count - 1].cloneNode(true);
		base.insertBefore(cloneTail, base.firstChild);
		slides.unshift(cloneTail);

		var cloneHead = slides[1].cloneNode(true);
		base.appendChild(cloneHead);
		slides.push(cloneHead);
		count += 2;
	}
	
}	

function setupNavigation(direction){
	navigation[direction] = document.createElement( 'a' );
	navigation[direction].className = 'elba-' + direction + '-nav';
	navigation[direction].innerHtml = direction;
	wrapper.appendChild(navigation[direction]);
}

function setSlidesWidth(){

	var containerWidth = getContainerWidth();

	slides.forEach(function(el){
		carouselWidth += containerWidth;
		el.style.width = containerWidth + 'px';
	});

	base.style.width = carouselWidth + 'px';

}

function isElementLoaded(ele) {
	return classie.has(ele, options.successClass);
}

function setupElbaIslands(){
	slides.forEach(function(el){
		var elbaIsland = document.createElement( 'img' );
		elbaIsland.className = 'elba-island';
		el.appendChild(elbaIsland);
	});
}

function setupLazySlide(loaderPointer){
	var slide = slides[loaderPointer];
	 loadLazyImage(slide);	
}

function loadLazyImage(ele){
			
			if(isElementLoaded(ele)){
				if(count > 1 && ((loaderPointer + 1) < (count - 1))){
						loaderPointer++;
						setupLazySlide(loaderPointer);
					}
			}

			var dataSrc = ele.getAttribute(source || options.src); // fallback to default data-src
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

					//setImageData(elbaIsland);
					setImageSize(elbaIsland);

					classie.add(ele,'no-bg-img');
					classie.add(ele,  options.successClass);
	
					if(options.success) options.success(ele);

					//Update the Head and Tail clone
					if(count > 1 && (loaderPointer === 1 || loaderPointer === 0 || loaderPointer === (count - 1) || loaderPointer === (count - 2))){

						var parentClone,elbaClone;

						if(loaderPointer === 1){
							parentClone = slides[count - 1];
						}else if(loaderPointer === (count - 1)){
							parentClone = slides[1];
							}else if(loaderPointer === 0){
								parentClone = slides[count - 2];
								}else{
									parentClone = slides[0];
								}
						
						if(!isElementLoaded(parentClone)){
							elbaClone = parentClone.querySelector('.elba-island');

							elbaClone.src = src;
							setImageSize(elbaClone);
							
							classie.add(parentClone,'no-bg-img');
							classie.add(parentClone,  options.successClass);
						}
						
					}

					if(count > 1 && loaderPointer + 1 < count - 1){
						loaderPointer++;
						setupLazySlide(loaderPointer);
					}
					
				};
				img.src = src; //preload image
			} else {
				if(options.error) options.error(ele, "missing");
				ele.className = ele.className + ' ' + options.errorClass;
			}	
	 }	 	 



function setSource(){
	source = 0;
	var mediaQueryMin = 0;
	var screenWidth = getContainerWidth();
	//handle multi-served image src
	each(options.breakpoints, function(object){
		if(object.width <= screenWidth && Math.abs(screenWidth - object.width) < Math.abs(screenWidth - mediaQueryMin)){
			mediaQueryMin = object.width;
			source = object.src;
			return true;
		}
	});
}

// taken from https://github.com/desandro/vanilla-masonry/blob/master/masonry.js by David DeSandro
// original debounce by John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
function resizeHandler() {
		var self = this;
		function delayed() {
			doResize(self.el);
			self._resizeTimeout = null;
		}

		if ( self._resizeTimeout ) {
			clearTimeout( self._resizeTimeout );
		}

		self._resizeTimeout = setTimeout( delayed, 100 );
	}

function doResize(ele){
	setSlidesWidth();

	goTo(ele);

	var oldSource = source;
	setSource();

	if(oldSource !== source){
		destroy();
		setupLazySlide(loaderPointer);
	}else{
		for(var i = 0; i < slides.length; i++){
			var slide = slides[i];
 			if(slide) {
				var elbaIsland = slide.querySelector('.elba-island');
				setImageSize(elbaIsland);
 			} 
 		}
	}
}


function destroy(){
	if(count > 1){
		loaderPointer   = 1;
	}else{
		loaderPointer   = 0;
	}
	
	for(var i = 0; i < slides.length; i++){
			var slide = slides[i];
 			if(slide) {
				classie.remove(slide,'no-bg-img');
				classie.remove(slide,  options.successClass);
 			} 
 		}
}


function goTo(ele, direction){

	if(typeof direction === 'string'){
		if(direction === 'right'){
			if(pointer + 1 >= count ){
				return false;
			}
			pointer++;
			animate(ele, intVal(getLeftOffset()), 'right');
		}else{
			if(pointer - 1 < 0 ){
				return false;
			}
			pointer--;
			animate(ele, intVal(getLeftOffset()), 'left');
		}
	}else{
		ele.style.left = intVal(getLeftOffset()) + 'px';
	}	
}






function animate(ele, target, direction) {
  
  if(animated){
  	return false;
  }

  animated = true;

  var startingOffset =  intVal(ele.style.left);
  
  var deltaOffset = Math.abs(startingOffset - target);
  if(direction === 'right') deltaOffset = -deltaOffset;

  var duration = options.duration; // duration of animation in milliseconds.
  var epsilon = (1000 / 60 / duration) / 4;

  var easeing = bezier(0.19, 0.96, 0.87, 0.44, epsilon);

  var start = null, myReq;

  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

  var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

   function animationStep(timestamp) {
    console.log('request animation frame!!!');
      var progress;
      if (start === null) start = timestamp;

      var timePassed = (timestamp - start);
      progress = timePassed / duration;

      console.log('progress -> ' + progress);

      if (progress > 1) progress = 1;

      var delta = easeing(progress).toFixed(6);
        console.log('delta -> ' + delta);
        step(ele, delta, startingOffset, deltaOffset);

      if (progress == 1){
        progress = 1;
        if(count > 1){
          if(pointer === (count - 1)){
            pointer = 1;
            ele.style.left = intVal(getLeftOffset()) + 'px';
          }else if(pointer === 0){
            pointer = count - 2;
            ele.style.left = intVal(getLeftOffset()) + 'px';
          }
        }
         animated = false;
         start = null;
         window.cancelAnimationFrame(myReq);
      }else{
        requestAnimationFrame(animationStep);
      }

    }
                                
  if(requestAnimationFrame){

  

  myReq = requestAnimationFrame(animationStep);

  }else{
      var id = setInterval(function() {

      if (start === null) start = new Date();  

      var timePassed = new Date() - start;
      var progress = timePassed / duration;

      if (progress > 1) progress = 1;

      var delta = easeing(progress).toFixed(6);

      step(ele, delta, startingOffset, deltaOffset);
      
      if (progress == 1) {

        if(count > 1){
          if(pointer === (count - 1)){
            pointer = 1;
            ele.style.left = intVal(getLeftOffset()) + 'px';
          }else if(pointer === 0){
            pointer = count - 2;
            ele.style.left = intVal(getLeftOffset()) + 'px';
          }
        }
         clearInterval(id);
         animated = false;
      }
    },25);
  }                             

}


function step(ele, delta, startingOffset, deltaOffset){
	var actualOffset = startingOffset + (deltaOffset * delta);
  console.log(actualOffset);
	ele.style.left = Math.ceil(actualOffset) + 'px'; 
}

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








function setImageSize(elbaIsland){

	var imgRatio = imageAspectRatio(elbaIsland);
	var containerRatio = containerAspectRatio();

    var containerWidth = getContainerWidth();
    var containerHeight = getContainerHeight();

    var newHeight, newWidth;

    if (containerRatio >= imgRatio){
    	elbaIsland.height = newHeight = Math.ceil(containerHeight);
    	elbaIsland.width = newWidth = Math.ceil(containerHeight / imgRatio);
    }else{
    	elbaIsland.height = newHeight = Math.ceil(containerWidth * imgRatio);
    	elbaIsland.width = newWidth = Math.ceil(containerWidth);
    }

    centerImage(elbaIsland, newHeight, newWidth);

}	 


function centerImage(elbaIsland , newHeight, newWidth){

	var centerX = (getContainerWidth() - newWidth) / 2;
	var centerY = (getContainerHeight() - newHeight) / 2;

	elbaIsland.style.left = Math.ceil(centerX) + 'px';
	elbaIsland.style.top = Math.ceil(centerY) + 'px';
}

function imageAspectRatio(img){

    return img.naturalHeight / img.naturalWidth;
}

function containerAspectRatio(){
    var containerWidth = getContainerWidth();
    var containerHeight = getContainerHeight();

    return containerHeight / containerWidth;
}


function extend( a, b ) {
	for( var key in b ) { 
		if( b.hasOwnProperty( key ) ) {
			a[key] = b[key];
		}
	}
	return a;
}

function getContainerWidth(){
    if(typeof container !== 'undefined' && container){
        return container.offsetWidth;
    }else{
        return window.innerWidth || document.documentElement.clientWidth;
    }
}	 	

function getContainerHeight(){
     if(typeof container !== 'undefined' && container){
        return container.offsetHeight;
    }else{
        return window.innerHeight || document.documentElement.clientHeight;
     }
}   

function getLeftOffset(){
  return - (getContainerWidth() * pointer);
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