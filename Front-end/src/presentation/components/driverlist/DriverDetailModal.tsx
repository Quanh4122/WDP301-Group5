import React, { useState } from "react";

const DriverDetailModal = ({ driver, onClose, onUpdate }: { driver: any; onClose: () => void; onUpdate: (updatedDriver: any) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...driver });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Hàm tính tuổi từ DoB
  const calculateAge = (dob: string) => {
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: value,
      ...(name === "DoB" && { age: calculateAge(value) }) // Cập nhật tuổi khi thay đổi DoB
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
  
      const formData = new FormData();
      formData.append("avatar", file);
  
      try {
        const response = await fetch("http://localhost:3030/upload-avatar", {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
        if (response.ok) {
          setFormData({ ...formData, image: data.imageUrl });
        } else {
          console.error("Upload failed:", data.message);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };
  

  const handleRemoveAvatar = () => {
    setFormData({ ...formData, image: "" });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value === "true" });
  };

  const handleSave = () => {
    console.log("Driver data before update:", formData);
    
    if (!formData._id && driver._id) {
      setFormData((prev: typeof formData) => ({ ...prev, _id: driver._id }));
    }
  
    // Ensure the update function gets the correct data
    onUpdate({ ...formData, _id: driver._id });
  
    setIsEditing(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
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
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
          <h5 style={{ margin: 0 }}>{isEditing ? "Edit Driver" : driver.name}</h5>
          <button
            style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#333" }}
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div style={{ textAlign: "left" }}>
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <img
              src={formData.image || "https://th.bing.com/th/id/OIP.OKJB0ZYbFTUVCdfsZHvpEwHaHa?rs=1&pid=ImgDetMain"}
              alt={formData.name}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "10px",
              }}
            />
            {isEditing && (
              <>
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <button onClick={handleRemoveAvatar} className="btn btn-danger btn-sm mt-2">
                  Remove Avatar
                </button>
              </>
            )}
          </div>

          <p>
            <strong>Full Name:</strong>{" "}
            {isEditing ? <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" /> : driver.name}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {isEditing ? (
              <input type="date" name="DoB" value={formData.DoB?.split("T")[0] || ""} onChange={handleChange} className="form-control" />
            ) : (
              new Date(driver.DoB).toLocaleDateString()
            )}
          </p>
          <p>
            <strong>Age:</strong> {calculateAge(formData.DoB)}
          </p>
          <p>
            <strong>Driver License:</strong>{" "}
            {isEditing ? (
              <input type="text" name="driverLicenseVerifyNumber" value={formData.driverLicenseVerifyNumber} onChange={handleChange} className="form-control" />
            ) : (
              driver.driverLicenseVerifyNumber
            )}
          </p>
          <p>
            <strong>License Type:</strong>{" "}
            {isEditing ? <input type="text" name="licenseType" value={formData.licenseType} onChange={handleChange} className="form-control" /> : driver.licenseType}
          </p>
          <p>
            <strong>License Status:</strong>{" "}
            {isEditing ? (
              <select name="licenseStatus" value={String(formData.licenseStatus)} onChange={handleStatusChange} className="form-control">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            ) : driver.licenseStatus ? "Active" : "Inactive"}
          </p>
          <p>
            <strong>Driver Status:</strong>{" "}
            {isEditing ? (
              <select name="driverStatus" value={String(formData.driverStatus)} onChange={handleStatusChange} className="form-control">
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            ) : driver.driverStatus ? "Available" : "Unavailable"}
          </p>

          <div className="text-center mt-3">
            {isEditing ? (
              <>
                <button className="btn btn-success me-2" onClick={handleSave}>
                  Save
                </button>
                <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-warning" onClick={() => setIsEditing(true)}>
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailModal;
