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
