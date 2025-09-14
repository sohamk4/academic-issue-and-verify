import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CertificateList from "./CertificateL";
import { Web3Context } from "../context/Web3Context"; 

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { walletAddress } = location.state || {};
  const {contracts, account, isLoading } = useContext(Web3Context);
  const [isRegistered, setIsRegistered] = useState(false);
  const [apid, setapid] = useState("");
  const [studentRegistry, setstudentRegistry] = useState([]); 
  const [tokenURIs, setTokenURIs] = useState([]); 
  const [isFetching, setIsFetching] = useState(false); 

  useEffect(() => {
    if (isLoading) {
      console.log("Loading contractss...");
      return;
    }

    if (!contracts || !account) {
      console.error("contractss or account not loaded.");
    }
  }, [contracts, account, isLoading]);

  // Fetch student registration status
  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      if (contracts && walletAddress) {
        try {
          const registered = await contracts.methods
            .isregister(walletAddress)
            .call({ from: account });
          setIsRegistered(registered);
          if (!registered) {
            const ad = await contracts.methods.getApprovalId(walletAddress).call({ from: account });
            console.log(ad);
            setapid(ad);
          }
        } catch (error) {
          console.error("Error fetching registration status:", error);
        }
      }
    };

    fetchRegistrationStatus();
  }, [contracts, walletAddress, account]);

  // Fetch student certificates
  useEffect(() => {
    const fetchstudentRegistry = async () => {
      if (!contracts || !walletAddress || !account) return;

      setIsFetching(true); 
      try {
        const certificates = await contracts.methods
          .getCertificatesByStudent(walletAddress)
          .call({ from: account });

        // Process the certificates
        const certificateDetails = certificates.map((certificate) => {
          return {
            id: certificate.certificateId.toString(), // Convert BigInt to string
            studentName: certificate.studentName,
            issuedBy: certificate.issuedBy,
            dateOfIssue: certificate.dateOfIssue,
            eventName: certificate.eventName,
            rank:
              certificate.certificateType === "achievement" // Check certificate type (1 for ACHIEVEMENT)
                ? certificate.rank.toString() // Convert BigInt to string
                : "N/A", // Rank is only applicable for ACHIEVEMENT
          };
        });

        setstudentRegistry(certificateDetails);
      } catch (error) {
        console.error("Error fetching studentRegistry:", error);
        setstudentRegistry([]); // Reset on error
      } finally {
        setIsFetching(false); // Stop loading
      }
    };

    fetchstudentRegistry();
  }, [contracts, walletAddress, account]);

  // Fetch Token URIs
  const fetchTokenURIs = async () => {
    if (!contracts || !walletAddress) return;

    try {
      const uris = await contracts.methods
        .getTokenURIsByAddress(walletAddress)
        .call({ from: account });
      setTokenURIs(uris);
    } catch (error) {
      console.error("Error fetching Token URIs:", error);
      setTokenURIs([]);
    }
  };


  return (
    <div style={styles.pageContainer}>
      {/* Back Button */}
      <button 
        style={styles.backButton} 
        onClick={() => navigate(-1)} 
      >
        &#8592; Back
      </button>

      {/* Main Content Container */}
      <div style={styles.container}>
        {/* First Container for Dashboard Details */}
        <div style={styles.dashboardContainer}>
          <h1 style={styles.center}>Student Dashboard</h1>
          <p style={styles.center}>Your Wallet Address: {walletAddress}</p>
          <p style={styles.center}>
            Registration Status: {isRegistered ? "Registered" : "Not Registered"}
          </p>
          {!isRegistered && (
            <p style={styles.center}>Approval ID: {apid}</p>
          )}
        </div>

        {/* Second Container for Assigned studentRegistry */}
        <div style={styles.registryContainer}>
          <h2 style={styles.registryHeading}>Assigned Student Registry</h2>
          {isFetching ? (
            <p>Loading studentRegistry...</p>
          ) : studentRegistry.length > 0 ? (
            <CertificateList certificates={studentRegistry} />
          ) : (
            <p>No studentRegistry assigned.</p>
          )}
        </div>

        {/* Third Container for Token URIs */}
        <div style={styles.tokenContainer}>
          <h2 style={styles.center}>Token URIs</h2>
          <button style={styles.tokenButton} onClick={fetchTokenURIs}>
            Fetch Token URIs
          </button>
          {tokenURIs.length > 0 && (
            <ul style={styles.tokenList}>
              {tokenURIs.map((uri, index) => (
                <li key={index}>
                  <a href={uri} target="_blank" rel="noopener noreferrer">
                    {uri}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh", // Ensures the page takes up the full height
    position: "relative", // Allow absolute positioning for the back button
  },
  container: {
    flex: 1, // Ensures this section takes up the remaining space after the back button
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center", // Ensures all containers are centered horizontally
  },
  center: {
    textAlign: "center",
    marginBottom: "10px",
  },
  dashboardContainer: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
    width: "80%", // Reduce the width of the container
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.3s ease-in-out",
  },
  registryContainer: {
    backgroundColor: "#0b193f", // Updated background color
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
    width: "80%", // Reduce the width of the container
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white", // Updated text color to white
    transition: "all 0.3s ease-in-out",
  },
  registryHeading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  tokenContainer: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    width: "80%", // Reduce the width of the container
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  tokenButton: {
    backgroundColor: "#0b193f", // Button background color
    color: "white", // Button text color
    padding: "0.8rem",
    width: "100%", // Full width
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    transition: "0.3s",
    marginTop: "0.5rem",
  },
  tokenList: {
    marginTop:"1rem",
    listStyleType: "none", // Remove bullet points
    padding: "0",
    textAlign: "center", // Center-align the links
  },
  backButton: {
    position: "absolute",
    top: "20px",
    left: "20px",
    padding: "0.8rem",
    fontSize: "1rem",
    backgroundColor: "#0b193f", // Button background color
    color: "white", // Button text color
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    zIndex: 10, // Ensure the back button is on top
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
};

export default StudentDashboard;
