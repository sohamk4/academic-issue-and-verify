import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import LoginPage from "./components/login";
import SignUp from "./components/SignUp";
import GlobalStyles from "./styles/GlobalStyles";
import Dashboard from "./components/dash";
import IssueCertificate from "./components/issuecertificate";
import ViewAllStudents from "./components/viewallstudents";
import ViewProfile from "./components/profile";
import StudentDashboard from "./components/Studentdash";
import GetCertificateById from "./components/Getcer";
import CheckContracts from "./components/ces"
import { Web3Provider } from "./context/Web3Context"; // Import the Web3Provider
import Verification from "./components/verification";


function AppContent() {
  const location = useLocation();

  return (
    <>
      <GlobalStyles />
      {/* Show Navbar only on the main page */}
      {location.pathname === "/" && <Navbar />}

      <Routes>
        <Route path="/" element={<HeroSection />} />
        {/* Wrap Login and SignUp routes with Web3Provider */}
        <Route
          path="/login"
          element={
            <Web3Provider>
              <LoginPage />
            </Web3Provider>
          }
        />
        <Route
          path="/signup"
          element={
            <Web3Provider>
              <SignUp />
            </Web3Provider>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Web3Provider>
              <Dashboard />
            </Web3Provider>
          }
        />
        <Route
          path="/stddashboard"
          element={
            <Web3Provider>
              <StudentDashboard />
            </Web3Provider>
          }
        />
        <Route
          path="/issue-certificate"
          element={
            <Web3Provider>
              <IssueCertificate />
            </Web3Provider>
          }
        />
        <Route
          path="/check"
          element={
            <Web3Provider>
              <GetCertificateById />
            </Web3Provider>
          }
        />
        <Route
          path="/chec"
          element={
            <Web3Provider>
              <CheckContracts />
            </Web3Provider>
          }
        />
        <Route 
           path="/verification" 
           element={
            <Web3Provider>
              <Verification />
            </Web3Provider>
            }
        /> 
        <Route path="/view-all-students" element={<ViewAllStudents />} />
        <Route path="/view-profile" element={<ViewProfile />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;