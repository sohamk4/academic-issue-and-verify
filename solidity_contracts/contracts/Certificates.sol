// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol"; // For cryptographic functions
import "./Studentregs.sol";
import "./Universityy.sol";

contract Certificates is ERC721URIStorage, Ownable,StudentRegistry {
    using ECDSA for bytes32; // Helper library for cryptographic functions

    struct Certificate {
        string studentName;
        address studentAddress; // Added
        address universityAddress; // Added
        string certificateType;
        string dateOfIssue;
        bytes32 studentPublicKey;
        bytes32 universityPublicKey;
        bytes signature;
        string issuedBy; // Added
        string eventName; // Added
        uint256 rank; // Added (only for ACHIEVEMENT certificates)
    }

    struct CertificateInfo {
        uint256 certificateId;
        string studentName;
        address studentAddress; // Added
        address universityAddress; // Added
        string certificateType;
        string dateOfIssue;
        bytes32 studentPublicKey;
        bytes32 universityPublicKey;
        string issuedBy; // Added
        string eventName; // Added
        uint256 rank; // Added
    }

    uint256 public certificateCounter;
    mapping(uint256 => Certificate) public certificates; 
    mapping(uint256 => uint256[]) public certificatesByYear; // Year -> Certificate IDs
    
    
    event CertificateIssued(uint256 indexed certificateId, bytes32 indexed universityPublicKey, bytes32 studentPublicKey);

    constructor() ERC721("UniversityCertificate", "UCERT") {}

    function issueCertificate(
        address user,
        address _studentAddress,
        string memory _studentName,
        string memory _certificateType,
        string memory _dateOfIssue,
        bytes32 _studentPublicKey,
        bytes32 _universityPublicKey,
        string memory _tokenURI,
        bytes memory _signature,
        bytes32 messageHash,
        string memory _issuedBy,
        string memory _eventName,
        uint256 _rank
    ) public returns (uint256) {
        certificateCounter++;
        uint256 certificateId = certificateCounter;
    
        // Recreate the message hash
        bytes32 ethHash = messageHash.toEthSignedMessageHash();
    
        // Verify the signature
        address signer = ethHash.recover(_signature);
        
        require(signer == user, "Invalid signature");
    
        // Extract the year from the date of issue
        uint256 year = extractYear(_dateOfIssue);
    
        // Create the certificate
        certificates[certificateId] = Certificate({
            studentName: _studentName,
            studentAddress: _studentAddress,
            universityAddress: user,
            certificateType: _certificateType,
            dateOfIssue: _dateOfIssue,
            studentPublicKey: _studentPublicKey,
            universityPublicKey: _universityPublicKey,
            signature: _signature,
            issuedBy: _issuedBy,
            eventName: _eventName,
            rank: _rank
        });
    
        _safeMint(_studentAddress, certificateId);
        _setTokenURI(certificateId, _tokenURI);
    
        universityCertificates[_universityPublicKey].push(certificateId);
        studentCertificates[_studentAddress].push(certificateId);
        certificatesByYear[year].push(certificateId);

        // Emit the CertificateIssued event
        emit CertificateIssued(certificateId, _universityPublicKey, _studentPublicKey);
        return certificateId;
    }


    function getCertificatesByUniversityAndYear(
        address _uniadd,
        uint256 _year
    ) public view returns (uint256[] memory) {
        // Get all certificate IDs for the specified year
        uint256[] memory certificateIdsForYear = certificatesByYear[_year];
    
        // Filter certificates issued by the specified university
        uint256[] memory universityCertificatesForYear = new uint256[](certificateIdsForYear.length);
        uint256 count = 0;
    
        for (uint256 i = 0; i < certificateIdsForYear.length; i++) {
            uint256 certificateId = certificateIdsForYear[i];
            Certificate memory certificate = certificates[certificateId];
    
            if (certificate.universityAddress == _uniadd) {
                universityCertificatesForYear[count] = certificateId;
                count++;
            }
        }
    
        // Resize the array to remove unused slots
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = universityCertificatesForYear[i];
        }
    
        return result;
    }

    function extractYear(string memory date) internal pure returns (uint256) {
        bytes memory dateBytes = bytes(date);
        require(dateBytes.length >= 4, "Invalid date format");
    
        // Extract the first 4 characters (YYYY)
        bytes memory yearBytes = new bytes(4);
        for (uint256 i = 0; i < 4; i++) {
            yearBytes[i] = dateBytes[i];
        }
    
        // Convert bytes to uint256
        uint256 year = 0;
        for (uint256 i = 0; i < 4; i++) {
            year = year * 10 + (uint256(uint8(yearBytes[i])) - 48); // Convert ASCII to number
        }
    
        return year;
    }

    function getCertificatesByYear(uint256 year) public view returns (CertificateInfo[] memory) {
        uint256[] memory certificateIds = certificatesByYear[year];
        CertificateInfo[] memory certificateDetails = new CertificateInfo[](certificateIds.length);
    
        for (uint256 i = 0; i < certificateIds.length; i++) {
            uint256 certificateId = certificateIds[i];
            Certificate memory cert = certificates[certificateId];
    
            certificateDetails[i] = CertificateInfo({
                certificateId: certificateId,
                studentName: cert.studentName,
                studentAddress: cert.studentAddress,
                universityAddress: cert.universityAddress,
                certificateType: cert.certificateType,
                dateOfIssue: cert.dateOfIssue,
                studentPublicKey: cert.studentPublicKey,
                universityPublicKey: cert.universityPublicKey,
                issuedBy: cert.issuedBy,
                eventName: cert.eventName,
                rank: cert.rank
            });
        }
    
        return certificateDetails;
    }

    function verifyCertificate(
        bytes memory _signature,
        bytes32 messageHash,
        uint256 _certificateId,
        address user
    ) public view returns (bool) {
        require(_exists(_certificateId), "Certificate does not exist");
        bytes32 ethHash = messageHash.toEthSignedMessageHash();
        address signer = ethHash.recover(_signature);
        return signer == user;
    }

    function getCertificateById(uint256 certificateId) public view returns (
        string memory studentName,
        address studentAddress, // Added
        address universityAddress, // Added
        string memory certificateType,
        string memory dateOfIssue,
        bytes32 studentPublicKey,
        bytes32 universityPublicKey,
        bytes memory signature,
        string memory issuedBy, // Added
        string memory eventName, // Added
        uint256 rank // Added
    ) {
        require(_exists(certificateId), "Certificate does not exist");
    
        Certificate memory cert = certificates[certificateId];
    
        return (
            cert.studentName,
            cert.studentAddress, // Added
            cert.universityAddress, // Added
            cert.certificateType,
            cert.dateOfIssue,
            cert.studentPublicKey,
            cert.universityPublicKey,
            cert.signature,
            cert.issuedBy, // Added
            cert.eventName, // Added
            cert.rank // Added
        );
    }


    function getCertificatesByStudent(address studentAddress) public view returns (CertificateInfo[] memory) {
        uint256[] memory certificateIds = studentCertificates[studentAddress];
        CertificateInfo[] memory certificateDetails = new CertificateInfo[](certificateIds.length);
    
        for (uint256 i = 0; i < certificateIds.length; i++) {
            uint256 certificateId = certificateIds[i];
            Certificate memory cert = certificates[certificateId];
    
            certificateDetails[i] = CertificateInfo({
                certificateId: certificateId,
                studentName: cert.studentName,
                studentAddress: cert.studentAddress, // Added
                universityAddress: cert.universityAddress, // Added
                certificateType: cert.certificateType,
                dateOfIssue: cert.dateOfIssue,
                studentPublicKey: cert.studentPublicKey,
                universityPublicKey: cert.universityPublicKey,
                issuedBy: cert.issuedBy, // Added
                eventName: cert.eventName, // Added
                rank: cert.rank // Added
            });
        }
    
        return certificateDetails;
    }

    function getTokenURIsByAddress(address user) public view returns (string[] memory) {
       uint256[] memory certificateIds = studentCertificates[user];
       string[] memory tokenURIs = new string[](certificateIds.length);
   
       for (uint256 i = 0; i < certificateIds.length; i++) {
           tokenURIs[i] = tokenURI(certificateIds[i]);
       }
   
       return tokenURIs;
    }

    function getCertificatesByUniversity(bytes32 _universityPublicKey) public view returns (CertificateInfo[] memory) {
        uint256[] memory certificateIds = universityCertificates[_universityPublicKey];
        CertificateInfo[] memory certificateDetails = new CertificateInfo[](certificateIds.length);
    
        for (uint256 i = 0; i < certificateIds.length; i++) {
            uint256 certificateId = certificateIds[i];
            Certificate memory cert = certificates[certificateId];
    
            certificateDetails[i] = CertificateInfo({
                certificateId: certificateId,
                studentName: cert.studentName,
                studentAddress: cert.studentAddress, // Added
                universityAddress: cert.universityAddress, // Added
                certificateType: cert.certificateType,
                dateOfIssue: cert.dateOfIssue,
                studentPublicKey: cert.studentPublicKey,
                universityPublicKey: cert.universityPublicKey,
                issuedBy: cert.issuedBy, // Added
                eventName: cert.eventName, // Added
                rank: cert.rank // Added
            });
        }
    
        return certificateDetails;
    }

}
