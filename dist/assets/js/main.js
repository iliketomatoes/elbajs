;(function(){
	var gallery = new Elba( document.getElementById('carousel'), {
		slideshow: 5000,
		duration : 1000,
        breakpoints: [{
	          width: 768 // min-width
			, src: 'data-src-medium'
	     }
           , {
	          width: 1080 // min-width
	        , src: 'data-src-large'
	}]
    });

    var smallGallery = new Elba( document.getElementById('small-carousel'), {
		slideshow: 0,
        breakpoints: [{
	          width: 561 // min-width
			, src: 'data-src-medium'
	     }],
	     preload: 0,
	     container: 'small-elba'
    });

    /*var test = setTimeout(function() {
    	console.log(gallery.stopSlideshow());
    }, 15000);*/
})();
