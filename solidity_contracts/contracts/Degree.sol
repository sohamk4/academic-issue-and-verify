// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol"; // For cryptographic functions
import "./Certificates.sol";

contract Degrees is ERC721URIStorage, Ownable,Certificates{
    using ECDSA for bytes32; // Helper library for cryptographic functions

    struct Degree {
        string studentName;
        address studentAddress; // Added
        address universityAddress; // Added
        string specialization;
        string dateOfIssue;
        bytes32 studentPublicKey;
        bytes32 universityPublicKey;
        bytes signature;
        string issuedBy; // Added
    }

    struct DegreeInfo {
        uint256 degreeId;
        string studentName;
        address studentAddress; // Added
        address universityAddress; // Added
        string specialization;
        string dateOfIssue;
        bytes32 studentPublicKey;
        bytes32 universityPublicKey;
        string issuedBy; // Added
    }

    mapping(uint256 => Degree) public degres; 
    mapping(uint256 => uint256[]) public degreesByYear; // Year -> Certificate IDs
    
    
    event DegreeIssued(uint256 indexed degreeId, bytes32 indexed universityPublicKey, bytes32 studentPublicKey);

    function issueCertificate(
        address user,
        address _studentAddress,
        string memory _studentName,
        string memory _specialization,
        string memory _dateOfIssue,
        bytes32 _studentPublicKey,
        bytes32 _universityPublicKey,
        string memory _tokenURI,
        bytes memory _signature,
        bytes32 messageHash,
        string memory _issuedBy
    ) public returns (uint256) {
        certificateCounter++;
        uint256 degreeId = certificateCounter;
    
        // Recreate the message hash
        bytes32 ethHash = messageHash.toEthSignedMessageHash();
    
        // Verify the signature
        address signer = ethHash.recover(_signature);
        
        require(signer == user, "Invalid signature");
    
        // Extract the year from the date of issue
        uint256 year = extractYear(_dateOfIssue);
    
        // Create the degree
        degres[degreeId] = Degree({
            studentName: _studentName,
            studentAddress: _studentAddress,
            universityAddress: user,
            specialization: _specialization,
            dateOfIssue: _dateOfIssue,
            studentPublicKey: _studentPublicKey,
            universityPublicKey: _universityPublicKey,
            signature: _signature,
            issuedBy: _issuedBy
        });
    
        _safeMint(_studentAddress, degreeId);
        _setTokenURI(degreeId, _tokenURI);
    
        universityDegree[_universityPublicKey].push(degreeId);
        studentDegree[_studentAddress].push(degreeId);
        degreesByYear[year].push(degreeId);

        // Emit the CertificateIssued event
        emit DegreeIssued(degreeId, _universityPublicKey, _studentPublicKey);
        return degreeId;
    }


    function getDegreeByUniversityAndYear(
        address _uniadd,
        uint256 _year
    ) public view returns (uint256[] memory) {
        // Get all degree IDs for the specified year
        uint256[] memory degreeIdsForYear = degreesByYear[_year];
    
        // Filter degrees issued by the specified university
        uint256[] memory universityDegreeForYear = new uint256[](degreeIdsForYear.length);
        uint256 count = 0;
    
        for (uint256 i = 0; i < degreeIdsForYear.length; i++) {
            uint256 degreeId = degreeIdsForYear[i];
            Degree memory degree = degres[degreeId];
    
            if (degree.universityAddress == _uniadd) {
                universityDegreeForYear[count] = degreeId;
                count++;
            }
        }
    
        // Resize the array to remove unused slots
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = universityDegreeForYear[i];
        }
    
        return result;
    }

    function getDegreesByYear(uint256 year) public view returns (DegreeInfo[] memory) {
        uint256[] memory degreeIds = degreesByYear[year];
        DegreeInfo[] memory degreeDetails = new DegreeInfo[](degreeIds.length);
    
        for (uint256 i = 0; i < degreeIds.length; i++) {
            uint256 degreeId = degreeIds[i];
            Degree memory cert = degres[degreeId];
    
            degreeDetails[i] = DegreeInfo({
                degreeId: degreeId,
                studentName: cert.studentName,
                studentAddress: cert.studentAddress,
                universityAddress: cert.universityAddress,
                specialization: cert.specialization,
                dateOfIssue: cert.dateOfIssue,
                studentPublicKey: cert.studentPublicKey,
                universityPublicKey: cert.universityPublicKey,
                issuedBy: cert.issuedBy
            });
        }
    
        return degreeDetails;
    }

    function verifyDegree(
        bytes memory _signature,
        bytes32 messageHash,
        uint256 _degreeId,
        address user
    ) public view returns (bool) {
        require(_exists(_degreeId), "Certificate does not exist");
        bytes32 ethHash = messageHash.toEthSignedMessageHash();
        address signer = ethHash.recover(_signature);
        return signer == user;
    }

    function getDegreeById(uint256 degreeId) public view returns (
        string memory studentName,
        address studentAddress, // Added
        address universityAddress, // Added
        string memory specialization,
        string memory dateOfIssue,
        bytes32 studentPublicKey,
        bytes32 universityPublicKey,
        bytes memory signature,
        string memory issuedBys
    ) {
        require(_exists(degreeId), "Certificate does not exist");
    
        Degree memory cert = degres[degreeId];
    
        return (
            cert.studentName,
            cert.studentAddress, // Added
            cert.universityAddress, // Added
            cert.specialization,
            cert.dateOfIssue,
            cert.studentPublicKey,
            cert.universityPublicKey,
            cert.signature,
            cert.issuedBy
        );
    }


    function getDegreeByStudent(address studentAddress) public view returns (DegreeInfo[] memory) {
        uint256[] memory degreeIds = studentDegree[studentAddress];
        DegreeInfo[] memory degreeDetails = new DegreeInfo[](degreeIds.length);
    
        for (uint256 i = 0; i < degreeIds.length; i++) {
            uint256 degreeId = degreeIds[i];
            Degree memory cert = degres[degreeId];
    
            degreeDetails[i] = DegreeInfo({
                degreeId: degreeId,
                studentName: cert.studentName,
                studentAddress: cert.studentAddress,
                universityAddress: cert.universityAddress,
                specialization: cert.specialization,
                dateOfIssue: cert.dateOfIssue,
                studentPublicKey: cert.studentPublicKey,
                universityPublicKey: cert.universityPublicKey,
                issuedBy: cert.issuedBy
            });
        }
    
        return degreeDetails;
    }

    function getdegreeTokenURIsByAddress(address user) public view returns (string[] memory) {
       uint256[] memory degreeIds = studentDegree[user];
       string[] memory tokenURIs = new string[](degreeIds.length);
   
       for (uint256 i = 0; i < degreeIds.length; i++) {
           tokenURIs[i] = tokenURI(degreeIds[i]);
       }
   
       return tokenURIs;
    }

    function getDegreesByUniversity(bytes32 _universityPublicKey) public view returns (DegreeInfo[] memory) {
        uint256[] memory degreeIds = universityDegree[_universityPublicKey];
        DegreeInfo[] memory degreeDetails = new DegreeInfo[](degreeIds.length);
    
        for (uint256 i = 0; i < degreeIds.length; i++) {
            uint256 degreeId = degreeIds[i];
            Degree memory cert = degres[degreeId];
    
            degreeDetails[i] = DegreeInfo({
                degreeId: degreeId,
                studentName: cert.studentName,
                studentAddress: cert.studentAddress,
                universityAddress: cert.universityAddress,
                specialization: cert.specialization,
                dateOfIssue: cert.dateOfIssue,
                studentPublicKey: cert.studentPublicKey,
                universityPublicKey: cert.universityPublicKey,
                issuedBy: cert.issuedBy
            });
        }
    
        return degreeDetails;
    }

}
