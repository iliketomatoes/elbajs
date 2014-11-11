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

function isElementLoaded(ele, successClass) {
  return classie.has(ele, successClass);
}

