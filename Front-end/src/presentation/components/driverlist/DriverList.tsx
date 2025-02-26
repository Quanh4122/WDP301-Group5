import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import DriverDetailModal from "./DriverDetailModal";

const DriverList = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [visibleDrivers, setVisibleDrivers] = useState(9); // Start with 9 drivers
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getListDrivers();
  }, []);

  const getListDrivers = async () => {
    try {
      const res = await axiosInstance.get("/driver");
      setDrivers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const openModal = (driver: any) => {
    setSelectedDriver(driver);
    setModalOpen(true);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Driver List</h1>

      {drivers.length === 0 ? (
        <div className="text-center mt-5">
          <h2 className="text-danger">No drivers found!</h2>
        </div>
      ) : (
        <>
          <div className="row">
            {drivers.slice(0, visibleDrivers).map((driver) => (
              <div key={driver._id} className="col-md-4 col-sm-6 mb-4">
                <div className="card shadow-lg p-3 position-relative">
                  <div className="d-flex align-items-center">
                    <img
                      src={driver.image}
                      alt={driver.name}
                      className="rounded-circle"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <div className="ms-3 flex-grow-1">
                      <h5 className="card-title mb-1">{driver.name}</h5>
                      <p className="card-text text-muted mb-1">Age: {driver.age}</p>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm mt-3 w-100"
                    onClick={() => openModal(driver)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button - Loads 21 more each time */}
          {visibleDrivers < drivers.length && (
            <div className="text-center mt-4 mb-5"> {/* Added extra bottom spacing */}
              <button
                className="btn btn-outline-primary"
                onClick={() => setVisibleDrivers((prev) => prev + 21)}
              >
                Show More
              </button>
            </div>
          )}
        </>
      )}

      {modalOpen && selectedDriver && (
        <DriverDetailModal driver={selectedDriver} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default DriverList;
