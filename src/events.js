var sliderHandler = function(e) {
    if (e.type === 'swipeleft') {
        this.goTo('next');
    } else if(e.type === 'swiperight') {
        this.goTo('previous');
    } else {
        // this.drag(e);
        console.log('tap');
    }
};

var arrowHandler = function(e) {
    if (e.target) {
        console.log(e);
    }
};

Slider.prototype.bindEvents = function() {
    this.bindSliderEvents();
    if(this.settings.navigation) {
        this.bindArrowsEvents();
    }
};

Slider.prototype.bindSliderEvents = function() {
    var slidingLayer = this.getSlider();
    // document.addEventListener('tap', sliderHandler.bind(this));
    // document.addEventListener('swipeleft', sliderHandler.bind(this));
    // document.addEventListener('swiperight', sliderHandler.bind(this));
    // document.addEventListener('drag', sliderHandler.bind(this));
};

Slider.prototype.bindArrowsEvents = function() {
    var self = this;
    /*Utils.makeArray(this.el.querySelectorAll('.elba-arrow')).forEach(function(el) {
        el.addEventListener('tap', arrowHandler.bind(self));
    });*/
};

Slider.prototype.goTo = function(direction) {
    console.log(direction);
};

Slider.prototype.drag = function(e) {
    console.log(e);
};