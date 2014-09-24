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
