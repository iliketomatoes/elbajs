function animate(ele, target, direction) {
  
  if(animated){
  	return false;
  }

  animated = true;

  var start = new Date();
  var startingOffset =  intVal(ele.style.left);
  
  var deltaOffset = Math.abs(startingOffset - target);
  if(direction === 'right') deltaOffset = -deltaOffset; 

  var id = setInterval(function() {
    var timePassed = new Date() - start;
    var progress = timePassed / options.duration;

    if (progress > 1) progress = 1;
    
    var powerEaseOut = makeEaseOut(options.delta);
    var delta = powerEaseOut(progress);
    //var delta = options.delta(progress);
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
  }, options.delay || 25);
  
}


function step(ele, delta, startingOffset, deltaOffset){
	var actualOffset = startingOffset + (deltaOffset * delta);
	ele.style.left = actualOffset + 'px'; 
}


function linear(progress){
	return progress;
}

function power(progress, n) {
  return Math.pow(progress, n);
}

function squareRoot(progress){
	return Math.sqrt(progress);
}

function circ(progress) {
    return 1 - Math.sin(Math.acos(progress));
}

function back(progress, x) {
    return Math.pow(progress, 2) * ((x + 1) * progress - x);
}

function bounce(progress) {
  for(var a = 0, b = 1, result; 1; a += b, b /= 2) {
    if (progress >= (7 - 4 * a) / 11) {
      return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
    }
  }
}

function elastic(progress, x) {
  return Math.pow(2, 10 * (progress-1)) * Math.cos(20*Math.PI*x/3*progress);
}


function makeEaseOut(delta) {  
  return function(progress) {
    return 1 - delta(1 - progress);
  };
}

function makeEaseInOut(delta) {  
  return function(progress) {
    if (progress < 0.5)
      return delta(2*progress) / 2;
    else
      return (2 - delta(2*(1-progress))) / 2;
  };
}





