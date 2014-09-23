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
	var wrapper, loader, pointer, options, images, count, isRetina, source, destroyed;

	var navigation = {
		left : null,
		right : null,
		dots : null
	};
	//var source, options, winWidth, winHeight, images, count, isRetina, destroyed;
	//throttle vars
	//var validateT, saveWinOffsetT;

	//Elba constructor
	function Elba( el, settings ) {
		
		this.el         = el;
		destroyed 		= true;
		images 			= [];
		options 		= extend( this.defaults, settings );
		isRetina		= window.devicePixelRatio > 1;
		pointer 		= 0;
		//Init 
		this._init();
	}
//extends constructor
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

	_init : function(){
		var self = this;
		// First we create an array of images to lazy load
		createImageArray(options.selector, self.el);
		setImagesWidth();
		self._setupWrapper();
		self._setupLoader();
		self._setupNavigation('left');
		self._setupNavigation('right');
		self._setupCarousel();
		self._setupImages();
	},
	_setupWrapper : function(){
		var self = this;

		wrapper = document.createElement( 'div' );
		wrapper.className = 'elba-wrapper';
		wrapper.wrap(self.el);
	},
	_setupLoader : function(){

		loader = document.createElement('div');
	},
	_setupNavigation : function(direction){
		var self = this;
		navigation[direction] = document.createElement( 'a' );
		navigation[direction].className = 'elba-' + direction + '-nav';
		navigation[direction].innerHtml = direction;
		wrapper.appendChild(navigation[direction]);

		navigation[direction].addEventListener('click', function(ev) { 
			ev.preventDefault();
			self._swipe(direction);
			});
	},
	_setupCarousel : function(){
		var self = this;

		var carouselWidth = count * 100;
			carouselWidth += '%'; 
		self.el.style.width = carouselWidth;
	},
	_setupImages : function(){
		var self = this;

		//handle multi-served image src
		each(options.breakpoints, function(object){
			if(object.width >= window.screen.width) {
				source = object.src;
				return false;
			}
		});

		prepareElbaIsland();

		for(var i = 0; i < images.length; i++){
			var image = images[i];
 			if(image) {
				self._load(image);
 			} 
 		}
	},
	_load : function(ele){
		if(!isElementLoaded(ele)) loadImage(ele);
	},
	_swipe : function(direction){
		var self = this, leftOffset;

		if(direction === 'right'){
			if(pointer + 1 >= count ){
				console.log('maximum');
				return false;
			}
			pointer++;
			leftOffset = intVal(self.el.style.left) - intVal(images[pointer].offsetWidth);
			self.el.style.left = leftOffset + 'px'; 
		}else{
			if(pointer - 1 < 0 ){
				console.log('minimum');
				return false;
			}
			pointer--;
			leftOffset = intVal(self.el.style.left) + intVal(images[pointer].offsetWidth);
			self.el.style.left = leftOffset + 'px'; 
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

function createImageArray(selector, parentSelector) {
		var parent = parentSelector || document;
 		var nodelist 	= parent.querySelectorAll(selector);
 		count 			= nodelist.length;
 		//converting nodelist to array
 		for(var i = count; i--; images.unshift(nodelist[i])){}
	 }

function isElementLoaded(ele) {
		var elbaIsland = ele.querySelector('.elba-island');

		if(elbaIsland){
		 	return (' ' + elbaIsland.className + ' ').indexOf(' ' + options.successClass + ' ') !== -1;
	 	}else{
	 		return false;
	 	}
	}

		 

function prepareElbaIsland(){
	images.forEach(function(el){
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

//TODO
function loadImage(ele){
			
			var dataSrc = ele.getAttribute(source) || ele.getAttribute(options.src); // fallback to default data-src
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
						console.log(elbaIsland);
						elbaIsland.style.backgroundImage = 'url("' + src + '")';
					}

					window.classie.add(ele,'no-bg-img');
					window.classie.add(elbaIsland,  options.successClass);
	
					if(options.success) options.success(ele);
				};
				img.src = src; //preload image
			} else {
				window.alert('noooo');
			}	
			/*var dataSrc = ele.getAttribute(source) || ele.getAttribute(options.src); // fallback to default data-src
			if(dataSrc) {
				var dataSrcSplitted = dataSrc.split(options.separator);
				var src = dataSrcSplitted[isRetina && dataSrcSplitted.length > 1 ? 1 : 0];
				var img = new Image();
				// cleanup markup, remove data source attributes
				each(options.breakpoints, function(object){
					ele.removeAttribute(object.src);
				});
				ele.removeAttribute(options.src);
				img.onerror = function() {
					if(options.error) options.error(ele, "invalid");
					ele.className = ele.className + ' ' + options.errorClass;
				}; 
				img.onload = function() {
					// Is element an image or should we add the src as a background image?
			      		ele.nodeName.toLowerCase() === 'img' ? ele.src = src : ele.style.backgroundImage = 'url("' + src + '")';	
					ele.className = ele.className + ' ' + options.successClass;	
					if(options.success) options.success(ele);
				};
				img.src = src; //preload image
			} else {
				if(options.error) options.error(ele, "missing");
				ele.className = ele.className + ' ' + options.errorClass;
			}*/
	 }	 

function setImagesWidth(){

	var windowWidth = getWindowWidth();

	images.forEach(function(el){
		el.style.width = windowWidth + 'px';
	});
}

function getWindowWidth(){
	return window.innerWidth || document.documentElement.clientWidth;
}

function intVal(str){
	return str === '' ? 0 : parseInt(str, 10);
}	 	

/*function throttle(fn, minDelay) {
     		 var lastCall = 0;
		 return function() {
			 var now = +new Date();
         		 if (now - lastCall < minDelay) {
           			 return;
			 }
         		 lastCall = now;
         		 fn.apply(images, arguments);
       		 };
	 }
*/	 

function each(object, fn){
 		if(object && fn) {
 			var l = object.length;
 			for(var i = 0; i<l && fn(object[i], i) !== false; i++){}
 		}
	 }	 
return Elba;
});