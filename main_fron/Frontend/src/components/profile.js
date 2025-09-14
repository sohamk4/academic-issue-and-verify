import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { Web3Context } from "../context/Web3Context"; // Import Web3Context

const ProfilePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { contracts, account, isLoading  } = useContext(Web3Context);
  const location = useLocation();
  const { universityAddress } = location.state || {};
  const [profile, setProfile] = useState({
    college: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    domain: "",
    hash: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    if (isLoading) {
      console.log("Loading contractss...");
      return;
    }

    const loadProfileData = async () => {
      if (!contracts || !account || !universityAddress) {
        console.log("Missing required data:", { contracts, account, universityAddress });
        return;
      }

      try {
        console.log("Fetching university profile...");
        const result = await contracts.methods
          .getUniversityByAdd(universityAddress)
          .call({ from: account });

        if (isMounted && result?.[0]) {
          setProfile({
            college: result[1] || "Not available",
            country: result[2] || "Not available",
            state: result[3] || "Not available",
            city: result[4] || "Not available", 
            pincode: result[5] || "Not available",
            domain: result[6] || "Not available",
            hash: result[0] || "Not available"
          });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        if (isMounted) {
          setProfile(prev => ({
            ...prev,
            college: "Error loading data",
            // ... other error states
          }));
        }
      }
    };

    loadProfileData();

    return () => { isMounted = false; };
  }, [contracts, account,isLoading, universityAddress]); // All dependencies



  const copyToClipboard = () => {
    if (profile.hash) {
      navigator.clipboard.writeText(profile.hash);
      alert("University address copied to clipboard!");
    }
  };

  return (
    <DashboardContainer>
      <Navbar>
        <MenuIcon onClick={() => setIsOpen(!isOpen)}>&#9776;</MenuIcon>
      </Navbar>

      <Sidebar isOpen={isOpen}>
        <SidebarItem onClick={() => navigate("/issue-certificate")}>Issue Certificates</SidebarItem>
        <SidebarItem onClick={() => navigate("/view-all-students")}>View All Students</SidebarItem>
        <SidebarItem onClick={() => navigate("/dashboard")}>Back!</SidebarItem>
        <SidebarItem onClick={() => navigate("/")}>Logout</SidebarItem>
      </Sidebar>

      <ProfileContainer>
        <Heading>College Profile</Heading>
        <Divider />
        <ProfileField>
          <label>College Name:</label>
          <span>{profile.college || "Not available"}</span>
        </ProfileField>
        <ProfileField>
          <label>Country:</label>
          <span>{profile.country || "Not available"}</span>
        </ProfileField>
        <ProfileField>
          <label>State:</label>
          <span>{profile.state || "Not available"}</span>
        </ProfileField>
        <ProfileField>
          <label>City:</label>
          <span>{profile.city || "Not available"}</span>
        </ProfileField>
        <ProfileField>
          <label>Pincode:</label>
          <span>{profile.pincode || "Not available"}</span>
        </ProfileField>
        <ProfileField>
          <label>Student Domain:</label>
          <span>{profile.domain || "Not available"}</span>
        </ProfileField>
        <ProfileField>
          <label>University Address:</label>
          <HashContainer>
            <span>{profile.hash || "Not available"}</span>
            {profile.hash && (
              <CopyButton onClick={copyToClipboard}>Copy</CopyButton>
            )}
          </HashContainer>
        </ProfileField>
      </ProfileContainer>
    </DashboardContainer>
  );
};
const DashboardContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 2rem;
  background-color: #f9f9f9;
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
  width: 250px;
  height: 100vh;
  background: #f9f9f9;
  padding-top: 60px;
  transition: transform 0.3s ease-in-out;
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(-100%)")};
  box-shadow: ${({ isOpen }) => (isOpen ? "5px 0px 15px rgba(0, 0, 0, 0.2)" : "none")};
`;

const SidebarItem = styled.div`
  padding: 1rem;
  color: #0b193f;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #1e3a5f;
    color: #f9f9f9;
  }
`;

const ProfileContainer = styled.div`
  margin-top: 100px;
  padding: 3rem;
  background: white;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  width: 600px;
  text-align: center;
`;

const Heading = styled.h2`
  font-size: 2rem;
  color: #0b193f;
  margin-bottom: 1.5rem;
`;

const Divider = styled.hr`
  width: 100%;
  border: 1px solid #ccc;
  margin-bottom: 2rem;
`;

const ProfileField = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
`;

const HashContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const CopyButton = styled.button`
  background: #0b193f;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background: #1e3a5f;
  }
`;

export default ProfilePage;
