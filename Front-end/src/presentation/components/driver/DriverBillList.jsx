import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const DriverBill = () => {
  const [driverRequests, setDriverRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get driver ID from Redux auth slice
  const driverId = useSelector((state) => state.auth.user?._id);

  useEffect(() => {
    const fetchRequests = async () => {
      console.log("Fetching requests for driverId:", driverId);
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3030/api/getRequestsByDriverId?driverId=${driverId}`
        );
        console.log("API Response:", response.data);
        setDriverRequests(response.data);
      } catch (err) {
        console.error("Fetch Error:", err.response || err);
        setError(err.response?.data?.message || "Error fetching requests");
      } finally {
        setIsLoading(false);
      }
    };

    if (driverId) {
      fetchRequests();
    } else {
      console.log("No driverId found");
      setError("Driver ID not found. Please log in.");
    }
  }, [driverId]);

  console.log("Current driverRequests:", driverRequests);

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

  if (error) {
    return (
      <div className="mt-20 mb-20 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-4xl font-extrabold text-gray-900">Yêu Cầu Của Tôi</h1>
          </header>
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-red-600 text-lg">Có lỗi xảy ra: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!driverRequests || driverRequests.length === 0) {
    return (
      <div className="mt-20 mb-20 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-4xl font-extrabold text-gray-900">Yêu Cầu Của Tôi</h1>
          </header>
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-gray-600 text-lg">Không có yêu cầu nào được giao cho bạn.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 mb-20 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900">Yêu Cầu Của Tôi</h1>
        </header>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="py-4 px-6">Mã Yêu Cầu</th>
                  <th className="py-4 px-6">Người Dùng</th>
                  <th className="py-4 px-6">Xe</th>
                  <th className="py-4 px-6">Ngày Bắt Đầu</th>
                  <th className="py-4 px-6">Ngày Kết Thúc</th>
                  <th className="py-4 px-6">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {driverRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-4 px-6 text-gray-900 font-medium">{request._id}</td>
                    <td className="py-4 px-6 text-gray-700">{request.user?.userName || "N/A"}</td>
                    <td className="py-4 px-6 text-gray-700">
                      {request.car?.length > 0 ? request.car[0].carName : "N/A"}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {request.startDate
                        ? new Date(request.startDate).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {request.endDate
                        ? new Date(request.endDate).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </td>
                    <td className="py-4 px-6 text-gray-700">{request.requestStatus || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverBill;