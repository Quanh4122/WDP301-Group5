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
    <div className="container mt-5 px-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h1 className="mb-0 text-center">Driver Management</h1>
        </div>
        
        <div className="card-body">
          {!showForm && (
            <div className="text-center mb-4">
              <button 
                className="btn btn-success btn-lg shadow-sm" 
                onClick={() => setShowForm(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>Add New Driver
              </button>
            </div>
          )}

          {showForm && (
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h4 className="card-title text-primary">Add New Driver</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Name" 
                      className="form-control" 
                      value={formData.name} 
                      onChange={handleFormChange} 
                    />
                  </div>
                  <div className="col-md-6">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="form-control" 
                      onChange={handleFileChange} 
                    />
                  </div>
                  <div className="col-md-6">
                    <input 
                      type="text" 
                      name="driverLicenseVerifyNumber" 
                      placeholder="License Number" 
                      className="form-control" 
                      value={formData.driverLicenseVerifyNumber} 
                      onChange={handleFormChange} 
                    />
                  </div>
                  <div className="col-md-6">
                    <input 
                      type="date" 
                      name="DoB" 
                      className="form-control" 
                      value={formData.DoB} 
                      onChange={handleFormChange} 
                    />
                  </div>
                  <div className="col-md-6">
                    <input 
                      type="text" 
                      name="licenseType" 
                      placeholder="License Type" 
                      className="form-control" 
                      value={formData.licenseType} 
                      onChange={handleFormChange} 
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="form-check mb-2">
                      <input 
                        type="checkbox" 
                        name="licenseStatus" 
                        className="form-check-input" 
                        checked={formData.licenseStatus} 
                        onChange={handleFormChange} 
                      />
                      <label className="form-check-label">License Valid</label>
                    </div>
                    <div className="form-check">
                      <input 
                        type="checkbox" 
                        name="driverStatus" 
                        className="form-check-input" 
                        checked={formData.driverStatus} 
                        onChange={handleFormChange} 
                      />
                      <label className="form-check-label">Driver Active</label>
                    </div>
                  </div>
                  <div className="col-12 text-end">
                    <button 
                      className="btn btn-success me-2" 
                      onClick={createDriver}
                    >
                      <i className="bi bi-check-circle me-2"></i>Save
                    </button>
                    <button 
                      className="btn btn-outline-secondary" 
                      onClick={() => setShowForm(false)}
                    >
                      <i className="bi bi-x-circle me-2"></i>Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {drivers.length === 0 ? (
            <div className="alert alert-warning text-center mt-4" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>No drivers found!
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle">
                <thead className="bg-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Photo</th>
                    <th scope="col">Name</th>
                    <th scope="col">License No.</th>
                    <th scope="col">DOB</th>
                    <th scope="col">License</th>
                    <th scope="col">Status</th>
                    <th scope="col">Type</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.slice(0, visibleDrivers).map((driver, index) => (
                    <tr key={driver._id || `driver-${index}`}>
                      <td>{index + 1}</td>
                      <td>
                        <img 
                          src={driver?.image || "https://th.bing.com/th/id/OIP.OKJB0ZYbFTUVCdfsZHvpEwHaHa?rs=1&pid=ImgDetMain"} 
                          alt={driver.name} 
                          className="rounded-circle shadow-sm" 
                          style={{ width: "60px", height: "60px", objectFit: "cover" }} 
                        />
                      </td>
                      <td>{driver.name}</td>
                      <td>{driver.driverLicenseVerifyNumber}</td>
                      <td>{new Date(driver.DoB).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${driver.licenseStatus ? 'bg-success' : 'bg-danger'}`}>
                          {driver.licenseStatus ? "Valid" : "Invalid"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${driver.driverStatus ? 'bg-success' : 'bg-warning'}`}>
                          {driver.driverStatus ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{driver.licenseType}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-primary btn-sm me-1 shadow-sm" 
                            onClick={() => openModal(driver)}
                          >
                            <i className="bi bi-eye me-1"></i>View
                          </button>
                          <button 
                            className="btn btn-danger btn-sm shadow-sm" 
                            onClick={() => deleteDriver(driver._id)}
                          >
                            <i className="bi bi-trash me-1"></i>Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {visibleDrivers < drivers.length && (
            <div className="text-center mt-4 mb-4">
              <button 
                className="btn btn-outline-primary btn-lg shadow-sm" 
                onClick={() => setVisibleDrivers((prev) => prev + 10)}
              >
                <i className="bi bi-arrow-down-circle me-2"></i>Show More
              </button>
            </div>
          )}
        </div>
      </div>

      {modalOpen && selectedDriver && (
        <DriverDetailModal 
          driver={selectedDriver} 
          onClose={() => setModalOpen(false)} 
          onUpdate={updateDriver}
        />
      )}
    </div>
  );
};

export default DriverList;
