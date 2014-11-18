//var classie = window.classie;
var isRetina = window.devicePixelRatio > 1;

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                      window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

var msPointerEnabled = !!navigator.pointerEnabled || navigator.msPointerEnabled;
var	isTouch = (!!('ontouchstart' in window) && navigator.userAgent.indexOf('PhantomJS') < 0) || msPointerEnabled;

var msEventType = function(type) {
			var lo = type.toLowerCase(),
				ms = 'MS' + type;
			return navigator.msPointerEnabled ? ms : lo;
		};

//from http://easings.net/
var easingObj = {
	easeInSine : [0.47, 0, 0.745, 0.715],
	easeOutSine : [0.39, 0.575, 0.565, 1],
	easeInOutSine : [0.445, 0.05, 0.55, 0.95],
	easeInQuad : [0.55, 0.085, 0.68, 0.53],
	easeOutQuad : [0.25, 0.46, 0.45, 0.94],
	easeInOutQuad : [0.455, 0.03, 0.515, 0.955],
	easeInCubic : [0.55, 0.055, 0.675, 0.19],
	easeOutCubic : [0.215, 0.61, 0.355, 1],
	easeInOutCubic : [0.645, 0.045, 0.355, 1],
	easeInQuart : [0.895, 0.03, 0.685, 0.22],
	easeOutQuart : [0.165, 0.84, 0.44, 1],
	easeInOutQuart : [0.77, 0, 0.175, 1],
	easeInQuint : [0.755, 0.05, 0.855, 0.06],
	easeOutQuint : [0.23, 1, 0.32, 1],
	easeInOutQuint : [0.86, 0, 0.07, 1],
	easeInExpo : [0.95, 0.05, 0.795, 0.035],
	easeOutExpo : [0.19, 1, 0.22, 1],
	easeInOutExpo : [1, 0, 0, 1],
	easeInCirc : [0.6, 0.04, 0.98, 0.335],
	easeOutCirc : [0.075, 0.82, 0.165, 1],
	easeInOutCirc : [0.785, 0.135, 0.15, 0.86],
	easeInBack : [0.6, -0.28, 0.735, 0.045],
	easeOutBack  : [0.175, 0.885, 0.32, 1.275],
	easeInOutBack  : [0.68, -0.55, 0.265, 1.55],
};

//Elba constructor
function Elba( el, settings ) {

	if(typeof el === 'undefined') {
		console.error('missing target');
		throw new Error();
	}

	//Declare an object holding the main parts of the gallery
	this.base = {
		el : el,
		container : null,
		slides : [],
		wrapper : null,
		count : 0,
		source : 0,
		navigation : {
			left : null,
			right : null,
			dots : null
		},
		//Init the pointer to the visible slide
		pointer : 0,
		//Hint for the direction to load
		directionHint : 'right',
		resizeTimout : null,
		animated : false
	};

	//Overwrite the default options
	this.options = extend( this.defaults, settings );


	this.touchHandler = {
		touchEvents : {
			touchStart: msEventType('PointerDown') + ' touchstart',
			touchEnd: msEventType('PointerUp') + ' touchend',
			touchMove: msEventType('PointerMove') + ' touchmove'
		}
	};
	