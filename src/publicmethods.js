Elba.next = function(carouselId) {
    // If an ID is defined we get the single carousel.
    // Otherwise we animate all the instances
    var target = this.getInstance(carouselId) || Instances;

    if (target instanceof Carousel) {
        this.goToNext(target);
    } else {
        for (var i in target) {
            this.goToNext(target[i]);
        }
    }
};

Elba.previous = function(carouselId) {
    // If an ID is defined we get the single carousel.
    // Otherwise we animate all the instances
    var target = this.getInstance(carouselId) || Instances;

    if (target instanceof Carousel) {
        this.goToPrevious(target);
    } else {
        for (var i in target) {
            this.goToPrevious(target[i]);
        }
    }
};
