import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Web3Context } from "../context/Web3Context"; 
import { useLocation } from "react-router-dom";

const dropDown = keyframes`
  from {
    transform: translateY(-100vh);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const DashboardContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 2rem;
  background-color: #f9f9f9;
  overflow-x: hidden;
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
  width: ${({ screenWidth }) => (screenWidth < 768 ? "100%" : "250px")};
  height: 100vh;
  background: #f9f9f9;
  padding-top: 60px;
  transition: transform 0.3s ease-in-out;
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(-100%)")};
  box-shadow: ${({ isOpen }) => (isOpen ? "5px 0px 15px rgba(0, 0, 0, 0.2)" : "none")};
  z-index: 1000;
`;

const SidebarItem = styled.div`
  padding: 1rem;
  color: #0b193f;
  font-size: ${({ screenWidth }) => (screenWidth < 768 ? "1rem" : "1.2rem")};
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #1e3a5f;
    color: #f9f9f9;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: ${({ isOpen, screenWidth }) => (isOpen && screenWidth >= 768 ? "250px" : "0")};
  transition: margin-left 0.3s ease-in-out;
  width: ${({ isOpen, screenWidth }) => (isOpen && screenWidth >= 768 ? "calc(100% - 250px)" : "100%")};
  padding: 2rem;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 6rem;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 4rem;
  }
`;

const Card = styled.div`
  background: #0b193f;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: white;
  transition: all 0.4s ease;
  width: ${({ screenWidth }) => (screenWidth < 768 ? "90%" : "45%")};
  min-width: 280px;

  &:hover {
    box-shadow: 0px 0px 30px rgba(11, 25, 63, 0.8);
    transform: scale(1.05);
  }
`;

const YearContainers = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
  width: 100%;
`;

const YearCard = styled.div`
  background: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: ${({ screenWidth }) => (screenWidth < 768 ? "1.2rem" : "1.5rem")};
  font-weight: bold;
  color: #0b193f;
  transition: all 0.4s ease;
  animation: ${dropDown} 1s ease-out;
  width: 90%;
  max-width: 1700px;
  cursor: pointer;

  &:hover {
    box-shadow: 0px 0px 30px rgba(11, 25, 63, 0.8);
    transform: scale(1.05);
  }
`;

const DropdownContent = styled.div`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  margin-top: 0.5rem;
  width: 90%;
  max-width: 1700px;
  background: white;
  border-radius: 12px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled.div`
  padding: 1rem;
  font-size: 1rem;
  color: #0b193f;
  cursor: pointer;
  transition: background 0.3s;
  text-align: center;

  &:hover {
    background: #1e3a5f;
    color: #f9f9f9;
  }
`;

const ProfileModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
  z-index: 2000;
  text-align: center;
`;

const ApprovalModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
  z-index: 2000;
  text-align: center;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #0b193f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
  transition: 0.3s;

  &:hover {
    background-color: #09132d;
    transform: scale(1.05);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;
const tableHeaderStyle = {
  backgroundColor: "#f2f2f2",
  padding: "10px",
  border: "1px solid #ddd",
};

const tableRowStyle = {
  border: "1px solid #ddd",
};

const tableCellStyle = {
  padding: "10px",
  border: "1px solid #ddd",
};
const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { privateKey, loginPassword, walletAddress } = location.state || {};
  const { web3, contracts, account,isLoading } = useContext(Web3Context); // Access Web3 context
  const [studentRegistry, setstudentRegistry] = useState(0);
  const [students, setStudents] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [universityAddress, setUniversityAddress] = useState("");
  const [approvalId, setApprovalId] = useState("");
  const [error, setError] = useState("");
  const [unregisteredStudents, setUnregisteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [, setRegisteredStudents] = useState([]);
  const [certificateDetails, setCertificateDetails] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null); // Add this line
  const [isLoadingg, setIsLoadingg] = useState(false);

  useEffect(() => {
    if (isLoading) {
      console.log("Loading contractss...");
      return;
    }

    if (!contracts || !account) {
      console.error("contractss or account not loaded.");
    }
  }, [contracts, account, isLoading]);

  // Fetch university address from local storage
  useEffect(() => {
    if (walletAddress) {
      console.log(walletAddress)
      setUniversityAddress(walletAddress);
    }
  }, [walletAddress]);

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Random number generation for studentRegistry and students
  useEffect(() => {
    let start = 0;
    const endstudentRegistry = Math.floor(Math.random() * 1000) + 500;
    const endStudents = Math.floor(Math.random() * 5000) + 2000;

    const increment = endstudentRegistry / 50;
    const studentIncrement = endStudents / 50;

    const interval = setInterval(() => {
      start += increment;
      setstudentRegistry(Math.floor(start));

      if (start >= endstudentRegistry) {
        setstudentRegistry(endstudentRegistry);
        clearInterval(interval);
      }
    }, 50);

    let studentStart = 0;
    const studentInterval = setInterval(() => {
      studentStart += studentIncrement;
      setStudents(Math.floor(studentStart));

      if (studentStart >= endStudents) {
        setStudents(endStudents);
        clearInterval(studentInterval);
      }
    }, 50);
  }, []);

  // Toggle dropdown for a specific year
  const toggleDropdown = (year) => {
    setOpenDropdown(openDropdown === year ? null : year);
  };

  // Fetch registered students by university
  const fetchRegisteredStudents = async () => {
    if (!contracts || !account) {
      console.error("contracts or account not loaded.");
      return;
    }
  
    try {
      // Fetch all students in the university
      const students = await contracts.methods
        .getAllStudentsInUniversity(universityAddress)
        .call({ from: account });

      console.log(students)
      // Process the returned student data
      const studentsWithDetails = students.map((student, index) => {
        console.log(student.studentPublicKey);
        return {
          srNo: index + 1, // Serial number
          name: student.name, // Student name
          branch: student.course, // Student branch (assuming `course` is the branch)
          hash: student.studentPublicKey, // Use a unique identifier from the student data
        };
      });
      
  
      setRegisteredStudents(studentsWithDetails); // Update state with student details
      return studentsWithDetails;
    } catch (err) {
      console.error("Error fetching registered students:", err);
    }
  };
  
  // Navigate to the "View All Students" page with student data
  const handleViewAllStudents = async () => {
    const students = await fetchRegisteredStudents();
    if (students) {
      navigate("/view-all-students", { state: { students } });
    }
  };

  // Fetch unregistered students by university
  const fetchUnregisteredStudents = async () => {
    console.log(contracts)
    if (!contracts || !account) {
      console.error("contracts or account not loaded.");
      return;
    }

    try {
      console.log(universityAddress)
      const students = await contracts.methods
        .getNotRegisteredStudents(universityAddress)
        .call({ from: account });
      return students;
    } catch (err) {
      console.error("Error fetching unregistered students:", err);
    }
  };

  // Handle Approval click
  const handleApproval = async () => {
    setShowApproval(true);
    const students = await fetchUnregisteredStudents();
    setUnregisteredStudents(students);
  };

  // Handle Approval Submission
  const handleApproveStudent = async () => {
    if (!selectedStudents.length) {
      setError("Please select at least one student.");
      return;
    }

    if (!contracts || !account || !web3) {
      console.error("Web3, contracts, or account not loaded.");
      return;
    }

    try {
      for (const studentAddress of selectedStudents) {
        await contracts.methods
          .approveStudentRegistration(studentAddress, approvalId, universityAddress)
          .send({ from: account });
      }

      setError("");
      alert("Students approved successfully!");
      setShowApproval(false);
      setSelectedStudents([]);
    } catch (err) {
      setError(`Error approving students: ${err.message}`);
      console.error("Error approving students:", err);
    }
  };

  const handleStudentSelection = (studentAddress) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentAddress)
        ? prevSelected.filter((address) => address !== studentAddress)
        : [...prevSelected, studentAddress]
    );
  };
  const handleIssueCertificate = () => {
    console.log(privateKey,loginPassword,loginPassword)
    navigate("/issue-certificate", {
      state: { privateKey,loginPassword, walletAddress }
    });
  };

  const fetchCertificateDetails = async (year) => {
    try {
      // Fetch certificate IDs for the given year
      const certificateIds = await contracts.methods
        .getCertificatesByUniversityAndYear(universityAddress,year)
        .call({ from: account });
  
      // Fetch details for each certificate ID
      const certificateDetails = await Promise.all(
        certificateIds.map(async (certificateId) => {
          const cert = await contracts.methods
            .getCertificateById(certificateId)
            .call({ from: account });
          console.log(cert.certificateType);
          return {
            id: certificateId.toString(), // Convert BigInt to string
            studentName: cert.studentName,
            issuedBy: cert.issuedBy,
            dateOfIssue: cert.dateOfIssue,
            eventName:
              cert.certificateType === "achievement" // Check certificate type
                ? cert.eventName
                : cert.eventName, // Use eventName for both types
            rank:
              cert.certificateType === "achievement" // Check certificate type
                ? cert.rank.toString() // Convert BigInt to string
                : "N/A", // Rank is only applicable for ACHIEVEMENT
          };
        })
      );
  
      return certificateDetails;
    } catch (error) {
      console.error("Error fetching certificate details:", error);
      throw error;
    }
  };  // Handle certificate click
  const handleCertificateClick = async (year) => {
    setSelectedYear(year);
    setIsLoadingg(true);
    setError(null);
    try {
      const details = await fetchCertificateDetails(year);
      setCertificateDetails(details);
    } catch (error) {
      setError("Failed to fetch studentRegistry. Please try again.");
    } finally {
      setIsLoadingg(false);
    }
  };
  return (
    <DashboardContainer>
      <Navbar>
        <MenuIcon onClick={() => setIsOpen(!isOpen)}>&#9776;</MenuIcon>
      </Navbar>
      
      <Sidebar isOpen={isOpen} screenWidth={screenWidth}>
      <SidebarItem onClick={handleIssueCertificate}>Issue Certificate</SidebarItem>    
        <SidebarItem screenWidth={screenWidth} onClick={handleViewAllStudents}>View All Students</SidebarItem>
        <SidebarItem 
          screenWidth={screenWidth}
          onClick={() => navigate("/view-profile", {
            state: { 
              universityAddress: universityAddress // Pass the university wallet address
            }
          })}
        >
          View Profile
        </SidebarItem>
        <SidebarItem screenWidth={screenWidth} onClick={handleApproval}>Approval</SidebarItem>
        <SidebarItem screenWidth={screenWidth}>Logout</SidebarItem>
      </Sidebar>

      <MainContent isOpen={isOpen} screenWidth={screenWidth}>
        <div style={{ width: '100%', textAlign: 'center', marginTop: '20px', marginBottom: '0px'}}>
          <h1>Wallet address: {universityAddress}</h1>
        </div>
        <StatsContainer>
          <Card screenWidth={screenWidth}><h2>Total Certificate Issued</h2><p>{studentRegistry}</p></Card>
          <Card screenWidth={screenWidth}><h2>Total Registered Students</h2><p>{students}</p></Card>
        </StatsContainer>
        
        <YearContainers>
          {[2024, 2023, 2022, 2021, 2020].map((year, index) => (
            <div key={year} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <YearCard
                screenWidth={screenWidth}
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={() => toggleDropdown(year)}
              >
                {year}
              </YearCard>
              <DropdownContent isOpen={openDropdown === year}>
                <DropdownItem>Degrees</DropdownItem>
                <DropdownItem onClick={() => handleCertificateClick(year)}>studentRegistry</DropdownItem>
              </DropdownContent>
              {selectedYear === year && isLoadingg && <p>Loading studentRegistry...</p>}
              {selectedYear === year && error && <p style={{ color: "red" }}>{error}</p>}
              {selectedYear === year && !isLoadingg && certificateDetails.length > 0 && (
                <>
                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                    <thead>
                      <tr>
                        <th style={tableHeaderStyle}>Certificate ID</th>
                        <th style={tableHeaderStyle}>Student Name</th>
                        <th style={tableHeaderStyle}>Issued By</th>
                        <th style={tableHeaderStyle}>Date of Issue</th>
                        <th style={tableHeaderStyle}>Event Name</th>
                        <th style={tableHeaderStyle}>Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificateDetails.map((certificate) => (
                        <tr key={certificate.id} style={tableRowStyle}>
                          <td style={tableCellStyle}>{certificate.id}</td>
                          <td style={tableCellStyle}>{certificate.studentName}</td>
                          <td style={tableCellStyle}>{certificate.issuedBy}</td>
                          <td style={tableCellStyle}>{certificate.dateOfIssue}</td>
                          <td style={tableCellStyle}>{certificate.eventName}</td>
                          <td style={tableCellStyle}>{certificate.rank}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    onClick={() => setSelectedYear(null)}
                    style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
                  >
                    Back to Years
                  </button>
                </>
              )}
              {selectedYear === year && !isLoadingg && certificateDetails.length === 0 && (
                <p>No studentRegistry found for this year.</p>
              )}
            </div>
          ))}
        </YearContainers>      
      </MainContent>
      {showProfile && (
        <>
          <Overlay onClick={() => setShowProfile(false)} />
          <ProfileModal>
            <h2>University Profile</h2>
            <p>Address: {universityAddress}</p>
            <Button onClick={() => setShowProfile(false)}>Close</Button>
          </ProfileModal>
        </>
      )}

      {showApproval && (
        <>
          <Overlay onClick={() => setShowApproval(false)} />
          <ApprovalModal>
            <h2>Approve Students</h2>
            {unregisteredStudents.map((studentAddress) => (
              <div key={studentAddress}>
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(studentAddress)}
                  onChange={() => handleStudentSelection(studentAddress)}
                />
                <span>{studentAddress}</span>
              </div>
            ))}
            <Input
              type="text"
              placeholder="Approval ID"
              value={approvalId}
              onChange={(e) => setApprovalId(e.target.value)}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Button onClick={handleApproveStudent}>Approve Selected Students</Button>
            <Button onClick={() => setShowApproval(false)}>Close</Button>
          </ApprovalModal>
        </>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;