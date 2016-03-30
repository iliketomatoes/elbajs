var Slider = Object.create(Eventie);

Slider.init = function() {
    this.build();

    if (this.settings.navigation && this.slidesMap.length > 1) {
        this.setNavigation();
    }

    this.slider = this.el.querySelector('.elba-slider');

    this.updateProxy();

    this.initEvents();
};

Slider.getSlides = function() {
    return this.el.querySelectorAll('.elba');
};

Slider.getArrows = function() {
    return this.el.querySelectorAll('.elba-arrow');
};

Slider.updateProxy = function() {
    this.proxy.viewportWidth = this.getViewportWidth();
    this.proxy.xCssTranslation = getCssTranslationX(this.slider);
};

Slider.getCellDenormalizedOffset = function(index) {
    var normalizedSummation = 0;
    for (var i = 0; i < index; i++) {
        if (this.slidesMap[i]) normalizedSummation += this.slidesMap[i].normalizedWidth;
    }
    return (normalizedSummation * this.proxy.viewportWidth);
};
