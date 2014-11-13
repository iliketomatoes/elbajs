function animate(_base, _options, direction) {
  
	var ele = _base.el;

	if(_base.animated){
    	return false;
  	}

  	_base.animated = true;

	var target = getLeftOffset(_base.container, _base.pointer);
	var count = _base.slides.length;

	var startingOffset = intVal(ele.style.left);

	var deltaOffset = Math.abs(startingOffset - target);
	if(direction === 'right') deltaOffset = - deltaOffset;

	var duration = _options.duration; // duration of animation in milliseconds.
	var epsilon = (1000 / 60 / duration) / 4;

	var easeing = getBezier(easingObj[_options.easing],epsilon);

	var start = null, myReq;

	function animationStep(timestamp){
	  if (start === null) start = timestamp;

	  var timePassed = (timestamp - start);
	  var progress = timePassed / duration;

	  if (progress > 1) progress = 1;

	  var delta = easeing(progress).toFixed(6);
	    step(ele, delta, startingOffset, deltaOffset);

	  if (progress == 1){
	    progress = 1;
	    if(count > 1){
	      if(_base.pointer === (count - 1)){
	        _base.pointer = 1;
	        ele.style.left = getLeftOffset(_base.container, _base.pointer) + 'px';
	      }else if(_base.pointer === 0){
	        _base.pointer = count - 2;
	        ele.style.left = getLeftOffset(_base.container, _base.pointer) + 'px';
	      }
	    }
	     _base.animated = false;
	     start = null;
	     cancelAnimationFrame(myReq);
	    
	  }else{
	    requestAnimationFrame(animationStep);
	  }

	}
  
  	//Global variables                              
	if(requestAnimationFrame && cancelAnimationFrame){

		myReq = requestAnimationFrame(animationStep);

	}else{

      //TODO a bettert fallback if window.requestAnimationFrame is not supported
	  	var id = setInterval(function() {

			if (start === null) start = new Date();  

			var timePassed = new Date() - start;
			var progress = timePassed / duration;

			if (progress > 1) progress = 1;

			var delta = easeing(progress).toFixed(6);

			step(ele, delta, startingOffset, deltaOffset);
		  
			if (progress == 1) {
				if(count > 1){
				  if(self.pointer === (count - 1)){
				    self.pointer = 1;
				    ele.style.left = getLeftOffset(_base.container, _base.pointer) + 'px';
				  }else if(self.pointer === 0){
				    self.pointer = count - 2;
				    ele.style.left = (_base.container, _base.pointer) + 'px';
				  }
				}
				 clearInterval(id);
				 start = null;
				 self.animated = false;
				}

		},25);

	}                             

}


function step(ele, delta, startingOffset, deltaOffset){
	var actualOffset = startingOffset + (deltaOffset * delta);
	ele.style.left = Math.ceil(actualOffset) + 'px'; 
}

function getBezier(easingArr, epsilon){
	return bezier(easingArr[0], easingArr[1], easingArr[2], easingArr[3], epsilon);
}

// from https://github.com/arian/cubic-bezier
function bezier(x1, y1, x2, y2, epsilon){

  	var curveX = function(t){
	    var v = 1 - t;
	    return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
    };

  	var curveY = function(t){
	    var v = 1 - t;
	    return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
    };

  	var derivativeCurveX = function(t){
	    var v = 1 - t;
	    return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (- t * t * t + 2 * v * t) * x2;
    };

  	return function(t){
    	var x = t, t0, t1, t2, x2, d2, i;

	    // First try a few iterations of Newton's method -- normally very fast.
	    for (t2 = x, i = 0; i < 8; i++){
	      x2 = curveX(t2) - x;
	      if (Math.abs(x2) < epsilon) return curveY(t2);
	      d2 = derivativeCurveX(t2);
	      if (Math.abs(d2) < 1e-6) break;
	      t2 = t2 - x2 / d2;
	    }

	    t0 = 0;
	    t1 = 1; 
	    t2 = x;

	    if (t2 < t0) return curveY(t0);
	    if (t2 > t1) return curveY(t1);
	    // Fallback to the bisection method for reliability.
	    while (t0 < t1){
	      x2 = curveX(t2);
	      if (Math.abs(x2 - x) < epsilon) return curveY(t2);
	      if (x > x2) t0 = t2;
	      else t1 = t2;
	      t2 = (t1 - t0) * 0.5 + t0;
	    }
	    // Failure
	    return curveY(t2);
    };
}
