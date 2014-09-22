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
		 return (' ' + ele.className + ' ').indexOf(' ' + options.successClass + ' ') !== -1;
	 }

//TODO
function loadImage(ele){
			
			var dataSrc = ele.getAttribute(options.src);

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
						ele.style.backgroundImage = 'url("' + src + '")';
					}
					ele.className = ele.className + ' ' + options.successClass;	
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

function each(object, fn){
 		if(object && fn) {
 			var l = object.length;
 			for(var i = 0; i<l && fn(object[i], i) !== false; i++){}
 		}
	 }	 */