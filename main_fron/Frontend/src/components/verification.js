import React, { useState, useContext } from "react";
import styled from "styled-components";
import { ethers } from "ethers"; 
import { Web3Context } from "../context/Web3Context"; 

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
  padding: 20px;
`;

const FormWrapper = styled.div`
  background-color: rgb(255, 255, 255);
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
  color: white;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 0.5rem 1rem;
  font-size: 14px;
  background-color: #0b193f;
  color:#ffffff;
  border:none;
  border-radius:5px;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #09132d;
    transform: scale(1.08);
    box-shadow: 0 7px 20px rgba(11, 25, 63, 0.4);
  }
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #0b193f;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  background-color: #f4f4f4;
  color: #333;
  appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const VerifyButton = styled.button`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  background-color: #09132d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 10px rgba(11, 25, 63, 0.5);

  &:hover {
    background-color: #0b193f;
    transform: scale(1.05);
    box-shadow: 0 6px 15px rgba(11, 25, 63, 0.7);
  }
`;

const Verification = () => {
    const [certificateId, setCertificateId] = useState("");
    const [universityAddress, setUniversityAddress] = useState("");
    const [certificateData, setCertificateData] = useState(null);
    const [verificationResult, setVerificationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const { contracts, account  } = useContext(Web3Context);
  
    const handleFetchCertificate = async () => {
      if (!contracts || !account) {
        console.error("Contract or account not loaded.");
        return;
      }
      
      setLoading(true);
      try {
        if (!certificateId || !universityAddress) {
          throw new Error('Please provide all verification inputs');
        }
        
        const message = await contracts.methods.getCertificateById(certificateId).call();
        setCertificateData(message);
        
        const messageHash = ethers.solidityPackedKeccak256(
          ["string", "string", "string", "bytes32", "bytes32"],
          [message.studentName, message.certificateType.toUpperCase(), message.dateOfIssue, message.studentPublicKey, message.universityPublicKey]
        );  
        
        const result = await contracts.methods
          .verifyCertificate(
            message.signature,
            messageHash,
            certificateId,
            universityAddress
          )
          .call({ from: account });
        
        setVerificationResult(result);
        console.log("Verification result:", result);
        
      } catch (err) {
        console.error('Error verifying signature:', err);
        setVerificationResult(false);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Container>
        <BackButton onClick={() => window.history.back()}>&larr; Back</BackButton>
        <FormWrapper>
          <Title>Certificate Verification</Title>
          <Input
            type="number"
            placeholder="Certificate ID"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
          />
          <Input
            type="text"
            placeholder="University Address"
            value={universityAddress}
            onChange={(e) => setUniversityAddress(e.target.value)}
          />
          <VerifyButton onClick={handleFetchCertificate} disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </VerifyButton>
  
          {/* Verification Result */}
          {verificationResult !== null && (
            <div style={{ marginTop: '20px', color: verificationResult ? '#4CAF50' : '#F44336' }}>
              <h3>Verification Status: {verificationResult ? "✅ Valid" : "❌ Invalid"}</h3>
            </div>
          )}
  
          {/* Certificate Details Table */}
          {certificateData && (
            <div style={{ marginTop: '30px', color: '#0b193f' }}>
              <h3>Certificate Details</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Student Name:</td>
                    <td style={{ padding: '8px' }}>{certificateData.studentName}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Certificate Type:</td>
                    <td style={{ padding: '8px' }}>{certificateData.certificateType}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Date of Issue:</td>
                    <td style={{ padding: '8px' }}>{certificateData.dateOfIssue}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Student Public Key:</td>
                    <td style={{ padding: '8px', wordBreak: 'break-all' }}>
                      {certificateData.studentPublicKey}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>University Public Key:</td>
                    <td style={{ padding: '8px', wordBreak: 'break-all' }}>
                      {certificateData.universityPublicKey}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Token URI:</td>
                    <td style={{ padding: '8px', wordBreak: 'break-all' }}>
                      <a href={certificateData.tokenURI} target="_blank" rel="noopener noreferrer">
                        View Certificate Metadata
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </FormWrapper>
      </Container>
    );
  };
  
  export default Verification;
  