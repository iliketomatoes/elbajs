(function(window) {

    var Player = {
        amount: 5,
        test: function() {
            console.log(this);
            console.log(this.amount);
        },
        secondTest: function() {
            console.log(this);
            console.log(this.carousel);
        }
    };

    function Elba(element, options) {

        var _player = Object.create(Player, {
            carousel: {
                value: 'scherzo'
            }
        });

        var init = function() {
            _player.secondTest();
        };

        this.el = element;

        this.startPlayer = function() {
            console.log(this);
            _player.test();
        };

        init();
    }

    Elba.prototype.secondPlayer = function() {
        console.log(this.el);
    };

    window.Elba = Elba;

})(window);
