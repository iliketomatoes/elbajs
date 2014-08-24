/*! elba - v0.0.1 - 2014-08-25
* https://github.com/dedalodesign/elbajs
* Copyright (c) 2014 ; Licensed  */
if (typeof Object.create !== "function") {
    Object.create = function (obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

;(function ($, window, document, undefined) {
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

 $.fn.elba = function (options) {
        return this.each(function () {
            if ($(this).data("elba-init") === true) {
                return false;
            }
            $(this).data("elba-init", true);
            var carousel = Object.create(Elba);
            carousel.init(options, this);
        });
    };

    $.fn.elba.options = {

    };
}(jQuery, window, document));