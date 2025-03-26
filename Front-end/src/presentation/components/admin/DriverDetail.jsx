import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  FetchPendingDriverApplications,
  ApproveDriverApplication,
  FetchApprovedDriverApplications,
  fetchRejectedDriverApplications,
} from "../redux/slices/Authentication";
import { FaCheck, FaTimes } from "react-icons/fa";

const DriverDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    pendingDriverApplications = [],
    approvedDriverApplications = [],
    rejectedDriverApplications = [],
    isLoading = false,
    user = null,
  } = useSelector((state) => state.auth || {});


  // Gọi API để lấy danh sách tài xế khi component mount
  useEffect(() => {
    if (user?.role === "Admin") {
      dispatch(FetchPendingDriverApplications());
      dispatch(FetchApprovedDriverApplications());
      dispatch(fetchRejectedDriverApplications());
    }
  }, [dispatch, user?.role]);

  // Kết hợp tất cả các ứng dụng tài xế
  const allApplications = [
    ...pendingDriverApplications,
    ...approvedDriverApplications,
    ...rejectedDriverApplications,
  ];

  // Tìm ứng dụng tài xế dựa trên ID
  const driverApplication = allApplications.find((app) => app.user._id === id);

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

  if (!driverApplication) {
    return (
      <div className="mt-20 mb-20 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl text-center">
          <p className="text-gray-600 text-lg font-medium">Không tìm thấy thông tin tài xế.</p>
          <Link
            to="/app/dashboard/manage-account"
            className="mt-6 inline-block bg-gradient-to-r from-sky-500 to-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:from-sky-600 hover:to-blue-700 transition-all duration-300"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const handleApprove = () => {
    dispatch(
      ApproveDriverApplication({
        userId: driverApplication.user?._id,
        status: "approved",
      })
    );
  };

  const handleReject = () => {
    dispatch(
      ApproveDriverApplication({
        userId: driverApplication.user?._id,
        status: "rejected",
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Chi Tiết Tài Xế</h1>
          <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
            Cập nhật: {new Date().toLocaleString("vi-VN")}
          </div>
        </header>

        {/* Driver Details */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 flex items-center gap-6">
            {/* Driver License Photo */}
            <div className="w-32 h-20 rounded-lg bg-gray-200 flex items-center justify-center shadow-md">
              {driverApplication.driversLicensePhoto ? (
                <img
                  src={`http://localhost:3030${driverApplication.driversLicensePhoto}`}
                  alt="Ảnh bằng lái"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => (e.currentTarget.src = "/fallback-image.png")}
                />
              ) : (
                <span className="text-gray-500">N/A</span>
              )}
            </div>
            {/* Driver Name and Status */}
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {driverApplication.user?.userName ?? "N/A"}
              </h2>
              <span
                className={`inline-flex mt-1 px-3 py-1 text-sm font-medium rounded-full text-white ${driverApplication.status === "approved"
                    ? "bg-green-800"
                    : driverApplication.status === "rejected"
                      ? "bg-red-800"
                      : "bg-yellow-800"
                  }`}
              >
                {driverApplication.status === "approved"
                  ? "Đã duyệt"
                  : driverApplication.status === "rejected"
                    ? "Bị từ chối"
                    : "Đang chờ"}
              </span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Thông Tin Cơ Bản */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông Tin Cơ Bản</h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-center">
                  <span className="w-32 font-medium">Email:</span>
                  <span>{driverApplication.user?.email ?? "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 font-medium">Vai trò:</span>
                  <span>{driverApplication.user?.role?.roleName ?? "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 font-medium">Số bằng lái:</span>
                  <span>{driverApplication.licenseNumber ?? "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 font-medium">Kinh nghiệm:</span>
                  <span>{driverApplication.experience ?? "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Hành Động */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Hành Động</h3>
              <div className="space-y-4">
                {driverApplication.status === "pending" && (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleApprove}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-medium shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      <FaCheck className="inline mr-2" /> Phê duyệt
                    </button>
                    <button
                      onClick={handleReject}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg font-medium shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      <FaTimes className="inline mr-2" /> Từ chối
                    </button>
                  </div>
                )}
                <Link
                  to="/app/dashboard/manage-account"
                  className="block w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-2 px-4 rounded-lg text-center font-medium shadow-md hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
                >
                  Quay lại danh sách
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDetail;