pragma solidity ^0.8.19;

contract HelloWorld {
    string private name;

    function setName(string memory newName) public {
        name = newName;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    // 🔥 Add this clear function
    function clearName() public {
        name = "";
    }
}
