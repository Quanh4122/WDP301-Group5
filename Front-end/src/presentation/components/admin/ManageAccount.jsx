import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchPendingDriverApplications,
  ApproveDriverApplication,
  FetchApprovedDriverApplications,
  fetchRejectedDriverApplications,
} from "../redux/slices/Authentication";
import { FaCheck, FaTimes } from "react-icons/fa";
import Pagination from "../../components/home/components/Pagination";
import { Link } from "react-router-dom";

const ManageAccount = () => {
  const dispatch = useDispatch();
  const {
    pendingDriverApplications = [],
    approvedDriverApplications = [],
    rejectedDriverApplications = [],
    isLoading = false,
    user = null,
  } = useSelector((state) => state.auth || {});

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Hàm làm mới danh sách
  const refreshApplications = () => {
    dispatch(FetchPendingDriverApplications());
    dispatch(FetchApprovedDriverApplications());
    dispatch(fetchRejectedDriverApplications());
  };

  useEffect(() => {
    if (user?.role === "Admin") {
      refreshApplications();
    }
  }, [dispatch, user?.role]);

  // Kết hợp và lọc các ứng dụng tài xế
  const allApplications = [
    ...pendingDriverApplications,
    ...approvedDriverApplications,
    ...rejectedDriverApplications,
  ]; // Loại bỏ các tài khoản đã giáng cấp thành User

  const filteredApplications = allApplications.filter((application) => {
    const matchesFilter = filter === "all" || application.status === filter;
    const matchesSearch =
      searchTerm === "" ||
      application.user?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Xử lý phê duyệt/từ chối và làm mới danh sách
  const handleApplicationAction = (userId, status) => {
    dispatch(ApproveDriverApplication({ userId, status })).then(() => {
      refreshApplications(); // Làm mới danh sách sau khi hành động hoàn tất
    });
  };

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
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-bold text-gray-900">Quản Lý Danh Sách Tài Xế Ứng Tuyển</h1>
          <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
            Cập nhật: {new Date().toLocaleString("vi-VN")}
          </div>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm tên hoặc email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-800 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            className="w-full sm:w-48 py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-800 bg-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="pending">Đang chờ</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Bị từ chối</option>
          </select>
        </div>

        {paginatedApplications.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-gray-600 text-lg">Không tìm thấy dữ liệu phù hợp.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="py-4 px-6 text-center">Ảnh bằng lái</th>
                    <th className="py-4 px-6">Tên người dùng</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Vai trò</th>
                    <th className="py-4 px-6">Trạng thái</th>
                    <th className="py-4 px-6">Số bằng lái</th>
                    <th className="py-4 px-6">Kinh nghiệm</th>
                    <th className="py-4 px-6 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedApplications.map((application) => (
                    <tr
                      key={application._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-6 text-center">
                        {application.driversLicensePhoto ? (
                          <img
                            src={`http://localhost:3030${application.driversLicensePhoto}`}
                            alt="Ảnh bằng lái"
                            className="h-16 w-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                            onError={(e) =>
                              (e.currentTarget.src = "/fallback-image.png")
                            }
                          />
                        ) : (
                          <span className="text-gray-500 text-sm">N/A</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-900 font-medium">
                        <Link to={`/app/dashboard/manage-driver-accept/${application.user?._id}`} className="hover:text-sky-400">
                          <button>{application.user?.userName ?? "N/A"}</button>
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {application.user?.email ?? "N/A"}
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {application.user?.role?.roleName ?? "N/A"}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                            application.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : application.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {application.status === "approved"
                            ? "Đã duyệt"
                            : application.status === "rejected"
                            ? "Bị từ chối"
                            : "Đang chờ"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {application.licenseNumber ?? "N/A"}
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {application.experience ?? "N/A"}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {application.status === "pending" && (
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() =>
                                handleApplicationAction(application.user?._id, "approved")
                              }
                              className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-all duration-200 disabled:opacity-50 shadow-md"
                              disabled={isLoading}
                              title="Phê duyệt"
                            >
                              <FaCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleApplicationAction(application.user?._id, "rejected")
                              }
                              className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all duration-200 disabled:opacity-50 shadow-md"
                              disabled={isLoading}
                              title="Từ chối"
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-8"
        />
      </div>
    </div>
  );
};

export default ManageAccount;