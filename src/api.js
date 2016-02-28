Slider.prototype.goTo = function(direction) {
    if (direction === 'next') {
        this.goToNext();
    } else if (direction === 'previous') {
        this.goToPrevious();
    }
};
