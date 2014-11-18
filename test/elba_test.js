var expect = chai.expect;
var target = document.getElementById("fake-gallery");

describe("Elba", function() {
  describe("constructor", function() {
    it("should have a target", function() {
      console.log(target);
      var elba = new Elba(target);
      expect(elba.base).to.be.a("object");
    });

    /*it("should have a pointer", function() {
      var pointer = new Elba(target).getCurrent();
      expect(pointer).to.be.a("number");
    });*/
  });

 /*describe("#greets", function() {
    it("should throw if no target is passed in", function() {
      expect(function() {
        (new Cow()).greets();
      }).to.throw(Error);
    });

    it("should greet passed target", function() {
      var greetings = (new Cow("Kate")).greets("Baby");
      expect(greetings).to.equal("Kate greets Baby");
    });
  });*/
});