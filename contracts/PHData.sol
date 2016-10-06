import "Owned.sol";

contract PHData is Owned {
	
	Person[] public people;

	struct Person {

		bytes32 firstName;
		bytes32 lastName;
		uint age;

	}

	uint public count;

	event LogPersonAdded(bytes32 _firstName, bytes32 _lastName, uint _age);

	function PHData() {

	}


	function addPerson(bytes32 _firstName, bytes32 _lastName, uint _age) fromOwner returns (bool success) {

		Person memory newPerson;
		newPerson.firstName = _firstName;
		newPerson.lastName = _lastName;
		newPerson.age = _age;

		people.push(newPerson);
		count++;
		LogPersonAdded(_firstName, _lastName, _age);
		return true;

	}

	function getPeople() constant returns(bytes32[],bytes32[],uint[]) {

		uint length = people.length;

		bytes32[] memory firstNames = new bytes32[](length);
		bytes32[] memory lastNames = new bytes32[](length);
		uint[] memory ages = new uint[](length);

		for (uint i = 0; i < people.length; i++) {

			Person memory currentPerson;
			currentPerson = people[i];

			firstNames[i] = currentPerson.firstName;
			lastNames[i] = currentPerson.lastName;
			ages[i] = currentPerson.age;

		}

		return (firstNames,lastNames,ages);

	}
}