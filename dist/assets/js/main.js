! function(){
	var gallery = new Elba( document.getElementById('carousel'), { 
        breakpoints: [{
	          width: 768 // max-width
			, src: 'data-src-medium'
	     }
           , {
	          width: 1080 // max-width
	        , src: 'data-src-large'
	}]
    });
}();
