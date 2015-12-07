function Carousel(el) {
	this.el = el;
    this.slides = [];
    this.count = 0;
    this.source = 0;
    this.navigation = {
        left: null,
        right: null,
        dots: null
    };
    //Init the pointer to the visible slide
    this.pointer = 0;
    //Hint for the direction to load
    this.directionHint = 'right';
    this.resizeTimeout = null;
    this.animated = false;
}
