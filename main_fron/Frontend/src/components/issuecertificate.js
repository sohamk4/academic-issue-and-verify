import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Web3Context } from "../context/Web3Context"; // Import Web3Context
import CryptoJS from "crypto-js";
import axios from "axios";
import Papa from "papaparse";
import { ethers } from "ethers"; 
import CertificateEditor from "./Modal";


const PageContainer = styled(motion.section)`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 6rem 2rem 2rem;
  background: linear-gradient(135deg, #f9f9f9, #e0eafc);
  overflow-y: auto;
  width: 100%;
`;

const Navbar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #0b193f;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const MenuIcon = styled.div`
  font-size: 2rem;
  cursor: pointer;
  z-index: 1100;
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: 100vh;
  background: #f9f9f9;
  padding-top: 60px;
  transition: transform 0.3s ease-in-out;
  transform: ${({ isopen }) => (isopen ? "translateX(0)" : "translateX(-100%)")};
  box-shadow: ${({ isopen }) => (isopen ? "5px 0px 15px rgba(0, 0, 0, 0.2)" : "none")};
`;

const SidebarItem = styled.div`
  padding: 1rem;
  color: #0b193f;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #1e3a5f;
    color: #f9f9f9;
  }
`;

const Section = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  margin-bottom: 1rem;
`;

const Header = styled(motion.h1)`
  color: #0b193f;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const SubHeader = styled.h2`
  color: #1e3a5f;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const TextField = styled(motion.input)`
  width: 100%;
  padding: 1rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1.2rem;
  transition: 0.3s;
  &:focus {
    border-color: #0b193f;
    box-shadow: 0px 4px 10px rgba(11, 25, 63, 0.2);
  }
`;

const SelectField = styled(TextField).attrs({ as: "select" })``;

const Button = styled(motion.button)`
  background: #0b193f;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: #1e3a5f;
    transform: scale(1.05);
  }
`;


const IssueCertificate = () => {
  const { web3, contracts, account, isLoading } = useContext(Web3Context);
  const [isopen, setisopen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { privateKey, loginPassword, walletAddress } = location.state || {};  
  const [certificateType, setCertificateType] = useState("");
  const [eventName, setEventName] = useState("");
  const [rank, setRank] = useState("");
  const [dateOfIssue, setDateOfIssue] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentPublicKey, setStudentPublicKey] = useState("");
  const [universityAddress, setUniversityAddress] = useState("");
  const [PK, setPK] = useState("");
  const [LP, setLP] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [showWindow, setShowWindow] = useState(false);
  const [certificateImageUrl, setCertificateImageUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 

  useEffect(() => {
    if (isLoading) {
      console.log("Loading contractss...");
      return;
    }

    if (!contracts || !account) {
      console.error("contractss or account not loaded.");
    }
  }, [contracts, account, isLoading]);

  useEffect(() => { 
    if (walletAddress) {
      setUniversityAddress(walletAddress);
      setPK(privateKey);
      setLP(loginPassword);
    }
  }, [walletAddress, privateKey, loginPassword]);
  

  const uploadMetadataToIPFS = async (metadata) => {
    try {
      const data = JSON.stringify(metadata);

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: "edf95dc84bf60d28035e",
            pinata_secret_api_key: "b4afebb03d45295ad3790df26b73cbe2cc047c4d7754426af251c6dd5abcc4d9",
          },
        }
      );

      const ipfsHash = response.data.IpfsHash;
      const tokenURI = `https://ipfs.io/ipfs/${ipfsHash}`;
      return tokenURI;
    } catch (error) {
      console.error("Error uploading metadata to IPFS:", error);
      throw error;
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const handleIssueCertificatescsv = async () => {
    if (!csvFile) {
      alert("Please upload a CSV file.");
      return;
    }

    setLoading(true);
    setError("");

    // Parse the CSV file
    Papa.parse(csvFile, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const students = results.data; // Array of student objects
        console.log("Parsed Students:", students);

        if (students.length === 0) {
          alert("The CSV file is empty or invalid.");
          setLoading(false);
          return;
        }

        try {
          const issueb = await contracts.methods
            .getUniversityNameByAdd(universityAddress)
            .call({ from: account });

          for (const student of students) {
            await issueCertificateForStudentcsv(student, issueb);
          }

          alert("Certificates issued successfully for all students!");
        } catch (err) {
          console.error("Error issuing certificates:", err);
          setError("Failed to issue certificates. Check the console for details.");
        } finally {
          setLoading(false);
        }
      },
      error: (err) => {
        console.error("Error parsing CSV file:", err);
        setError("Failed to parse CSV file. Check the console for details.");
        setLoading(false);
      },
    });
  };

  const issueCertificateForStudentcsv = async (student, issueb) => {
    const { studentName, certificateType, dateOfIssue, eventName, rank, studentPublicKey } = student;

    // Validate student data
    if (!studentName || !certificateType || !dateOfIssue || !studentPublicKey) {
      console.error("Missing data for student:", student);
      return;
    }

    if (!contracts || !account) {
      console.error("Contract or account not loaded.");
      return;
    }

    try {
      // Get the university's private key from local storage
      const encryptedPrivateKey = localStorage.getItem("universityPrivateKey");
      const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, loginPassword);
      const privateKey = bytes.toString(CryptoJS.enc.Utf8);

      if (!privateKey) {
        alert("Invalid password. Please log in again.");
        return;
      }

      // Format the date
      const formattedDate = new Date(dateOfIssue).toISOString().split("T")[0];

      // Hash the public keys
      const studentPublicKeyHash = web3.utils.keccak256(studentPublicKey);
      const publicKeyHash = web3.utils.keccak256(walletAddress);

      // Prepare metadata
      const metadata = {
        name: `${studentName}'s Certificate`,
        description: `This is a ${certificateType.toUpperCase()} certificate issued to ${studentName}.`,
        image: "https://example.com/certificate-image.png",
        attributes: [
          { trait_type: "Student Name", value: studentName },
          { trait_type: "Certificate Type", value: certificateType.toUpperCase() },
          { trait_type: "Date of Issue", value: formattedDate },
          { trait_type: "Student Public Key", value: studentPublicKeyHash },
          { trait_type: "University Public Key", value: publicKeyHash },
        ],
      };

      // Upload metadata to IPFS
      const tokenURI = await uploadMetadataToIPFS(metadata);
      console.log("IPFS Token URI:", tokenURI);

      // Create a Solidity-compatible message hash
      const messageHash = ethers.solidityPackedKeccak256(
        ["string", "string", "string", "bytes32", "bytes32"],
        [studentName, certificateType.toUpperCase(), formattedDate, studentPublicKeyHash, publicKeyHash]
      );

      // Sign the message hash
      const wallet = new ethers.Wallet(privateKey);
      const sig = await wallet.signMessage(ethers.getBytes(messageHash));

      // Prepare parameters for issueCertificate
      const certificateTypeString = certificateType.toLowerCase();
      const rankValue = certificateTypeString === "achievement" ? parseInt(rank) : 0;

      // Call the issueCertificate function
      const result = await contracts.methods
        .issueCertificate(
          universityAddress, // University address
          studentPublicKey, // Student address
          studentName,
          certificateTypeString, // Certificate type as string
          formattedDate,
          studentPublicKeyHash, // bytes32
          publicKeyHash, // bytes32
          tokenURI,
          sig, // bytes
          messageHash, // bytes32
          issueb,
          eventName,
          rankValue // uint256
        ).send({ from: account });

      console.log("Certificate issued successfully! Transaction:", result);
    } catch (error) {
      console.error("Error issuing certificate:", error);
      throw error; // Propagate the error to handle it in the parent function
    }
  };

  const handleIssueCertificate = async () => {
    if (!contracts || !account) {
      console.error("Contract or account not loaded.");
      return;
    }

    try {
      // Convert date format
      const issueby = await contracts.methods
        .getUniversityNameByAdd(universityAddress)
        .call({ from: account });

      const formattedDate = new Date(dateOfIssue).toISOString().split("T")[0];

      // Get private key from localStorage
      const encryptedPrivateKey = localStorage.getItem("universityPrivateKey");
      const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, LP);
      const privateKey = bytes.toString(CryptoJS.enc.Utf8);
      if (!privateKey) throw new Error("Decryption failed!");

      // Compute hashes
      const studentPublicKeyHash = web3.utils.keccak256(studentPublicKey);
      const publicKeyHash = web3.utils.keccak256(universityAddress);

      const imageUrl = certificateImageUrl || "NONE";

      // Metadata for NFT
      const metadata = {
        name: `${studentName}'s Certificate`,
        description: `This is a ${certificateType.toUpperCase()} certificate issued to ${studentName}.`,
        image: imageUrl,
        attributes: [
          { trait_type: "Student Name", value: studentName },
          { trait_type: "Certificate Type", value: certificateType.toUpperCase() },
          { trait_type: "Date of Issue", value: formattedDate },
          { trait_type: "Student Public Key", value: studentPublicKeyHash },
          { trait_type: "University Public Key", value: publicKeyHash },
        ],
      };

      // Upload metadata to IPFS
      const tokenURI = await uploadMetadataToIPFS(metadata);
      console.log("IPFS Token URI:", tokenURI);
      console.log(issueby);

      // Create a Solidity-compatible message hash
      const messageHash = ethers.solidityPackedKeccak256(
        ["string", "string", "string", "bytes32", "bytes32"],
        [studentName, certificateType.toUpperCase(), formattedDate, studentPublicKeyHash, publicKeyHash]
      );

      // Sign the message hash
      console.log(privateKey);
      console.log(PK);
      const wallet = new ethers.Wallet(privateKey);
      console.log(wallet);
      console.log(universityAddress);
      const sig = await wallet.signMessage(ethers.getBytes(messageHash));

      // Prepare parameters for issueCertificate
      const certificateTypeString = certificateType.toLowerCase(); // Ensure lowercase
      const rankValue = certificateTypeString === "achievement" ? parseInt(rank) : 0; // Rank only for achievement

      console.log(rankValue);

      // Call the issueCertificate function
      const result = await contracts.methods
        .issueCertificate(
          universityAddress, // University address
          studentPublicKey, // Student address
          studentName,
          certificateTypeString, // Certificate type as string
          formattedDate,
          studentPublicKeyHash, // bytes32
          publicKeyHash, // bytes32
          tokenURI,
          sig, // bytes
          messageHash, // bytes32
          issueby,
          eventName,
          rankValue // uint256
        )
        .send({ from: account });

      console.log("Certificate issued successfully! Transaction:", result);
      alert("Certificate issued successfully!");
    } catch (error) {
      console.error("Error issuing certificate:", error);
      alert("Error issuing certificate. See console for details.");
    }
  };

  const handleSaveCertificate = (imageURI) => {
  
    setCertificateImageUrl(imageURI);
    alert("Certificate generated and uploaded to IPFS!");
  };

  return (
    <PageContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <Navbar>
        <MenuIcon onClick={() => setisopen(!isopen)}>&#9776;</MenuIcon>
      </Navbar>
      <Sidebar isopen={isopen}>
        <SidebarItem onClick={() => navigate("/dashboard")}>Back!</SidebarItem>
        <SidebarItem onClick={() => navigate("/view-all-students")}>View All Students</SidebarItem>
        <SidebarItem onClick={() => navigate("/view-profile")}>View Profile</SidebarItem>
        <SidebarItem onClick={() => navigate("/")}>Logout</SidebarItem>
      </Sidebar>

      <Section whileHover={{ scale: 1.02 }}>
        <Header>College Registration</Header>
        <SubHeader>Welcome You Are Logged In!</SubHeader>
        <p>Your College Wallet Address:</p>
        <TextField type="text" value={universityAddress} readOnly />
      </Section>

      <Section whileHover={{ scale: 1.02 }}>
        <Header>Issue Certificate</Header>
        <p>Student Name</p>
        <TextField
          type="text"
          placeholder="Enter student name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <p>Certificate Type</p>
        <SelectField onChange={(e) => setCertificateType(e.target.value)}>
          <option value="">Select Type</option>
          <option value="achievement">Achievement</option>
          <option value="participation">Participation</option>
        </SelectField>
        {certificateType === "achievement" && (
          <>
            <p>Rank</p>
            <TextField
              type="text"
              placeholder="Enter rank"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
            />
          </>
        )}
        {(certificateType === "achievement" || certificateType === "participation") && (
          <>
            <p>Event Name</p>
            <TextField
              type="text"
              placeholder="Enter event name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </>
        )}
        <p>Date of Issue</p>
        <TextField
          type="date"
          placeholder="MM/DD/YYYY"
          value={dateOfIssue}
          onChange={(e) => setDateOfIssue(e.target.value)}
        />
        <p>Student Public Key</p>
        <TextField
          type="text"
          placeholder="Enter student public key"
          value={studentPublicKey}
          onChange={(e) => setStudentPublicKey(e.target.value)}
        />
        {/* Add Checkbox for Certificate Image */}
        <label>
          <input
            type="checkbox"
            checked={showWindow}
            onChange={() => setShowWindow(!showWindow)}
          />
          Include Certificate Image
        </label>
  
        {showWindow && (
          <CertificateEditor
            onClose={() => setShowWindow(false)}
            onSave={handleSaveCertificate}
            studentName={studentName}
          />
        )}
  
        {certificateImageUrl && (
          <button onClick={() => setShowWindow(true)}>
            Edit Certificate Design
          </button>
        )}
        <Button whileHover={{ scale: 1.1 }} onClick={handleIssueCertificate}>
          Issue The Certificate
        </Button>

      </Section>
      <Section whileHover={{ scale: 1.02 }}>
        <Header>Issue Certificates From CSV</Header>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        <Button whileHover={{ scale: 1.1 }} onClick={handleIssueCertificatescsv}>
          {loading ? "Issuing Certificates..." : "Issue Certificates"}
        </Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Section>
    </PageContainer>
  );
};

export default IssueCertificate;