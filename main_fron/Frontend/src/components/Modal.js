import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import axios from "axios";

const CertificateEditor = ({ onClose, onSave, studentName }) => {
  const [image, setImage] = useState(null);
  const [textBox, setTextBox] = useState(null);
  const [, setSelectedBox] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [resizing, setResizing] = useState(null);
  const [editPanel, setEditPanel] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [selectionArea, setSelectionArea] = useState(null);
  const containerRef = useRef(null);
  const [generatedCertificateUrl, setGeneratedCertificateUrl] = useState(null);
  const [isInsideContainer, setIsInsideContainer] = useState(false);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to IPFS
  const uploadImageToIPFS = async (imageBlob) => {
    try {
      const formData = new FormData();
      formData.append("file", imageBlob, "certificate.png");

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: "71e6b70521060942b801",
            pinata_secret_api_key: "a9971a3b6712c5805cb5d55c30b7790979d163b30423f2f38eb268c9965a37c4",
          },
        }
      );

      const ipfsHash = response.data.IpfsHash;
      const imageURI = `https://ipfs.io/ipfs/${ipfsHash}`;
      console.log(imageURI);
      return imageURI;
    } catch (error) {
      console.error("Error uploading image to IPFS:", error);
      throw error;
    }
  };

  const processCertificate = async () => {
    if (!textBox || !containerRef.current) return;

    const resizeButton = containerRef.current.querySelector(".resize-button");
    if (resizeButton) resizeButton.style.display = "none";

    try {
      setTextBox((prev) => ({
        ...prev,
        text: studentName,
      }));

      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(containerRef.current);
      canvas.toBlob(async (blob) => {
        try {
          const imageURI = await uploadImageToIPFS(blob);
          console.log(`Certificate for ${studentName} uploaded to IPFS: ${imageURI}`);

          setGeneratedCertificateUrl(imageURI);
          alert("Certificate generated! Click 'Save' to finalize.");
        } catch (error) {
          console.error("Error uploading certificate to IPFS:", error);
        }
      }, "image/png");
    } catch (error) {
      console.error("Error capturing canvas:", error);
    } finally {
      if (resizeButton) resizeButton.style.display = "block";
    }
  };

  const handleSave = () => {
    if (!generatedCertificateUrl) {
      alert("Please generate the certificate first!");
      return;
    }
    onSave(generatedCertificateUrl);
    onClose(); 
  };

  const handleMouseEnter = () => {
    setIsInsideContainer(true);
  };

  const handleMouseLeave = () => {
    setIsInsideContainer(false);
    setDragging(null);
    setResizing(null);
    setIsDrawing(false);
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    if (!isInsideContainer || editPanel || textBox) return;

    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPos({ x: offsetX, y: offsetY });
    setSelectionArea({ x: offsetX, y: offsetY, width: 0, height: 0 });
  };

  // Handle mouse move for dragging and resizing
  const handleMouseMove = (e) => {
    if (!isInsideContainer) return;

    if (dragging && textBox) {
      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      const deltaX = offsetX - dragging.offsetX;
      const deltaY = offsetY - dragging.offsetY;

      setTextBox((prev) => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));

      setDragging({ ...dragging, offsetX, offsetY });
    } else if (resizing && textBox) {
      const deltaX = e.clientX - resizing.startX;
      const deltaY = e.clientY - resizing.startY;

      setTextBox((prev) => ({
        ...prev,
        width: Math.max(50, resizing.startWidth + deltaX),
        height: Math.max(20, resizing.startHeight + deltaY),
      }));
    } else if (isDrawing && startPos) {
      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      const width = offsetX - startPos.x;
      const height = offsetY - startPos.y;

      setSelectionArea({
        x: startPos.x,
        y: startPos.y,
        width,
        height,
      });
    }
  };
  // Handle mouse up to stop dragging or resizing
  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setStartPos(null);

      if (selectionArea) {
        setTextBox({
          id: Date.now(),
          x: selectionArea.x,
          y: selectionArea.y,
          text: "New Text",
          size: 16,
          font: "Arial",
          width: Math.abs(selectionArea.width),
          height: Math.abs(selectionArea.height),
        });
      }

      setSelectionArea(null);
    }

    setDragging(null);
    setResizing(null);
  };

  // Handle resize mouse down
  const handleResizeMouseDown = (e, box) => {
    e.stopPropagation();
    setResizing({
      id: box.id,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: box.width,
      startHeight: box.height,
    });
  };

  // Handle text box mouse down for dragging
  const handleTextBoxMouseDown = (e, box) => {
    e.stopPropagation();
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDragging({
      id: box.id,
      offsetX,
      offsetY,
    });
  };

  // Handle text box click to open edit panel
  const handleTextBoxClick = (box, e) => {
    e.stopPropagation();
    setSelectedBox(box.id);
    setEditPanel({ ...box });
  };

  // Handle click outside edit panel
  const handleClickOutside = (e) => {
    if (!e.target.closest(".text-box") && !e.target.closest(".edit-panel")) {
      setEditPanel(null);
      setSelectedBox(null);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        width: "800px",
        height: "600px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClickOutside}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "#ff4d4d",
          color: "white",
          padding: "5px 10px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Close
      </button>

      {/* Upload Image Button */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Upload Image
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
        </label>
      </div>

      {/* Scrollable Image Container */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflow: "auto",
          border: "2px solid #ccc",
          position: "relative",
          backgroundColor: "#fff",
          marginBottom: "20px",
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {image && (
          <img
            src={image}
            alt="Uploaded"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        )}
        {textBox && (
          <div
            className="text-box"
            style={{
              position: "absolute",
              left: `${textBox.x}px`,
              top: `${textBox.y}px`,
              cursor: "grab",
              backgroundColor: "white",
              padding: "10px",
              minWidth: "100px",
              fontSize: `${textBox.size}px`,
              fontFamily: textBox.font,
              width: `${textBox.width}px`,
              height: `${textBox.height}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "0px",
              border: "none"
            }}
            onMouseDown={(e) => handleTextBoxMouseDown(e, textBox)}
            onClick={(e) => handleTextBoxClick(textBox, e)}
          >
            {textBox.text || "Click to edit"}
            <div
              className="resize-button"
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                width: "16px",
                height: "16px",
                backgroundColor: "black",
                cursor: "nwse-resize",
                border: "0px"
              }}
              onMouseDown={(e) => handleResizeMouseDown(e, textBox)}
            ></div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        {/* Generate Certificate Button */}
        <button
          onClick={processCertificate}
          style={{
            backgroundColor: "#2196F3",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            flex: 1,
          }}
        >
          Generate Certificate
        </button>

        {/* Save Button (only enabled after generation) */}
        <button
          onClick={handleSave}
          disabled={!generatedCertificateUrl}
          style={{
            backgroundColor: generatedCertificateUrl ? "#4CAF50" : "#cccccc",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: generatedCertificateUrl ? "pointer" : "not-allowed",
            flex: 1,
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CertificateEditor;