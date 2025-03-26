import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

const CarDetails = () => {
  const { id } = useParams(); // Lấy car ID từ URL
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Chỉ số ảnh hiện tại

  useEffect(() => {
    const fetchCarDetails = () => {
      try {
        setLoading(true);
        const carsData = JSON.parse(localStorage.getItem("carsData") || "[]");
        const foundCar = carsData.find((car) => car._id === id);

        if (foundCar) {
          setCar(foundCar);
        } else {
          throw new Error("Car not found");
        }
      } catch (error) {
        toast.error("Không thể tải thông tin xe. Vui lòng quay lại danh sách xe!", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  // Tự động chuyển ảnh mỗi 3 giây
  useEffect(() => {
    if (car && car.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === car.images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // Chuyển mỗi 3 giây
      return () => clearInterval(interval); // Dọn dẹp khi component unmount
    }
  }, [car]);

  // Helper functions
  const getTransmissionLabel = (value) => (value ? "Số tự động" : "Số sàn");
  const getFlueLabel = (value) => {
    const flueMap = {
      1: "Máy Xăng",
      2: "Máy Dầu",
      3: "Máy Điện",
    };
    return flueMap[value] || "Không xác định";
  };
  const getBunkBedLabel = (value) => (value ? "Có giường tầng" : "Không có giường tầng");

  // Xử lý nhấp vào chấm để chuyển ảnh
  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="mt-20 mb-20 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 text-lg">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="mt-20 mb-20 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 text-lg">Không tìm thấy thông tin xe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 mb-20 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* Carousel ở đầu */}
        {car.images.length > 0 && (
          <div className="mb-6 relative">
            {/* Ảnh hiện tại */}
            <img
              src={car.images[currentImageIndex]}
              alt={`${car.carName} - ${currentImageIndex}`}
              className="w-full h-64 object-cover rounded-lg shadow-sm"
            />
            {/* Chấm điều hướng */}
            {car.images.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                {car.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-2 h-2 rounded-full ${
                      currentImageIndex === index ? "bg-sky-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tiêu đề */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Chi Tiết Xe: {car.carName}
        </h1>

        {/* Thông tin chi tiết */}
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>Tên xe:</strong> {car.carName}
          </p>
          <p>
            <strong>Phiên bản:</strong> {car.carVersion}
          </p>
          <p>
            <strong>Màu sắc:</strong> {car.color}
          </p>
          <p>
            <strong>Biển số:</strong> {car.licensePlateNumber}
          </p>
          <p>
            <strong>Số chỗ:</strong> {car.numberOfSeat}
          </p>
          <p>
            <strong>Giá (VNĐ/h):</strong>{" "}
            <span className="text-sky-600 font-medium">{car.price.toLocaleString()}</span>
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            {car.carStatus ? "Hoạt động" : "Không hoạt động"}
          </p>
          <p>
            <strong>Loại truyền động:</strong>{" "}
            {getTransmissionLabel(car.carType.transmissionType)}
          </p>
          <p>
            <strong>Nhiên liệu:</strong> {getFlueLabel(car.carType.flue)}
          </p>
          <p>
            <strong>Giường tầng:</strong> {getBunkBedLabel(car.carType.bunkBed)}
          </p>
        </div>

        {/* Nút quay lại */}
        <Link
          to="/app/dashboard/manager-car"
          className="mt-6 inline-block bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-200"
        >
          Quay lại
        </Link>
      </div>
    </div>
  );
};

export default CarDetails;