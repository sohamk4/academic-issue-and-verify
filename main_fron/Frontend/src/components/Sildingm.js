import React from "react";

const SlidingMenu = ({ isOpen, onClose, children }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: isOpen ? 0 : "-250px",
        width: "250px",
        height: "100%",
        backgroundColor: "#f4f4f4",
        transition: "left 0.3s ease",
        padding: "20px",
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <button onClick={onClose} style={{ marginBottom: "20px" }}>
        Close
      </button>
      {children}
    </div>
  );
};

export default SlidingMenu;