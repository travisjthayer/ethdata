var app = angular.module('phdataApp', []);

app.config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
});

app.controller("phdataController", [ '$scope', '$location', '$http', '$q', '$window', '$timeout', function($scope , $location, $http, $q, $window, $timeout) {
    // Everything else will come in here.

    $scope.accounts = [];
    $scope.account = "";
    $scope.balance = "";

    $window.onload = function () {
        web3.eth.getAccounts(function(err, accs) {
            if (err != null) {
		      alert("There was an error fetching your accounts.");
		      return;
		    }

		    if (accs.length == 0) {
		      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
		      return;
		    }

            $scope.accounts = accs;
            $scope.account = $scope.accounts[0];
            // $scope.refreshBalance();
        });
    }

    $scope.addPerson = function(firstName, lastName, age) {

		  var phdata = PHData.deployed();

		  setStatus("Adding Person... (please wait)");

		  phdata.addPerson(firstName, lastName, age, {from: $scope.account}).then(function() {
		    setStatus("Person Added!");
		  }).catch(function(e) {
		    console.log(e);
		    setStatus("Error adding person; see log.");
  		});
	}




	;


}]);