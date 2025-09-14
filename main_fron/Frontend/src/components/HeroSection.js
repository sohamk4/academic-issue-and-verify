import React, { useRef } from "react";
import styled from "styled-components";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import AboutUs from "./AboutUs"; // Import AboutUs
import ContactUs from "./ContactUs"; // Import ContactUs

// 3D Model Component
const Model = () => {
  const modelRef = useRef();
  const { scene } = useGLTF(process.env.PUBLIC_URL + "/models/book-stack.glb");

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.008;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={2.1} />;
};

// Styled Components
const HeroContainer = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  padding: 0 5rem;
  margin-top: 5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 2rem;
    text-align: center;
  }
`;

const LeftContent = styled.div`
  max-width: 50%;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  color: #0b193f;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #555;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const CTAButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  background-color: #0b193f;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.4s ease;

  &:hover {
    background-color: #09132d;
    transform: translateY(-3px);
    box-shadow: 0px 8px 20px rgba(11, 25, 63, 0.4);
  }
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <>
      <HeroContainer id="home">
        <LeftContent>
          <Title>Secure and Global Academic Credentials</Title>
          <Subtitle>Issue, verify, and share your credentials with ease.</Subtitle>
          <CTAButton onClick={() => navigate("/signup")}>Get Started</CTAButton>
        </LeftContent>

        <CanvasContainer>
          <Canvas camera={{ position: [0, 2, 8], near: 0.01, far: 5000 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[0, 5, 5]} intensity={0.8} />
            <Model />
            <OrbitControls enableZoom={true} minDistance={2} maxDistance={20} />
          </Canvas>
        </CanvasContainer>
      </HeroContainer>

      {/* About Us Section Below Hero */}
      <AboutUs />

      {/* Contact Us Section Below About Us */}
      <ContactUs />
    </>
  );
};

export default HeroSection;
