return {
    init: function(el, settings) {
        var newInstance = Object.create(Elba);
        return newInstance.init(el, settings);
    }
};
});
