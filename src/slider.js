var Slider = Object.create(Eventie);

Slider.init = function() {
    this.build();

    this.count = this.getSlidesCount();
    this.containerWidth = this.getContainerWidth();

    if (this.settings.navigation && this.count > 1) {
        this.setNavigation();
    }
    console.log(this.slidesMap);
    
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

Slider.getSlidesCount = function() {
    if (this.count) return this.count;
    return this.count = this.getSlides().length;
};

/**
 * Get the container width, that is elba-viewport's width
 * @return {Number} expressed in px
 */
Slider.getContainerWidth = function() {
    if (this.containerWidth) return this.containerWidth;
    return this.containerWidth = this.el.querySelector('.elba-viewport').clientWidth;
};
