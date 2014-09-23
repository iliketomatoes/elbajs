/* public functions
************************************/
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
	setupSlides : function(){
		var self = this;
		
		for(var i = 0; i < slides.length; i++){
			var slide = slides[i];
 			if(slide) {
				self.load(slide);
 			} 
 		}
	},
	load : function(ele){
		if(!isElementLoaded(ele)) loadImage(ele);
	},
	swipe : function(direction){
		var self = this, leftOffset;

		if(direction === 'right'){
			if(pointer + 1 >= count ){
				return false;
			}
			pointer++;
			leftOffset = intVal(self.el.style.left) - intVal(slides[pointer].offsetWidth);
			self.el.style.left = leftOffset + 'px'; 
		}else{
			if(pointer - 1 < 0 ){
				return false;
			}
			pointer--;
			leftOffset = intVal(self.el.style.left) + intVal(slides[pointer].offsetWidth);
			self.el.style.left = leftOffset + 'px'; 
		}
	}
};	