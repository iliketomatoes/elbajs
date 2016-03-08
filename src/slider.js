var Slider = Object.create(Eventie);

Slider.init = function() {
    this.build();

    if (this.settings.navigation && this.slidesMap.length > 1) {
        this.setNavigation();
    }

    this.updateProxy();
 
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

/**
 * Get the container width, that is elba-viewport's width
 * @return {Number} expressed in px
 */
Slider.getViewportWidth = function() {
    if (this.proxy.viewportWidth) return this.proxy.viewportWidth;
    return this.proxy.viewportWidth = this.el.querySelector('.elba-viewport').clientWidth;
};

Slider.updateProxy = function() {
    this.proxy.viewportWidth = this.getViewportWidth();
    this.proxy.xCssTranslation = getXCssTranslatedPosition(this.getSlider());
};
