! function(){
	var gallery = new Elba( document.getElementById('carousel'), {
		easing : 'easeInOutSine',
		slideshow : 0,
        breakpoints: [{
	          width: 768 // min-width
			, src: 'data-src-medium'
	     }
           , {
	          width: 1080 // min-width
	        , src: 'data-src-large'
	}]
    });
}();
