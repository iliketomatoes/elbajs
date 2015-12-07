Elba.next = function(carouselId) {
    // If an ID is defined we get the single carousel.
    // Otherwise we move all the instances
    var target = this.getInstance(carouselId) || Instances;

    if (target instanceof Carousel) {
        //TODO, animate single carousel
        this.goToNext(target);
    } else {
        for (var i in target) {
            //TODO, animate single carousel
            this.goToNext(target[i]);
        }
    }
};

Elba.previous = function(carouselId) {
    // If an ID is defined we get the single carousel.
    // Otherwise we move all the instances
    var target = this.getInstance(carouselId) || Instances;

    if (target instanceof Carousel) {
        //TODO, animate single carousel
        this.goToPrevious(target);
    } else {
        for (var i in target) {
            //TODO, animate single carousel
            this.goToPrevious(target[i]);
        }
    }
};
