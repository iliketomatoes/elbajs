var Elba = Object.create(Toucher);

Elba.getInstance = function(id) {
    return Instances[id];
};

Elba.init = function(elements, settings) {

    if (typeof elements === 'undefined') {
        throw new Error();
    }

    var htmlArray = Utils.makeArray(elements);

    for (var i = 0; i < htmlArray.length; i++) {
        GUID++;
        var carousel = new Carousel(htmlArray[i], settings);
        htmlArray[i].setAttribute('data-elba-id', GUID);
        Instances[GUID] = carousel;
        carousel.GUID = GUID;
        // Call method inherited from ElbaBuilder
        this.build(carousel);
    }
    
    // Call method inherited from EventHandler
    this.bindEvents();
    return this;
};
