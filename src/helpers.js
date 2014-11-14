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

function getLeftOffset(element , multiplier){
	return intVal(- (getContainerWidth(element) * multiplier));
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


/**
* Determine if an element is in the viewport, from:
* http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
* 
* @param {HTMLElement} el
*/
function isElementInViewport (el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

function setListener(elm, events, callback) {
			var eventsArray = events.split(' '),
				i = eventsArray.length;

			while (i--) {
				elm.addEventListener(eventsArray[i], callback, false);
			}
		}