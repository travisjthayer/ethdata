// Found here https://gist.github.com/xavierlepretre/88682e871f4ad07be4534ae560692ee6
web3.eth.getTransactionReceiptMined = function (txnHash, interval) {
  var transactionReceiptAsync;
  interval = interval ? interval : 500;
  transactionReceiptAsync = function(txnHash, resolve, reject) {
    try {
      var receipt = web3.eth.getTransactionReceipt(txnHash);
      if (receipt == null) {
        setTimeout(function () {
          transactionReceiptAsync(txnHash, resolve, reject);
        }, interval);
      } else {
        resolve(receipt);
      }
    } catch(e) {
      reject(e);
    }
  };

  return new Promise(function (resolve, reject) {
      transactionReceiptAsync(txnHash, resolve, reject);
  });
};

// Found here https://gist.github.com/xavierlepretre/afab5a6ca65e0c52eaf902b50b807401
var getEventsPromise = function (myFilter, count) {
  return new Promise(function (resolve, reject) {
    count = count ? count : 1;
    var results = [];
    myFilter.watch(function (error, result) {
      if (error) {
        reject(error);
      } else {
        count--;
        results.push(result);
      }
      if (count <= 0) {
        resolve(results);
        myFilter.stopWatching();
      }
    });
  });
};

// Found here https://gist.github.com/xavierlepretre/d5583222fde52ddfbc58b7cfa0d2d0a9
var expectedExceptionPromise = function (action, gasToUse) {
  return new Promise(function (resolve, reject) {
      try {
        resolve(action());
      } catch(e) {
        reject(e);
      }
    })
    .then(function (txn) {
      return web3.eth.getTransactionReceiptMined(txn);
    })
    .then(function (receipt) {
      // We are in Geth
      assert.equal(receipt.gasUsed, gasToUse, "should have used all the gas");
    })
    .catch(function (e) {
      if ((e + "").indexOf("invalid JUMP") > -1) {
        // We are in TestRPC
      } else {
        throw e;
      }
    });
};

// Start of Tests

contract('PHData', function(accounts) {

	it("should start with empty list", function() {
	    var phdata = PHData.deployed();

	    return phdata.count()
	    	.then(function(count) {
	      	assert.equal(count.valueOf(), 0, "should start with empty list");
	    });
	});


	it("should not add a person if not owner", function() {
	    var phdata = PHData.deployed();

	    return expectedExceptionPromise(function () {
	    	return phdata.addPerson.call("Jane", "Doe", 33, {from: accounts[1] });
	    });
	});


	it("should be possible to add a person", function() {
	    var phdata = PHData.deployed();
	    var blockNumber;

	    return phdata.addPerson.call("Jane", "Doe", 33, { from: accounts[0] })
	    	.then(function(success) {
		      	assert.isTrue(success, "should be possible to add a person");
		      	blockNumber = web3.eth.blockNumber + 1;
		      	return phdata.addPerson("Jane", "Doe", 33, { from: accounts[0] });
		    })
		    .then(function(tx) {
	    		return Promise.all([
	    		getEventsPromise(phdata.LogPersonAdded(
	    			{},
	    			{ fromBlock: blockNumber, toBlock: "latest" })),
	    		web3.eth.getTransactionReceiptMined(tx)
    			]);
	  		})
	  		.then(function(eventAndReceipt) {
	  			// console.log(eventAndReceipt[0][0].args);
	  			var eventArgs = eventAndReceipt[0][0].args;
	  			assert.equal(eventArgs._firstName, "0x4a616e6500000000000000000000000000000000000000000000000000000000", "Should be the first name");
	  			assert.equal(eventArgs._lastName, "0x446f650000000000000000000000000000000000000000000000000000000000", "Should be the last name");
	  			assert.equal(eventArgs._age.valueOf(), 33, "Should be the age");
	  			return phdata.count();
	  		})
	  		.then(function(count) {
	      		assert.equal(count.valueOf(), 1, "should have added a person");
	  	});
	});




 });