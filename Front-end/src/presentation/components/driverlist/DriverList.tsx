import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import DriverDetailModal from "./DriverDetailModal";
import { useSelector } from "react-redux";
import { RootState } from "../redux/Store";

const DriverList = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [visibleDrivers, setVisibleDrivers] = useState(9);
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false); 

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    driverLicenseVerifyNumber: "",
    DoB: "",
    licenseStatus: false,
    driverStatus: false,
    licenseType: "",
  });

  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    getListDrivers();
  }, []);

  const getListDrivers = async () => {
    try {
      const res = await axiosInstance.get("/driver", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrivers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const createDriver = async () => {
    if (!formData.image) {
      alert("Please upload an image before submitting.");
      return;
    }
  
    try {
      const res = await axiosInstance.post("/driver", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrivers([...drivers, res.data]);
  
      // Reset form
      setFormData({
        name: "",
        image: "",
        driverLicenseVerifyNumber: "",
        DoB: "",
        licenseStatus: false,
        driverStatus: false,
        licenseType: "",
      });
      setShowForm(false);
      getListDrivers();
    } catch (err) {
      console.log(err);
    }
  };
  

  const updateDriver = async (updatedDriver: any) => {
    if (!updatedDriver._id) {
      console.error("Error: Driver ID is missing!", updatedDriver);
      return;
    }

    try {
      console.log("Sending update request with:", updatedDriver);
      await axiosInstance.put(`/driver/${updatedDriver._id}`, updatedDriver, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDrivers((prevDrivers) =>
        prevDrivers.map((d) => (d._id === updatedDriver._id ? updatedDriver : d))
      );
    } catch (err: any) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Failed to update driver. Please try again.");
    }
  };

  const deleteDriver = async (id: string) => {
    try {
      await axiosInstance.delete(`/driver/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrivers(drivers.filter((driver) => driver._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const openModal = (driver: any) => {
    console.log("Opening Modal for driver:", driver); // Debugging
    setSelectedDriver(driver);
    setModalOpen(true);
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
          setFormData((prev) => ({ ...prev, image: data.imageUrl })); // Save uploaded image URL
        } else {
          console.error("Upload failed:", data.message);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };
  

  const handleFormChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Driver Management</h1>

      {!showForm && (
        <div className="text-center mb-4">
          <button className="btn btn-success" onClick={() => setShowForm(true)}>
            Add New Driver
          </button>
        </div>
      )}

      {showForm && (
        <div className="mb-4">
          <h4>Add New Driver</h4>
          <input type="text" name="name" placeholder="Name" className="form-control mb-2" value={formData.name} onChange={handleFormChange} />
          <input type="file" accept="image/*" className="form-control mb-2" onChange={handleFileChange} />
          <input type="text" name="driverLicenseVerifyNumber" placeholder="License Number" className="form-control mb-2" value={formData.driverLicenseVerifyNumber} onChange={handleFormChange} />
          <input type="date" name="DoB" placeholder="Date of Birth" className="form-control mb-2" value={formData.DoB} onChange={handleFormChange} />
          <input type="text" name="licenseType" placeholder="License Type" className="form-control mb-2" value={formData.licenseType} onChange={handleFormChange} />
          <div className="form-check">
            <input type="checkbox" name="licenseStatus" className="form-check-input" checked={formData.licenseStatus} onChange={handleFormChange} />
            <label className="form-check-label">License Status (Valid/Invalid)</label>
          </div>
          <div className="form-check">
            <input type="checkbox" name="driverStatus" className="form-check-input" checked={formData.driverStatus} onChange={handleFormChange} />
            <label className="form-check-label">Driver Active Status</label>
          </div>
          <button className="btn btn-success me-2" onClick={createDriver}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </div>
      )}

      {drivers.length === 0 ? (
        <div className="text-center mt-5">
          <h2 className="text-danger">No drivers found!</h2>
        </div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Name</th>
              <th>License Number</th>
              <th>DOB</th>
              <th>License Status</th>
              <th>Driver Status</th>
              <th>License Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.slice(0, visibleDrivers).map((driver, index) => (
              <tr key={driver._id||`driver-${index}`}>
                <td>{index + 1}</td>
                <td><img src={`http://localhost:3030/${driver?.images}`|| "https://th.bing.com/th/id/OIP.OKJB0ZYbFTUVCdfsZHvpEwHaHa?rs=1&pid=ImgDetMain"} alt={driver.name} className="rounded-circle" style={{ width: "50px", height: "50px", objectFit: "cover" }} /></td>
                <td>{driver.name}</td>
                <td>{driver.driverLicenseVerifyNumber}</td>
                <td>{new Date(driver.DoB).toLocaleDateString()}</td>
                <td>{driver.licenseStatus ? "Valid" : "Invalid"}</td>
                <td>{driver.driverStatus ? "Active" : "Inactive"}</td>
                <td>{driver.licenseType}</td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => openModal(driver)}>View / Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteDriver(driver._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {visibleDrivers < drivers.length && (
        <div className="text-center mt-4 mb-5">
          <button className="btn btn-outline-primary" onClick={() => setVisibleDrivers((prev) => prev + 10)}>
            Show More
          </button>
        </div>
      )}

      {modalOpen && selectedDriver && (
        <DriverDetailModal driver={selectedDriver} onClose={() => setModalOpen(false)} onUpdate={updateDriver}/>
      )}
    </div>
  );
};

export default DriverList;
