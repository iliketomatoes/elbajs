var expect = chai.expect;
var gallery = document.getElementById("real-gallery");
var emptyGallery = new Elba(document.getElementById("empty-gallery"));

describe("Elba", function() {
  describe("constructor", function() {
 
  	it("should be ok if the gallery doesn't contain any slide", function() {
    	expect(emptyGallery.base.slides).to.be.a("Array");
    });

  	it("should throw an Error when you don't pass any argument to the constructor", function() {
    	expect(function(){ new Elba(); }).to.throw(Error);
    });
  });

});