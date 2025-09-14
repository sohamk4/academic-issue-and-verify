import React from "react";
import PropTypes from "prop-types"; // Import PropTypes for type checking

const CertificateList = ({ certificates = [] }) => {
  return (
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
        {certificates.map((certificate) => (
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
  );
};

// Add PropTypes for type checking
CertificateList.propTypes = {
  certificates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      studentName: PropTypes.string.isRequired,
      issuedBy: PropTypes.string.isRequired,
      dateOfIssue: PropTypes.string.isRequired,
      eventName: PropTypes.string.isRequired,
      rank: PropTypes.string.isRequired,
    })
  ),
};

const tableHeaderStyle = {
  backgroundColor: "#0b193f",
  color: "white",
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

export default CertificateList;