Elba.next = function(carouselId) {
    // If an ID is defined we get the single carousel.
    // Otherwise we move all the instances
    var carousel = this.getInstance(carouselId) || Instances;

    if (carousel instanceof Carousel) {
        //TODO, animate single carousel
        this.goToNext(carousel);
    } else {
        for (var instance in carousel) {
            //TODO, animate single carousel
            this.goToNext(carousel);
        }
    }
};

Elba.previous = function(carouselId) {
    // If an ID is defined we get the single carousel.
    // Otherwise we move all the instances
    var carousel = this.getInstance(carouselId) || Instances;

    if (carousel instanceof Carousel) {
        //TODO, animate single carousel
        this.goToPrevious(carousel);
    } else {
        for (var instance in carousel) {
            //TODO, animate single carousel
            this.goToPrevious(carousel);
        }
    }
};
