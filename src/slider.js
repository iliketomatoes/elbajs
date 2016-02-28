function Slider(el, GUID, settings) {

    this.el = el;
    this.settings = settings;
    this.slider = null;
    this.slidesLength = null;
    this.GUID = GUID;

    this.count = 0;
    this.source = 0;

    //Init the pointer to the visible slide
    this.pointer = 0;

    //Hint for the direction to load
    this.directionHint = 'right';
    this.resizeTimeout = null;
    this.animated = false;

    try {

        if (typeof el === 'undefined') {
            throw new Error('The first argument passed to the constructor is undefined');
        }

        this.build();

    } catch (err) {
        console.error(err.message);
    }
}

Slider.prototype.getSlider = function() {
    if(this.slider) return this.slider;
    return this.slider = this.el.querySelector('.elba-slider');
};

Slider.prototype.getSlides = function() {
    return this.el.querySelectorAll('.elba');
};

Slider.prototype.getSlidesLength = function() {
    if(this.slidesLength) return this.slidesLength;
    return this.getSlides().length;
};
