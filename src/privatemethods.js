/* private functions
************************************/
function setupWrapper(base){
	wrapper = document.createElement( 'div' );
	wrapper.className = 'elba-wrapper';
	wrapper.wrap(base);
}

function createImageArray(selector, parentSelector) {
		var parent = parentSelector || document;
 		var nodelist 	= parent.querySelectorAll(selector);
 		count 			= nodelist.length;
 		//converting nodelist to array
 		for(var i = count; i--; images.unshift(nodelist[i])){}
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
		 	return (' ' + elbaIsland.className + ' ').indexOf(' ' + options.successClass + ' ') !== -1;
	 	}else{
	 		return false;
	 	}
	}

function setupElbaIslands(){
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

function setSlidesWidth(){

	var windowWidth = getWindowWidth();

	images.forEach(function(el){
		el.style.width = windowWidth + 'px';
	});
}

	 