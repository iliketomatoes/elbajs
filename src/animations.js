function animate(ele, target, direction) {
  
  if(animated){
  	return false;
  }

  animated = true;

  var startingOffset =  intVal(ele.style.left);
  
  var deltaOffset = Math.abs(startingOffset - target);
  if(direction === 'right') deltaOffset = -deltaOffset;

  var duration = options.duration; // duration of animation in milliseconds.
  var epsilon = (1000 / 60 / duration) / 4;

  var easeing = bezier(0.19, 0.96, 0.87, 0.44, epsilon);

  var start = null, myReq;

  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

  var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

   function animationStep(timestamp) {
    console.log('request animation frame!!!');
      var progress;
      if (start === null) start = timestamp;

      var timePassed = (timestamp - start);
      progress = timePassed / duration;

      console.log('progress -> ' + progress);

      if (progress > 1) progress = 1;

      var delta = easeing(progress).toFixed(6);
        console.log('delta -> ' + delta);
        step(ele, delta, startingOffset, deltaOffset);

      if (progress == 1){
        progress = 1;
        if(count > 1){
          if(pointer === (count - 1)){
            pointer = 1;
            ele.style.left = intVal(getLeftOffset()) + 'px';
          }else if(pointer === 0){
            pointer = count - 2;
            ele.style.left = intVal(getLeftOffset()) + 'px';
          }
        }
         animated = false;
         start = null;
         window.cancelAnimationFrame(myReq);
      }else{
        requestAnimationFrame(animationStep);
      }

    }
                                
  if(requestAnimationFrame){

  

  myReq = requestAnimationFrame(animationStep);

  }else{
      var id = setInterval(function() {

      if (start === null) start = new Date();  

      var timePassed = new Date() - start;
      var progress = timePassed / duration;

      if (progress > 1) progress = 1;

      var delta = easeing(progress).toFixed(6);

      step(ele, delta, startingOffset, deltaOffset);
      
      if (progress == 1) {

        if(count > 1){
          if(pointer === (count - 1)){
            pointer = 1;
            ele.style.left = intVal(getLeftOffset()) + 'px';
          }else if(pointer === 0){
            pointer = count - 2;
            ele.style.left = intVal(getLeftOffset()) + 'px';
          }
        }
         clearInterval(id);
         animated = false;
      }
    },25);
  }                             

}


function step(ele, delta, startingOffset, deltaOffset){
	var actualOffset = startingOffset + (deltaOffset * delta);
  console.log(actualOffset);
	ele.style.left = Math.ceil(actualOffset) + 'px'; 
}

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
    t0 = 0, t1 = 1, t2 = x;
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







