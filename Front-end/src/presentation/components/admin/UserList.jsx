import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa"; // Thay FaUserShield/FaUserTimes bằng FaEdit
import Pagination from "../../components/home/components/Pagination";
import { fetchUsersAndDrivers } from "../redux/slices/Authentication";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate để điều hướng

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook để điều hướng
  const {
    usersAndDrivers = [],
    isLoading = false,
  } = useSelector((state) => state.auth || {});

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchUsersAndDrivers());
  }, [dispatch]);

  const filteredUsers = usersAndDrivers.filter((user) => {
    const matchesFilter = filter === "all" || user.role?.roleName === filter;
    const matchesSearch =
      searchTerm === "" ||
      user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEditClick = (userId) => {
    navigate(`/app/change-role/${userId}`); // Điều hướng đến trang ChangeRoleAccount với userId
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
        {/* Header */}
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900">Danh Sách Người Dùng</h1>
          <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
            Cập nhật: {new Date().toLocaleString("vi-VN")}
          </div>
        </header>

        {/* Filters */}
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
            <option value="User">Người dùng</option>
            <option value="Driver">Tài xế</option>
          </select>
        </div>

        {/* Table */}
        {paginatedUsers.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-gray-600 text-lg">Không tìm thấy người dùng phù hợp.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="py-4 px-6">Tên người dùng</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Vai trò</th>
                    <th className="py-4 px-6">Ngày đăng ký</th>
                    <th className="py-4 px-6 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-6 text-gray-900 font-medium">
                        {user.userName ?? "N/A"}
                      </td>
                      <td className="py-4 px-6 text-gray-700">{user.email ?? "N/A"}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                            user.role?.roleName === "Admin"
                              ? "bg-blue-100 text-blue-700"
                              : user.role?.roleName === "Driver"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.role?.roleName ?? "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center gap-3">
                          <Link
                            to={`/app/dashboard/change-role/${user._id}`}
                            className="bg-yellow-600 text-white p-2 rounded-full hover:bg-yellow-700 transition-all duration-200 disabled:opacity-50 shadow-md"
                            disabled={isLoading}
                            title="Chỉnh sửa vai trò"
                          >
                            <FaEdit className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
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

export default UserList;