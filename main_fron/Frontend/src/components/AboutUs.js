import React from "react";
import styled from "styled-components";
import AboutImage from "../assets/image.png"; // Ensure this file exists

const AboutContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 5rem 10%;
  background-color: #f9f9f9;
  gap: 2rem;

  @media (max-width: 1024px) {
    padding: 4rem 5%;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 3rem 5%;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 500px;
  
  img {
    width: 100%;
    max-width: 100%;
    border-radius: 12px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const TextContainer = styled.div`
  flex: 1;
  max-width: 600px;
  padding-left: 2rem;

  @media (max-width: 1024px) {
    padding-left: 1rem;
  }

  @media (max-width: 768px) {
    padding-left: 0;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: #0b193f;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const AboutUs = () => {
  return (
    <AboutContainer id="about">
      {/* Left Side - Image */}
      <ImageContainer>
        <img src={AboutImage} alt="About Us" />
      </ImageContainer>

      {/* Right Side - Info */}
      <TextContainer>
        <Title>About Us</Title>
        <Subtitle>
          Welcome to <strong>Crediock</strong>, where we revolutionize credential verification using blockchain. 
          Our platform ensures secure, tamper-proof, and globally recognized academic credentials.
        </Subtitle>
        <Subtitle>
          🔹 <strong>Secure & Reliable:</strong> Leveraging blockchain technology for unforgeable records.  <br/>
          🔹 <strong>Instant Verification:</strong> No more delays in document validation.  <br/>
          🔹 <strong>User-Friendly:</strong> Designed for institutions, employers, and students alike.  
        </Subtitle>
      </TextContainer>
    </AboutContainer>
  );
};

export default AboutUs;