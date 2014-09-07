/*! elba - v0.0.1 - 2014-09-07
* https://github.com/dedalodesign/elbajs
* Copyright (c) 2014 ; Licensed  */
;(function (window, document, undefined) {

'use strict';
 
function extend( a, b ) {
	for( var key in b ) { 
		if( b.hasOwnProperty( key ) ) {
			a[key] = b[key];
		}
	}
	return a;
}	

//Elba constructor
function Elba( el, options ) {
		this.el = el;
		this.options = extend( this.defaults, options );
		//Init images container
		this.imgCarrier = [];
		this._init();
	}

//extends constructor
Elba.prototype = {

	defaults : {

	},

	_init : function(){
		var self = this, 
			imageList,
			imageArr;

		function pushImg(element, index, array){
			console.log(element);
			var src = element.getAttribute('data-src');
			self.imgCarrier.push( { index : index, img : src } );
			console.log( 'self.imgCarrier -> ' + self.imgCarrier );
		}	
	
		imageList = Array.prototype.slice.call( self.el.querySelectorAll( 'img' ) );

		imageList.forEach( pushImg );

	},

	_setup : function(){

	}
//Close Elba.protoype extension
};

// add to global namespace
window.Elba = Elba;

}(window, window.document, undefined));