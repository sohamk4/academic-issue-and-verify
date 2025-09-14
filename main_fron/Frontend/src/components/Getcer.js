import React, { useState, useContext } from "react";
import { Web3Context } from "../context/Web3Context"; // Import Web3Context

const GetCertificateById = () => {
  const { contract, account } = useContext(Web3Context);

  const [certificateId, setCertificateId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");

  // Fetch certificate details by ID
  const fetchCertificateById = async () => {
    if (!contract || !account) {
      setError("Contract or account not loaded.");
      return;
    }

    if (!certificateId) {
      setError("Please enter a certificate ID.");
      return;
    }

    try {
      const certificateDetails = await contract.methods
        .getCertificateById(certificateId)
        .call({ from: account });

      setCertificate({
        id: certificateId,
        studentName: certificateDetails.studentName,
        studentAddress: certificateDetails.studentAddress,
        universityAddress: certificateDetails.universityAddress,
        certificateType: certificateDetails.certificateType,
        dateOfIssue: certificateDetails.dateOfIssue,
        studentPublicKey: certificateDetails.studentPublicKey,
        universityPublicKey: certificateDetails.universityPublicKey,
        signature: certificateDetails.signature,
        issuedBy: certificateDetails.issuedBy,
        eventName: certificateDetails.eventName,
        rank: certificateDetails.rank.toString(),
      });
      setError("");
    } catch (err) {
      console.error("Error fetching certificate:", err);
      setError("Invalid certificate ID or an error occurred.");
      setCertificate(null);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Get Certificate by ID</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter Certificate ID"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <button
          onClick={fetchCertificateById}
          style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Fetch Certificate
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {certificate && (
        <div>
          <h3>Certificate Details</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <tbody>
              <tr>
                <td style={tableCellStyle}>Certificate ID</td>
                <td style={tableCellStyle}>{certificate.id}</td>
              </tr>
              <tr>
                <td style={tableCellStyle}>Student Name</td>
                <td style={tableCellStyle}>{certificate.studentName}</td>
              </tr>
              <tr>
                <td style={tableCellStyle}>Student Address</td>
                <td style={tableCellStyle}>{certificate.studentAddress}</td>
              </tr>
              <tr>
                <td style={tableCellStyle}>University Address</td>
                <td style={tableCellStyle}>{certificate.universityAddress}</td>
              </tr>
              <tr>
                <td style={tableCellStyle}>Certificate Type</td>
                <td style={tableCellStyle}>{certificate.certificateType}</td>
              </tr>
              <tr>
                <td style={tableCellStyle}>Date of Issue</td>
                <td style={tableCellStyle}>{certificate.dateOfIssue}</td>
              </tr>
              <tr>
                <td style={tableCellStyle}>Student Public Key</td>
                <td style={tableCellStyle}>{certificate.studentPublicKey}</td>
              </tr>
              <tr>
                <td style={tableCellStyle}>University Public Key</td>
                <td style={tableCellStyle}>{certificate.universityPublicKey}</td>
              </tr>
              <tr>
                <td style={tableCellStyle}>Signature</td>
                <td style={tableCellStyle}>{certificate.signature}</td>
              </tr>
              <tr>
                <td style={tableCellStyle}>Issued By</td>
                <td style={tableCellStyle}>{certificate.issuedBy}</td>
              </tr>
              <tr>
                <td style={tableCellStyle}>Event Name</td>
                <td style={tableCellStyle}>{certificate.eventName}</td>
              </tr>
              <tr>
                <td style={tableCellStyle}>Rank</td>
                <td style={tableCellStyle}>{certificate.rank}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const tableCellStyle = {
  padding: "10px",
  border: "1px solid #ddd",
};

export default GetCertificateById;