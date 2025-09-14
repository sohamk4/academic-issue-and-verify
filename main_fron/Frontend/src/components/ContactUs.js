import React from 'react';
import styled from 'styled-components';

const ContactContainer = styled.section`
  padding: 4rem 2rem;
  background-color: #E5E7EB;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centers content horizontally */
  text-align: center; /* Ensures text is centered */
`;

const ContactTitle = styled.h2`
  font-size: 2rem;
  color: #1E3A8A;
`;

const ContactDetails = styled.div`
  font-size: 1.2rem;
  color: #333;
  margin-top: 1rem;
  line-height: 1.6;
`;

const ContactUs = () => {
  return (
    <ContactContainer id="contact">
      <ContactTitle>Contact Us</ContactTitle>
      <ContactDetails>
        <p>Email: support@kyvify.com</p>
        <p>Phone: +91 98765 43210</p>
        <p>Address: Mumbai, India</p>
      </ContactDetails>
    </ContactContainer>
  );
};

export default ContactUs;
