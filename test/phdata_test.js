contract('PHData', function(accounts) {


  it("should start with empty list", function() {
    var phdata = PHData.deployed();

    return phdata.count()
    	.then(function(count) {
      assert.equal(count.valueOf(), 0, "should start with empty list");
    });
  });

  it("should be possible to add a person", function() {
    var phdata = PHData.deployed();

    return phdata.addPerson.call("Jane", "Doe", 33)
    	.then(function(success) {
      assert.isTrue(success, "should be possible to add a person");
    });
  });


 });