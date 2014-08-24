var Elba = {
	
	init : function(options,el){
		var self = this;

        self.$elem = $(el);
        self.options = $.extend({}, $.fn.elba.options, self.$elem.data(), options);
        self.imgCarrier = [];
        self.setup();
	},

	setup : function(){
		var self = this;
		self.images = self.$elem.find('img');
		self.images.each(function (index, img){
			var $img = $(img), src;
			$img.data('index', index);
			src = $img.data('src');
			self.imgCarrier.push({index : index, img : src});
		});
		console.log(self.imgCarrier);
	}
};
