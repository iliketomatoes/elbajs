var EventHandler = Object.create(ElbaBuilder);

EventHandler.bindEvents = function() {

    for (var i in Instances) {
        if (Instances.hasOwnProperty(i)) {

            var carousel = Instances[i];

            if (carousel.settings.navigation) {

                this.addNavigationEvents(carousel);

            }

        }
    }

};

EventHandler.addNavigationEvents = function(carousel) {
    carousel.navigation.left.addEventListener('click', function(e) {
        Elba.previous(carousel.GUID);
    }, false);

    carousel.navigation.right.addEventListener('click', function(e) {
        Elba.next(carousel.GUID);
    }, false);
};
