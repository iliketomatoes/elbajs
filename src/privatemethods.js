/* private functions
************************************/
function isElementLoaded(ele, successClass) {
	return classie.has(ele, successClass);
}

/*function setupLazySlide(slides,loaderPointer){
	var slide = slides[loaderPointer];
	 loadLazyImage(slide);	
}*/

function loadLazyImage(loadIndex){

	var self = this;
	var loaderPointer = loadIndex || self.loaderPointer;
	var ele = self.slides[loaderPointer];
	var count = self.slides.length;

	if(isElementLoaded(ele, self.options.successClass)){
		if(count > 1 && ((loaderPointer + 1) < (count - 1))){
				loaderPointer++;
				console.log('recursively fired');
				loadLazyImage.call(self,loaderPointer);
			}
	}

	var dataSrc = ele.getAttribute(self.source || self.options.src); // fallback to default data-src
	var elbaIsland = ele.querySelector('.elba-island');

	if(dataSrc){
		var dataSrcSplitted = dataSrc.split(self.options.separator);
		var src = dataSrcSplitted[isRetina && dataSrcSplitted.length > 1 ? 1 : 0];
		var img = new Image();
		
		img.onerror = function() {
			if(self.options.error) self.options.error(ele, "invalid");
			ele.className = ele.className + ' ' + self.options.errorClass;
		}; 
		img.onload = function() {
			
			elbaIsland.src = src;

			//setImageData(elbaIsland);
			setImageSize(elbaIsland);

			classie.add(ele,'no-bg-img');
			classie.add(ele,  self.options.successClass);

			if(self.options.success) self.options.success(ele);

			//Update the Head and Tail clone
			if(count > 1 && (loaderPointer === 1 || loaderPointer === 0 || loaderPointer === (count - 1) || loaderPointer === (count - 2))){

				var parentClone,elbaClone;

				if(loaderPointer === 1){
					parentClone = self.slides[count - 1];
				}else if(loaderPointer === (count - 1)){
					parentClone = self.slides[1];
					}else if(loaderPointer === 0){
						parentClone = self.slides[count - 2];
						}else{
							parentClone = self.slides[0];
						}
				
				if(!isElementLoaded(parentClone, self.options.successClass)){
					elbaClone = parentClone.querySelector('.elba-island');

					elbaClone.src = src;
					setImageSize(elbaClone);
					
					classie.add(parentClone,'no-bg-img');
					classie.add(parentClone,  self.options.successClass);
				}
				
			}

			if(count > 1 && loaderPointer + 1 < count - 1){
				loaderPointer++;
				console.log('recursively fired');
				loadLazyImage.call(self,loaderPointer);
			}
			
		};
		img.src = src; //preload image
	} else {
		if(self.options.error) self.options.error(ele, "missing");
		ele.className = ele.className + ' ' + self.options.errorClass;
	}	
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

function doResize(ele){
	setSlidesWidth();

	goTo(ele);

	var oldSource = source;
	setSource();

	if(oldSource !== source){
		destroy();
		setupLazySlide(loaderPointer);
	}else{
		for(var i = 0; i < slides.length; i++){
			var slide = slides[i];
 			if(slide) {
				var elbaIsland = slide.querySelector('.elba-island');
				setImageSize(elbaIsland);
 			} 
 		}
	}
}


function destroy(){
	if(count > 1){
		loaderPointer   = 1;
	}else{
		loaderPointer   = 0;
	}
	
	for(var i = 0; i < slides.length; i++){
			var slide = slides[i];
 			if(slide) {
				classie.remove(slide,'no-bg-img');
				classie.remove(slide,  options.successClass);
 			} 
 		}
}


function goTo(ele, direction){

	if(typeof direction === 'string'){
		if(direction === 'right'){
			if(pointer + 1 >= count ){
				return false;
			}
			pointer++;
			animate(ele, intVal(getLeftOffset()), 'right');
		}else{
			if(pointer - 1 < 0 ){
				return false;
			}
			pointer--;
			animate(ele, intVal(getLeftOffset()), 'left');
		}
	}else{
		ele.style.left = intVal(getLeftOffset()) + 'px';
	}	
}

function animate(ele, target, direction) {
  
  if(animated){
  	return false;
  }

  animated = true;

  var startingOffset = intVal(ele.style.left);
  
  var deltaOffset = Math.abs(startingOffset - target);
  if(direction === 'right') deltaOffset = -deltaOffset;

  var duration = options.duration; // duration of animation in milliseconds.
  var epsilon = (1000 / 60 / duration) / 4;

  var easeing = bezier(0.445, 0.05, 0.55, 0.95, epsilon);

  var start = null, myReq;

  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

  var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

   function animationStep(timestamp) {
    console.log(timestamp);
      if (start === null) start = timestamp;

      var timePassed = (timestamp - start);
      var progress = timePassed / duration;

      //console.log('progress -> ' + progress);

      if (progress > 1) progress = 1;

      var delta = easeing(progress).toFixed(6);
        //console.log('delta -> ' + delta);
        step(ele, delta, startingOffset, deltaOffset);

      if (progress == 1){
        progress = 1;
        if(count > 1){
          if(pointer === (count - 1)){
            pointer = 1;
            ele.style.left = intVal(getLeftOffset()) + 'px';
          }else if(pointer === 0){
            pointer = count - 2;
            ele.style.left = intVal(getLeftOffset()) + 'px';
          }
        }
         animated = false;
         start = null;
         cancelAnimationFrame(myReq);
      }else{
        requestAnimationFrame(animationStep);
      }

    }
                                
  if(requestAnimationFrame && cancelAnimationFrame){

  myReq = requestAnimationFrame(animationStep);

  }else{

      //TODO a bettert fallback if window.requestAnimationFrame is not supported
      var id = setInterval(function() {

      if (start === null) start = new Date();  

      var timePassed = new Date() - start;
      var progress = timePassed / duration;

      if (progress > 1) progress = 1;

      var delta = easeing(progress).toFixed(6);

      step(ele, delta, startingOffset, deltaOffset);
      
      if (progress == 1) {

        if(count > 1){
          if(pointer === (count - 1)){
            pointer = 1;
            ele.style.left = intVal(getLeftOffset()) + 'px';
          }else if(pointer === 0){
            pointer = count - 2;
            ele.style.left = intVal(getLeftOffset()) + 'px';
          }
        }
         clearInterval(id);
         start = null;
         animated = false;
      }
    },25);
  }                             

}


function step(ele, delta, startingOffset, deltaOffset){
	var actualOffset = startingOffset + (deltaOffset * delta);
	ele.style.left = Math.ceil(actualOffset) + 'px'; 
}

this.prova = function(){
	return test();
}

function test(){
	console.log('fsfsdfsd');
}
