// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AgriChainFarmerReg {
    struct Farmer {
        uint256 farmerID;
        address farmerAddress;
        string name;
        string location;
        bool exists;
    }

    mapping(address => Farmer) public farmers;
    uint256 public nextFarmerID = 1;

    event FarmerRegistered(uint256 farmerID, address farmerAddress, string name, string location);

    function registerFarmer(string memory _name, string memory _location) public {
        require(!farmers[msg.sender].exists, "Farmer already registered");

        farmers[msg.sender] = Farmer(nextFarmerID, msg.sender, _name, _location, true);
        emit FarmerRegistered(nextFarmerID, msg.sender, _name, _location);
        
        nextFarmerID++;
    }

    function getFarmer(address _farmerAddress) public view returns (uint256, string memory, string memory) {
        require(farmers[_farmerAddress].exists, "Farmer not found");
        Farmer memory farmer = farmers[_farmerAddress];
        return (farmer.farmerID, farmer.name, farmer.location);
    }

    function verifyFarmer(address _farmerAddress) public view returns (bool) {
        return farmers[_farmerAddress].exists;
    }
}
