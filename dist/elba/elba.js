/*! elba - v0.0.1 - 2014-09-26
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
	var wrapper, container, pointer, loaderPointer, options, slides, count, isRetina, source, destroyed;

	var navigation = {
		left : null,
		right : null,
		dots : null
	};

	var classie = window.classie;

	var animated = false;

	// from http://www.developerdrive.com/2012/03/coding-vendor-prefixes-with-javascript/
	var vendorTransform = getVendorPrefix(["transform", "msTransform", "MozTransform", "WebkitTransform", "OTransform"]);

	var has3D = threeDEnabled();

	//Elba constructor
	function Elba( el, settings ) {
		
		var self = this;

		var base = self.el = el;
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
		setupNavigation('left');
		setupNavigation('right');

		navigation.left.addEventListener('click', function(ev) { 
			ev.preventDefault();
			self.swipe('left');
		}, false);

		navigation.right.addEventListener('click', function(ev) { 
			ev.preventDefault();
			self.swipe('right');
		}, false);

		setupCarouselWidth(base);

		setupElbaIslands();

		setSource();
		//Init 
		//setupSlides();
		if(has3D){
			base.style[vendorTransform] = 'translate3d(0,0,0)';
		}
		
		setupLazySlide(loaderPointer);
		window.addEventListener('resize', resizeHandler.setScope(self), false);
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
		delta : function(progress){
			return power(progress, 2);
		},
		delay : 10,
		transitionEase : 'ease-in-out'
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
		console.log(slides);
	}
	
}	

function setupNavigation(direction){
	navigation[direction] = document.createElement( 'a' );
	navigation[direction].className = 'elba-' + direction + '-nav';
	navigation[direction].innerHtml = direction;
	wrapper.appendChild(navigation[direction]);
}

function setupCarouselWidth(base){
	var carouselWidth = count * 100;
		carouselWidth += '%'; 
	base.style.width = carouselWidth;

	if(count > 1){
		base.style.left = (-getContainerWidth()) + 'px';
	}
}	

function isElementLoaded(ele) {
	return classie.has(ele, options.successClass);
}

function setupElbaIslands(){
	slides.forEach(function(el){
		var elbaIsland = document.createElement( 'img' );
		elbaIsland.className = 'elba-island';
		el.appendChild(elbaIsland);
		if(has3D){
			el.style[vendorTransform] = 'translate3d(0,0,0)';
		}
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

					setImageSize(elbaIsland);

					classie.add(ele,'no-bg-img');
					classie.add(ele,  options.successClass);
	
					if(options.success) options.success(ele);

					//Update the Head clone
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

function setSlidesWidth(){

	var windowWidth = getContainerWidth();

	slides.forEach(function(el){
		el.style.width = windowWidth + 'px';
	});


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
				var elbaIsland = slide.querySelector('.elba-island');
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


function getLeftOffset(){
	return - (getContainerWidth() * pointer);
}




function animate(ele, target, direction) {
  
  if(animated){
  	return false;
  }

  animated = true;

  var start = new Date();
  var startingOffset =  intVal(ele.style.left);
  
  var deltaOffset = Math.abs(startingOffset - target);
  if(direction === 'right') deltaOffset = -deltaOffset; 

  var id = setInterval(function() {
    var timePassed = new Date() - start;
    var progress = timePassed / options.duration;

    if (progress > 1) progress = 1;
    
    //var powerEaseOut = makeEaseOut(options.delta);
    //var delta = powerEaseOut(progress);
    var delta = options.delta(progress);
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
  }, options.delay || 25);
  
}


function step(ele, delta, startingOffset, deltaOffset){
	var actualOffset = startingOffset + (deltaOffset * delta);
	ele.style.left = actualOffset + 'px'; 
}


function linear(progress){
	return progress;
}

function power(progress, n) {
  return Math.pow(progress, n).toFixed(2);
}

function squareRoot(progress){
	return Math.sqrt(progress);
}

function circ(progress) {
    return 1 - Math.sin(Math.acos(progress));
}

function back(progress, x) {
    return Math.pow(progress, 2) * ((x + 1) * progress - x);
}

function bounce(progress) {
  for(var a = 0, b = 1, result; 1; a += b, b /= 2) {
    if (progress >= (7 - 4 * a) / 11) {
      return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
    }
  }
}

function elastic(progress, x) {
  return Math.pow(2, 10 * (progress-1)) * Math.cos(20*Math.PI*x/3*progress);
}


function makeEaseOut(delta) {  
  return function(progress) {
    return 1 - delta(1 - progress);
  };
}

function makeEaseInOut(delta) {  
  return function(progress) {
    if (progress < 0.5)
      return delta(2*progress) / 2;
    else
      return (2 - delta(2*(1-progress))) / 2;
  };
}






function setImageSize(elbaIsland){

	var imgRatio = imageAspectRatio(elbaIsland);
	var containerRatio = containerAspectRatio();
	//centerImage(elbaIsland);
	console.log(imgRatio);

	console.log(getContainer(elbaIsland, options.container));	
	
	/*if (containerRatio > imgRatio) {
		elbaIsland.height = getWindowHeight();
		elbaIsland.width = getWindowHeight() * imgRatio;
	}else{
		elbaIsland.height = getWindowWidth() * imgRatio;
		elbaIsland.width = getWindowWidth();
	}*/
}	 

function centerImage(elbaIsland){
	//elbaIsland.left = 
}

function imageAspectRatio(img){
    var naturalWidth = img.width;
    var naturalHeight = img.height;

    return naturalHeight / naturalWidth;
}

//TODO
function containerAspectRatio(container){
    var containerWidth = getContainerWidth(container);
    var containerHeight = getContainerHeight(container);

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

function each(object, fn){
 		if(object && fn) {
 			var l = object.length;
 			for(var i = 0; i<l && fn(object[i], i) !== false; i++){}
 		}
	 }



 // from: https://gist.github.com/streunerlein/2935794
function getVendorPrefix(arrayOfPrefixes) {
 
var tmp = document.createElement("div");
var result = "";
 
for (var i = 0; i < arrayOfPrefixes.length; ++i) {
 
if (typeof tmp.style[arrayOfPrefixes[i]] != 'undefined'){
result = arrayOfPrefixes[i];
break;
}
else {
result = null;
}
}
 
return result;
} 

 // from: https://gist.github.com/lorenzopolidori/3794226
function threeDEnabled(){
    var el = document.createElement('p'),
    has3d,
    transforms = {
        'webkitTransform':'-webkit-transform',
        'OTransform':'-o-transform',
        'msTransform':'-ms-transform',
        'MozTransform':'-moz-transform',
        'transform':'transform'
    };
 
    // Add it to the body to get the computed style
    document.body.insertBefore(el, null);
 
    for(var t in transforms){
        if( el.style[t] !== undefined ){
            el.style[t] = 'translate3d(1px,1px,1px)';
            has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
        }
    }
 
    document.body.removeChild(el);
 
    return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
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