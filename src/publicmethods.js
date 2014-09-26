/* public functions
************************************/
Elba.prototype = {

	defaults : {
		selector : '.elba',
		separator : '|',
		breakpoints : false,
		successClass : 'elba-loaded',
		errorClass : 'elba-error',
		container : 'elba-wrapper',
		src : 'data-src',
		error : false,
		success : false,
		duration : 800,
		delta : function(progress){
			return power(progress, 2);
		},
		delay : 10,
		transitionEase : 'ease-in-out'
	},
	swipe : function(direction){
		var self = this;

		if(direction === 'right'){
			goTo(self.el, 'right');
		}else{
			goTo(self.el, 'left');
		}
	}
};	