/*! elba - v0.0.1 - 2014-09-23
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
	var wrapper, pointer, options, slides, count, isRetina, source, destroyed;

	var navigation = {
		left : null,
		right : null,
		dots : null
	};

	var classie = window.classie;

	//var source, options, winWidth, winHeight, slides, count, isRetina, destroyed;
	//throttle vars
	//var validateT, saveWinOffsetT;

	//Elba constructor
	function Elba( el, settings ) {
		
		var self = this;

		var base = self.el = el;
		destroyed 		= true;
		slides 			= [];
		options 		= extend( self.defaults, settings );
		isRetina		= window.devicePixelRatio > 1;
		pointer 		= 0;
		
		// First we create an array of slides to lazy load
		createSlideArray(options.selector, base);
		setSlidesWidth();
		setupWrapper(base);
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
		setupSlides();

		window.addEventListener('resize', resizeHandler.setScope(self), false);
	}
Elba.prototype = {

	defaults : {
		selector : '.elba',
		separator : '|',
		breakpoints : false,
		successClass : 'elba-loaded',
		errorClass : 'elba-error',
		src : 'data-src',
		error : false,
		success : false
	},
	swipe : function(direction){
		var self = this, leftOffset;

		if(direction === 'right'){
			if(pointer + 1 >= count ){
				return false;
			}
			pointer++;
			leftOffset = intVal(self.el.style.left) - intVal(slides[pointer].offsetWidth);
			self.el.style.left = leftOffset + 'px'; 
		}else{
			if(pointer - 1 < 0 ){
				return false;
			}
			pointer--;
			leftOffset = intVal(self.el.style.left) + intVal(slides[pointer].offsetWidth);
			self.el.style.left = leftOffset + 'px'; 
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
}	

function isElementLoaded(ele) {
	var elbaIsland = ele.querySelector('.elba-island');

	if(elbaIsland){
		return classie.has(elbaIsland, options.successClass);
 	}else{
 		return false;
 	}
}

function setupElbaIslands(){
	slides.forEach(function(el){
		var nodeContent = el.querySelector('.elba-content');
		var elbaIsland = document.createElement( 'div' );
		elbaIsland.className = 'elba-island';
		if(nodeContent){
			elbaIsland.wrap(nodeContent);
		}else{
			el.appendChild(elbaIsland);
		}
	});
}

function setupSlides(){
	for(var i = 0; i < slides.length; i++){
			var slide = slides[i];
 			if(slide) {
				loadSlide(slide);
 			} 
 		}
}	 

function loadSlide(ele){
	if(!isElementLoaded(ele)) loadImage(ele);
}
//TODO
function loadImage(ele){
			
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
					// Is element an image or should we add the src as a background image?
					if(ele.nodeName.toLowerCase() === 'img'){
						ele.src = src;
					}else{
						elbaIsland.style.backgroundImage = 'url("' + src + '")';
					}

					classie.add(ele,'no-bg-img');
					classie.add(elbaIsland,  options.successClass);
	
					if(options.success) options.success(ele);
				};
				img.src = src; //preload image
			} else {
				if(options.error) options.error(ele, "missing");
				ele.className = ele.className + ' ' + options.errorClass;
			}	
	 }	 

function setSlidesWidth(){

	var windowWidth = getWindowWidth();

	slides.forEach(function(el){
		el.style.width = windowWidth + 'px';
	});


}

function setSource(){
	source = 0;
	var mediaQueryMin = 0;
	var screenWidth = getWindowWidth();
	//handle multi-served image src
	each(options.breakpoints, function(object){
		console.log(mediaQueryMin);

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

function doResize(base){
	setSlidesWidth();

	for(var i = 0; i < count && i !== pointer; i++){}	

	var leftOffset = - (getWindowWidth() * i);
	base.style.left = leftOffset + 'px';

	var oldSource = source;
	setSource();

	if(oldSource !== source){
		destroy();
		setupSlides();
	}
}


function destroy(){
	for(var i = 0; i < slides.length; i++){
			var slide = slides[i];
 			if(slide) {
				var elbaIsland = slide.querySelector('.elba-island');
				classie.remove(slide,'no-bg-img');
				classie.remove(elbaIsland,  options.successClass);
 			} 
 		}
}
	 
function extend( a, b ) {
	for( var key in b ) { 
		if( b.hasOwnProperty( key ) ) {
			a[key] = b[key];
		}
	}
	return a;
}

function getWindowWidth(){
	return window.innerWidth || document.documentElement.clientWidth;
}

function intVal(str){
	return str === '' ? 0 : parseInt(str, 10);
}	 	

function each(object, fn){
 		if(object && fn) {
 			var l = object.length;
 			for(var i = 0; i<l && fn(object[i], i) !== false; i++){}
 		}
	 }

Function.prototype.setScope = function(scope) {
  var f = this;
  return function() {
    f.apply(scope);
  };
}; 

return Elba;
});