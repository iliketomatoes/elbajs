QUnit.test('Slider instance prototype inheritance', function(assert) {

   for(var i in Instances){
   		assert.equal(Slider.isPrototypeOf(Instances[i]), true, 'Slider to be prototype of every instance');
   		assert.equal(Builder.isPrototypeOf(Instances[i]), true, 'Builder to be prototype of every instance');
   		assert.equal(Imagie.isPrototypeOf(Instances[i]), true, 'Imagie to be prototype of every instance');
   		assert.equal(Eventie.isPrototypeOf(Instances[i]), true, 'Eventie to be prototype of every instance');
   		assert.equal(Player.isPrototypeOf(Instances[i]), true, 'Player to be prototype of every instance');
   		break;
   }
   
});