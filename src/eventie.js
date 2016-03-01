var arrowClickHandler = function(e) {
    if (classie.hasClass(e.target, 'elba-right-nav')) {
        this.goTo('next');
    } else {
        this.goTo('previous');
    }
};

var sliderDragStartHandler = function(e) {
    // Assign a Slider instance to TargetInstance only
    // if it's not referencing another Slider Instance already.
    // This means that you can only drag one slider per time. 
    if(TargetInstance === null){
	   TargetInstance = Instances[this.GUID];
    }
};

var Eventie = Object.create(Imagie);

Eventie.initEvents = function() {
    // bind click on arrows
    if (this.settings.navigation) {
        this.setArrowsListener();
    }

    this.setSliderListener();
};

Eventie.setArrowsListener = function() {
    var _arrows = Utils.makeArray(this.getArrows());
    var i = 0;
    while(_arrows[i]){
    	_arrows[i].addEventListener('click', arrowClickHandler.bind(this));
    	i++;
    }
};

Eventie.setSliderListener = function() {
	var _slider = this.getSlider();
	Utils.setListener(_slider, Tocca.events.start, sliderDragStartHandler.bind(this));
};
