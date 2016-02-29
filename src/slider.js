var Slider = Object.create(Eventie);

Slider.slider = null;
Slider.slidesLength = null;
Slider.count = 0;
Slider.source = 0;

//Init the pointer to the visible slide
Slider.pointer = 0;

//Hint for the direction to load
Slider.directionHint = 'right';
Slider.resizeTimeout = null;
Slider.isSettled = true;

Slider.init = function() {
    this.build();
    this.initEvents();
};

Slider.getSlider = function() {
    if (this.slider) return this.slider;
    return this.slider = this.el.querySelector('.elba-slider');
};

Slider.getSlides = function() {
    return this.el.querySelectorAll('.elba');
};

Slider.getArrows = function() {
    return this.el.querySelectorAll('.elba-arrow');
};

Slider.getSlidesLength = function() {
    if (this.slidesLength) return this.slidesLength;
    return this.slidesLength = this.getSlides().length;
};
