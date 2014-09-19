//extends constructor
Elba.prototype = {

	defaults : {
		selector : 'div',
		separator : '|',
		breakpoints : false,
	},

	_init : function(){
		var self = this;

		console.log(options);
		// First we create an array of images to lazy load
		createImageArray(options.selector, self.el);
		self._setup();
	},

	_setup : function(){
		var self = this;

		for(var i = 0; i<count; i++){
			var image = images[i];
 			if(image) {
				self._load(image);
 				images.splice(i, 1);
 				count--;
 				i--;
 				console.log(images);
 			} 
 		}
	},

	_load : function(){
		if(!isElementLoaded(element)) loadImage(element);
	}

};	