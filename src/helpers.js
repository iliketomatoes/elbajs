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
