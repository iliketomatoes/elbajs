;(function(){
	var gallery = new Elba( document.getElementById('carousel'), {
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
		slideshow: 8000,
        breakpoints: [{
	          width: 561 // min-width
			, src: 'data-src-medium'
	     }],
	     container: 'small-elba'
    });

    /*var test = setTimeout(function() {
    	console.log(gallery.stopSlideshow());
    }, 15000);*/
})();
