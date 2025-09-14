import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const PageContainer = styled(motion.section)`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 6rem 2rem 2rem;
  background: linear-gradient(135deg, #f9f9f9, #e0eafc);
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

const Table = styled(motion.table)`
  width: 80%;
  border-collapse: collapse;
  margin-top: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Th = styled.th`
  background: #0b193f;
  color: white;
  padding: 1rem;
  text-align: left;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  transition: background 0.3s;

  &:hover {
    background: #e0eafc;
  }
`;

const ViewAllStudents = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const students = location.state?.students || []; // Access students from location.state

  return (
    <PageContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <Navbar>
        <MenuIcon onClick={() => setIsOpen(!isOpen)}>&#9776;</MenuIcon>
      </Navbar>
      <Sidebar isOpen={isOpen}>
        <SidebarItem onClick={() => navigate("/issue-certificate")}>Issue Certificate</SidebarItem>
        <SidebarItem onClick={() => navigate("/dashboard")}>Back!</SidebarItem>
        <SidebarItem onClick={() => navigate("/view-profile")}>View Profile</SidebarItem>
        <SidebarItem onClick={() => navigate("/")}>Logout</SidebarItem>
      </Sidebar>

      <Table whileHover={{ scale: 1.02 }}>
        <thead>
          <tr>
            <Th>Sr. No</Th>
            <Th>Name</Th>
            <Th>Branch</Th>
            <Th>Hash</Th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.hash}> {/* Use a unique key like student.hash */}
              <Td>{index + 1}</Td> {/* Auto-generate srNo using index + 1 */}
              <Td>{student.name}</Td>
              <Td>{student.branch}</Td>
              <Td>{student.hash}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageContainer>
  );
};

export default ViewAllStudents;