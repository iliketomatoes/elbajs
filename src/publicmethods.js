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
	swipe : function(direction){
		var self = this, leftOffset;

		if(direction === 'right'){
			if(pointer + 1 >= count ){
				return false;
			}
			pointer++;
			leftOffset = - (intVal(slides[pointer].offsetWidth) * (pointer));
			leftOffset += 'px'; 
			self.el.style[vendorTransform] = 'translateX(' + leftOffset+ ')';
		}else{
			if(pointer - 1 < 0 ){
				return false;
			}
			leftOffset = - (intVal(slides[pointer].offsetWidth) * (pointer - 1));
			pointer--;
			leftOffset += 'px'; 
			self.el.style[vendorTransform] = 'translateX(' + leftOffset+ ')';
		}
	}
};	