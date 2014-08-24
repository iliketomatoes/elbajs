 $.fn.elba = function (options) {
        return this.each(function () {
            if ($(this).data("elba-init") === true) {
                return false;
            }
            $(this).data("elba-init", true);
            var carousel = Object.create(Elba);
            carousel.init(options, this);
        });
    };

    $.fn.elba.options = {

    };