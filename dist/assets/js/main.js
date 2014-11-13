! function(){
	var gallery = new Elba( document.getElementById('carousel'), {
		slideshow: 5000,
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
