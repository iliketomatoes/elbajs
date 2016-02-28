function Slider(el, GUID, settings) {

    this.el = el;
    this.settings = settings;
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

        this.bindEvents();

    } catch (err) {
        console.error(err.message);
    }
}

Slider.prototype.getSlider = function() {
    return this.el.querySelector('.elba-slider');
};

Slider.prototype.getSlides = function() {
    return this.el.querySelectorAll('.elba');
};

Slider.prototype.getSlidesLength = function() {
    return this.getSlides().length;
};

Slider.prototype.next = function() {
    // TODO
};

Slider.prototype.previous = function() {
    // TODO
};
