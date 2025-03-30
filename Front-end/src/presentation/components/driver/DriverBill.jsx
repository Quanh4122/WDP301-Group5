import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const DriverBill = () => {
  const [driverRequests, setDriverRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const driverId = user?.userId;

  // Hàm ánh xạ trạng thái và thêm màu
  const getRequestStatusLabel = (status) => {
    switch (Number(status)) {
      case 2:
        return <span className="text-green-800 bg-green-200 px-2 py-1 rounded-full">Đã nhận cọc</span>;
      case 3:
        return <span className="text-green-600">Đến thời gian nhận xe</span>;
      case 4:
        return <span className="text-green-800 bg-green-200 px-2 py-1 rounded-full">Đang chạy</span>;
      case 5:
        return <span className="text-red-600">Đã hủy</span>;
      case 6:
        return <span className="text-orange-600 bg-orange-200 px-2 py-1 rounded-full">Kết thúc chuyến đi</span>;
      case 7:
        return <span className="text-green-800 bg-green-200 px-2 py-1 rounded-full">Khách hàng đã trả xe</span>;
      case 8:
        return <span className="text-green-800 bg-green-200 px-2 py-1 rounded-full">Đã thanh toán, đơn hoàn tất</span>;
      default:
        return <span className="text-red-600">Không xác định</span>;
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3030/request/getRequestsByDriverId?driverId=${driverId}`
        );
        setDriverRequests(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching requests");
      } finally {
        setIsLoading(false);
      }
    };

    if (driverId) {
      fetchRequests();
    } else {
      setError("Driver ID not found. Please log in.");
    }
  }, [driverId]);

  const fetchUserDetails = async (userId) => {
    setUserLoading(true);
    setUserError(null);
    try {
      const response = await axios.get(
        `http://localhost:3030/getUserById?key=${userId}`
      );
      setUserDetails(response.data);
    } catch (err) {
      setUserError(err.response?.data?.message || "Error fetching user details");
    } finally {
      setUserLoading(false);
    }
  };

  const showRequestDetails = (request) => {
    setSelectedRequest(request);
    const userId = request.user?._id || request.user;
    if (userId) {
      fetchUserDetails(userId);
    } else {
      setUserError("Không tìm thấy ID người dùng trong request");
    }
  };

  const closeRequestDetails = () => {
    setSelectedRequest(null);
    setUserDetails(null);
    setUserError(null);
  };

  // Chia danh sách theo nhóm trạng thái
  const runningRequests = driverRequests.filter((req) => Number(req.requestStatus) === 4);
  const activeRequests = driverRequests.filter((req) => [2, 3].includes(Number(req.requestStatus)));
  const pendingReturnRequests = driverRequests.filter((req) => Number(req.requestStatus) === 6);
  const completedRequests = driverRequests.filter((req) => [7, 8].includes(Number(req.requestStatus)));
  const canceledRequests = driverRequests.filter((req) => Number(req.requestStatus) === 5);
  const unknownRequests = driverRequests.filter((req) => ![2, 3, 4, 5, 6, 7, 8].includes(Number(req.requestStatus)));

  // Hàm render bảng dữ liệu
  const renderTable = (requests, title, isHighlighted = false, showId = true) => {
    if (requests.length === 0) return null;
    return (
      <div className={`mb-8 ${isHighlighted ? "border-2 border-green-500 rounded-lg shadow-xl bg-green-50" : ""}`}>
        <h2
          className={`text-2xl font-semibold mb-4 ${
            isHighlighted ? "text-green-700 inline-block px-4 py-2 rounded-md" : "text-gray-800"
          }`}
        >
          {title}
        </h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {showId && <th className="py-4 px-6">ID</th>}
                  <th className="py-4 px-6">Người Dùng</th>
                  <th className="py-4 px-6">Ngày Bắt Đầu</th>
                  <th className="py-4 px-6">Ngày Kết Thúc</th>
                  <th className="py-4 px-6">Trạng Thái</th>
                  <th className="py-4 px-6">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map((request, index) => (
                  <tr key={request._id} className="hover:bg-gray-50 transition-colors duration-200">
                    {showId && <td className="py-4 px-6 text-gray-900 font-medium">{index + 1}</td>}
                    <td className="py-4 px-6 text-gray-700">{request.user?.userName || "N/A"}</td>
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
                    <td className="py-4 px-6 text-gray-700">
                      {getRequestStatusLabel(request.requestStatus)}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => showRequestDetails(request)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (!isLoggedIn || !driverId) {
    return (
      <div className="mt-20 mb-20 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600 text-lg">Vui lòng đăng nhập để xem yêu cầu của bạn.</p>
        </div>
      </div>
    );
  }

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

        {/* Render các nhóm trạng thái */}
        {renderTable(runningRequests, "Đang Chạy", true, false)} {/* Bỏ ID */}
        {renderTable(activeRequests, "Yêu Cầu Sắp Tới")}
        {renderTable(pendingReturnRequests, "Yêu Cầu Chờ Trả Xe")}
        {renderTable(completedRequests, "Yêu Cầu Hoàn Tất")}
        {renderTable(canceledRequests, "Yêu Cầu Đã Hủy")}
        {renderTable(unknownRequests, "Yêu Cầu Không Xác Định")}

        {/* Modal chi tiết */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-modal-open">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Chi Tiết Yêu Cầu</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Thông Tin Người Đặt</h3>
                {userLoading ? (
                  <p className="text-gray-500">Đang tải thông tin người dùng...</p>
                ) : userError ? (
                  <p className="text-red-600">Lỗi: {userError}</p>
                ) : userDetails ? (
                  <ul className="space-y-2">
                    <li><strong className="text-gray-600">Tên đăng nhập:</strong> <span className="text-gray-800">{userDetails.userName || "N/A"}</span></li>
                    <li><strong className="text-gray-600">Email:</strong> <span className="text-gray-800">{userDetails.email || "N/A"}</span></li>
                    <li><strong className="text-gray-600">Số điện thoại:</strong> <span className="text-gray-800">{userDetails.phoneNumber || "N/A"}</span></li>
                  </ul>
                ) : (
                  <p className="text-gray-500">Không có thông tin</p>
                )}
              </div>

              <div className="mb-6 border-t pt-4">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Thông Tin Chuyến Xe</h3>
                <ul className="space-y-2">
                  <li><strong className="text-gray-600">Trạng Thái:</strong> {getRequestStatusLabel(selectedRequest.requestStatus)}</li>
                  <li><strong className="text-gray-600">Ngày Bắt Đầu:</strong> <span className="text-gray-800">{selectedRequest.startDate ? new Date(selectedRequest.startDate).toLocaleString("vi-VN") : "N/A"}</span></li>
                  <li><strong className="text-gray-600">Ngày Kết Thúc:</strong> <span className="text-gray-800">{selectedRequest.endDate ? new Date(selectedRequest.endDate).toLocaleString("vi-VN") : "N/A"}</span></li>
                  <li><strong className="text-gray-600">Địa Điểm Nhận:</strong> <span className="text-gray-800">{selectedRequest.pickUpLocation || "N/A"}</span></li>
                  <li><strong className="text-gray-600">Yêu Cầu Tài Xế:</strong> <span className="text-gray-800">{selectedRequest.isRequestDriver ? "Có" : "Không"}</span></li>
                  <li><strong className="text-gray-600">Email Yêu Cầu:</strong> <span className="text-gray-800">{selectedRequest.emailRequest || "N/A"}</span></li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Thông Tin Xe</h3>
                {selectedRequest.car?.length > 0 ? (
                  <ul className="list-disc ml-6 space-y-2 text-gray-800">
                    {selectedRequest.car.map((car, idx) => (
                      <li key={idx}>
                        {car.carName} (Biển số: {car.licensePlateNumber}, Giá: {car.price?.toLocaleString("vi-VN")} VND)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Không có xe</p>
                )}
              </div>

              <button
                onClick={closeRequestDetails}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-modal-open {
          animation: fadeInUp 0.3s ease-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DriverBill;