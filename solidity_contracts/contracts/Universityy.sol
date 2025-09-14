// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol"; // For cryptographic functions

contract UniversityRegistryy{
    using ECDSA for bytes32; // Helper library for cryptographic functions

    struct Location {
        string country;
        string state;
        string city;
        string pincode;
    }

    struct University {
        address universityAddress;
        string name;
        Location location;
        string studentDomain;
        bytes32 publicKey;
        bool res;
    }

    mapping(address => University) public universities;
    address[] public universityPublicKeys;
    mapping(address => uint256) public studentApprovalIds;
    mapping(address => address[]) public universityStudentList; // University address -> List of student addresses
    mapping(bytes32 => uint256[]) public universityCertificates; // University public key -> certificate IDs
    mapping(bytes32 => uint256[]) public universityDegree; // University public key -> certificate IDs


    event UniversityRegistered(bytes32 indexed publicKey, address indexed universityAddress, string name);
    event StudentApproved(address indexed studentAddress,uint256 approvalId,bool registered);


    function registerUniversity(
        address user,
        string memory _name,
        string memory _country,
        string memory _state,
        string memory _city,
        string memory _pincode,
        string memory _studentDomain,
        bytes32 _publicKey
    ) public {
        require(universities[user].universityAddress == address(0), "University already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_name).length <= 100, "Name is too long");
    
    
        universities[user] = University({
            universityAddress: user,
            name: _name,
            location: Location(_country, _state, _city, _pincode),
            studentDomain: _studentDomain,
            publicKey: _publicKey,
            res:true
        });
    
        universityPublicKeys.push(user);
        emit UniversityRegistered(_publicKey, user, _name);
    }

    function getUniversityByAdd(address user) public view returns (
        address universityAddress,
        string memory name,
        string memory country,
        string memory state,
        string memory city,
        string memory pincode,
        string memory studentDomain
    ) {
        University memory university = universities[user];
        require(university.universityAddress != address(0), "University not found");

        return (
            university.universityAddress,
            university.name,
            university.location.country,
            university.location.state,
            university.location.city,
            university.location.pincode,
            university.studentDomain
        );
    }

    function getUniversityNameByAdd(address user) public view returns (
        string memory name
    ) {
        University memory university = universities[user];
        require(university.universityAddress != address(0), "University not found");
        return university.name;
    }

    function getAllUniversityAddrs() public view returns (address[] memory) {
        return universityPublicKeys;
    }


}