function animate(ele, target, direction) {
  
  var start = new Date();
  var startingOffset =  intVal(ele.style.left);
  
  var deltaOffset = Math.abs(startingOffset - target);
  if(direction === 'right') deltaOffset = -deltaOffset; 

  var id = setInterval(function() {
    var timePassed = new Date() - start;
    var progress = timePassed / options.duration;

    if (progress > 1) progress = 1;
    
    var delta = options.delta(progress);
    step(ele, delta, startingOffset, deltaOffset);
    
    if (progress == 1) {
      clearInterval(id);
    }
  }, options.delay || 10);
  
}


function step(ele, delta, startingOffset, deltaOffset){
	var actualOffset = startingOffset + (deltaOffset * delta);
	console.log('actualOffset -> '+actualOffset);
	ele.style.left = actualOffset + 'px'; 
}


function linear(progress){
	return progress;
}

function power(progress, n) {
  return Math.pow(progress, n);
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
  }
}

function makeEaseInOut(delta) {  
  return function(progress) {
    if (progress < 0.5)
      return delta(2*progress) / 2;
    else
      return (2 - delta(2*(1-progress))) / 2;
  }
}





