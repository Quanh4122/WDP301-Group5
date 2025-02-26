import React from "react";

const DriverDetailModal = ({ driver, onClose }: { driver: any; onClose: () => void }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)", // Semi-transparent backdrop
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1050,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: "10px",
          width: "90%",
          maxWidth: "400px",
          padding: "20px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          position: "relative",
          animation: "fadeIn 0.3s ease-in-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ddd",
            paddingBottom: "10px",
            marginBottom: "15px",
          }}
        >
          <h5 style={{ margin: 0 }}>{driver.name}</h5>
          <button
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#333",
              transition: "0.2s",
            }}
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ textAlign: "left" }}>
          <img
            src={driver.image}
            alt={driver.name}
            style={{
              width: "100%",
              maxHeight: "250px",
              objectFit: "cover",
              borderRadius: "5px",
              marginBottom: "15px",
            }}
          />
          <p>
            <strong>Full Name:</strong> {driver.name}<br/>
            <strong>Age:</strong> {driver.age}<br/>
            <strong>Driver Licence:</strong><br/>
            <strong>Licence Type:</strong><br/>
            <strong>Licence Status</strong><br/>
            <strong>Driver Status:</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailModal;
