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
	setupImages : function(){
		var self = this;

		//handle multi-served image src
		each(options.breakpoints, function(object){
			if(object.width >= window.screen.width) {
				source = object.src;
				return false;
			}
		});

		for(var i = 0; i < images.length; i++){
			var image = images[i];
 			if(image) {
				self.load(image);
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
				console.log('maximum');
				return false;
			}
			pointer++;
			leftOffset = intVal(self.el.style.left) - intVal(images[pointer].offsetWidth);
			self.el.style.left = leftOffset + 'px'; 
		}else{
			if(pointer - 1 < 0 ){
				console.log('minimum');
				return false;
			}
			pointer--;
			leftOffset = intVal(self.el.style.left) + intVal(images[pointer].offsetWidth);
			self.el.style.left = leftOffset + 'px'; 
		}
	}

};	