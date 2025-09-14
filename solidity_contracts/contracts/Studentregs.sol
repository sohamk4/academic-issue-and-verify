// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol"; // For cryptographic functions
import "./Universityy.sol";


contract StudentRegistry is UniversityRegistryy{
    using ECDSA for bytes32; // Helper library for cryptographic functions

    struct Student {
        address studentPublicKey;
        string name;
        string course;
        uint16 yearOfJoining;
        uint16 yearOfPassing;
        bool registered;
    }

    mapping(address => Student) public students;     
    mapping(address => uint256[]) public studentCertificates;
    mapping(address => uint256[]) public studentDegree;
    mapping(address => mapping(address => Student)) public universityStudents;

    event StudentRegistered(address studentPublicKey, string name,string course,uint256 approvalId);

    function registerStudent(
        address user,
        address univadd,
        bytes32 _publicKey,
        string memory _name,
        string memory _course,
        uint16 _yearOfJoining,
        uint16 _yearOfPassing
    ) public {
        require(universities[univadd].res, "University not found");
        students[user] = Student(user, _name, _course, _yearOfJoining, _yearOfPassing, false);
        universityStudents[univadd][user] = Student(user, _name, _course, _yearOfJoining, _yearOfPassing, false);
    
        universityStudentList[univadd].push(user);
    
        bytes32 hash = keccak256(abi.encodePacked(user, block.timestamp, _publicKey));

        uint approvalId = uint256(hash) % (10 ** 18); // Convert to uint

        studentApprovalIds[user] = approvalId;

        emit StudentRegistered(user, _name, _course, approvalId);
    }

    function isregister(address user) public view returns(bool){
        require(students[user].studentPublicKey != address(0), "University not found");
        return (students[user].registered);
    }

    function getAllStudentsInUniversity(address _universityAddress) public view returns (Student[] memory) {
        // Ensure the university is registered
        require(universities[_universityAddress].universityAddress != address(0), "University not found");
    
        // Get the list of student addresses for the university
        address[] memory studentAddresses = universityStudentList[_universityAddress];
    
        // Count the number of registered students
        uint256 registeredCount = 0;
        for (uint256 i = 0; i < studentAddresses.length; i++) {
            if (students[studentAddresses[i]].registered) {
                registeredCount++;
            }
        }
    
        // Create an array to store the registered students
        Student[] memory registeredStudents = new Student[](registeredCount);
        uint256 index = 0;
    
        // Populate the array with registered student details
        for (uint256 i = 0; i < studentAddresses.length; i++) {
            if (students[studentAddresses[i]].registered) {
                registeredStudents[index] = students[studentAddresses[i]];
                index++;
            }
        }
    
        return registeredStudents;
    }

    function getStudent(address user) public view returns (Student memory) {
        return students[user];
    }

    function getStudentuni(address _university, address _student) public view returns (address) {
        Student memory student = universityStudents[_university][_student];
        return student.studentPublicKey;
    }


    function getApprovalId(address user) public view returns (uint256) {
        return studentApprovalIds[user];
    }

    function approveStudentRegistration(address studentAddress, uint256 approvalId, address univadd) public {
        // Ensure the caller is a registered university
        require(universities[univadd].res, "Caller is not a registered university");
    
        // Ensure the approval ID matches
        require(studentApprovalIds[studentAddress] == approvalId, "Invalid approval ID");
    
        // Ensure the student is not already approved
        require(!students[studentAddress].registered, "Student is already registered");
    
        // Approve the student
        students[studentAddress].registered = true;
        universityStudents[univadd][studentAddress].registered = true;
    
        // Emit the approval event
        emit StudentApproved(studentAddress, approvalId, true);
    }

    function getNotRegisteredStudents(address _universityAddress) public view returns (address[] memory) {
        require(universities[_universityAddress].universityAddress != address(0), "University not found");
    
        address[] memory studentAddresses = universityStudentList[_universityAddress];
    
        address[] memory notRegisteredStudents = new address[](studentAddresses.length);
        uint256 count = 0;
    
        for (uint256 i = 0; i < studentAddresses.length; i++) {
            address studentAddress = studentAddresses[i];
    
            if (!students[studentAddress].registered) {
                notRegisteredStudents[count] = studentAddress;
                count++;
            }
        }
    
        address[] memory result = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = notRegisteredStudents[i];
        }
    
        return result;
    }
}