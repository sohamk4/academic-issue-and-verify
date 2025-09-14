import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaUniversity } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: all 0.3s ease-in-out;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #0b193f;
  cursor: pointer;
  text-decoration: none;

  svg {
    margin-right: 8px;
    font-size: 1.8rem;
    color: #0b193f;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled.a`
  position: relative;
  font-size: 14px;
  text-decoration: none;
  color: ${({ active }) => (active ? "#09132d" : "#0b193f")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  padding-bottom: 5px;
  transition: color 0.3s ease;

  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 0%;
    height: 2px;
    background-color: #09132d;
    transition: width 0.7s ease-in-out;
  }

  &:hover {
    color: #09132d;
  }

  &:hover:after {
    width: 100%;
  }

  ${({ active }) =>
    active &&
    `
      &:after {
        width: 100%;
      }
    `}
`;

const LoginButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 14px;
  background-color: #0b193f;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #09132d;
    transform: scale(1.08);
    box-shadow: 0 7px 20px rgba(11, 25, 63, 0.4);
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const observerOptions = {
      threshold: 0.5, 
      rootMargin: "-100px 0px -50px 0px", 
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <NavbarContainer>
      <Logo to="/">
        <FaUniversity /> Crediock
      </Logo>
      <NavLinks>
        <NavLink
          href="#home"
          active={activeSection === "home"}
          onClick={(e) => scrollToSection(e, "home")}
        >
          Home
        </NavLink>
        <NavLink
          href="#about"
          active={activeSection === "about"}
          onClick={(e) => scrollToSection(e, "about")}
        >
          About Us
        </NavLink>
        <NavLink
          href="#contact"
          active={activeSection === "contact"}
          onClick={(e) => scrollToSection(e, "contact")}
        >
          Contact Us
        </NavLink>
        <NavLink
          href="/verification"
          active={activeSection === "verification"}
        >        
          Verification
        </NavLink>
      </NavLinks>
      <LoginButton onClick={() => navigate("/login")}>Log In</LoginButton>
    </NavbarContainer>
  );
};

export default Navbar;
