;(function(){
	var gallery = new Elba( document.getElementById('carousel'), {
		slideshow: false,
		duration : 700,
		easing: 'easeOutCubic',
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
		navigation: false,
        breakpoints: [{
	          width: 561 // min-width
			, src: 'data-src-medium'
	     }],
	     preload: 0,
	     container: 'small-elba',
	     dotsContainer: 'small-carousel-dot-ctr'
    });
})();
