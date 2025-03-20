import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCar, FaHistory } from "react-icons/fa"; // Icon cho giao diện
import Pagination from "../../components/home/components/Pagination";
import { fetchDriverData, updateDriverStatus } from "../redux/slices/DriverSlice"; // Giả định các action Redux

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const { driverData, isLoading } = useSelector((state) => state.driver || {});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [status, setStatus] = useState(driverData?.status || "không sẵn sàng");

  // Gọi API để lấy dữ liệu driver khi component mount
  useEffect(() => {
    dispatch(fetchDriverData());
  }, [dispatch]);

  // Cập nhật trạng thái khi driverData thay đổi
  useEffect(() => {
    if (driverData) {
      setStatus(driverData.status);
    } else {
      console.log("Chưa có dữ liệu driver để hiển thị.");
    }
  }, [driverData]);

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    dispatch(updateDriverStatus(newStatus));
  };

  const pastTrips = driverData?.pastTrips || [];
  const currentTrip = driverData?.currentTrip || null;

  const totalPages = Math.ceil(pastTrips.length / itemsPerPage);
  const paginatedTrips = pastTrips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Hiển thị loading khi dữ liệu đang tải
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex items-center gap-3 p-5 bg-white rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600"></div>
          <span className="text-lg text-gray-700 font-semibold">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 mb-20 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900">Driver Dashboard</h1>
          <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
            Cập nhật: {new Date().toLocaleString("vi-VN")}
          </div>
        </header>

        {/* Phần trạng thái */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">Trạng thái hiện tại</h2>
            <p className="text-gray-600">{status}</p>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">Cập nhật trạng thái</h2>
            <select
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-800 bg-white"
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="sẵn sàng">Sẵn sàng</option>
              <option value="không sẵn sàng">Không sẵn sàng</option>
            </select>
          </div>
        </div>

        {/* Chuyến xe đang lái */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Chuyến xe đang lái</h2>
          {currentTrip ? (
            <div className="flex items-center gap-4">
              <FaCar className="text-3xl text-blue-600" />
              <div>
                <p className="text-gray-800 font-medium">{currentTrip.carName}</p>
                <p className="text-gray-600">Từ {currentTrip.startDate} đến {currentTrip.endDate}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Chưa có chuyến xe nào</p>
          )}
        </div>

        {/* Lịch sử chuyến xe */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-800 p-6">Lịch sử chuyến xe</h2>
          {pastTrips.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600 text-lg">Chưa có chuyến xe nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="py-4 px-6">Tên xe</th>
                    <th className="py-4 px-6">Ngày bắt đầu</th>
                    <th className="py-4 px-6">Ngày kết thúc</th>
                    <th className="py-4 px-6">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedTrips.map((trip) => (
                    <tr
                      key={trip._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-6 text-gray-900 font-medium">{trip.carName}</td>
                      <td className="py-4 px-6 text-gray-700">{trip.startDate}</td>
                      <td className="py-4 px-6 text-gray-700">{trip.endDate}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                            trip.status === "hoàn thành"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Phân trang */}
        {pastTrips.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-8"
          />
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;