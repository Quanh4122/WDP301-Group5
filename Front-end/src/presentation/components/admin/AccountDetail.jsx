import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchUsersAndDrivers } from "../redux/slices/Authentication";
import { FaUser } from "react-icons/fa";

const AccountDetail = () => {
  const { id } = useParams(); // Lấy userId từ URL
  const dispatch = useDispatch();
  const { usersAndDrivers = [], isLoading = false } = useSelector((state) => state.auth || {});

  // Gọi API để lấy danh sách người dùng khi component mount
  useEffect(() => {
    dispatch(fetchUsersAndDrivers());
  }, [dispatch]);

  // Tìm người dùng dựa trên userId
  const user = usersAndDrivers.find((u) => u._id === id);

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

  if (!user) {
    return (
      <div className="mt-20 mb-20 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl text-center">
          <p className="text-gray-600 text-lg font-medium">Không tìm thấy thông tin người dùng.</p>
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

  const getAvatarUrl = (avatar) => {
    if (!avatar || avatar.trim() === "") {
      return null; // Không có ảnh, sẽ dùng icon
    }
    if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
      return avatar; // URL tuyệt đối từ Google hoặc bên ngoài
    }
    return `http://localhost:3030${avatar.startsWith("/") ? "" : "/"}${avatar}`; // Ảnh từ backend
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Chi Tiết Tài Khoản</h1>
          <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
            Cập nhật: {new Date().toLocaleString("vi-VN")}
          </div>
        </header>

        {/* User Details */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-semibold shadow-md">
              {getAvatarUrl(user.avatar) ? (
                <img
                  src={getAvatarUrl(user.avatar)}
                  alt={user.userName ?? "Người dùng"}
                  className="w-20 h-20 rounded-full object-cover mx-auto"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                  <FaUser className="text-gray-500 text-2xl" />
                </div>
              )}
            </div>
            {/* User Name and Role */}
            <div>
              <h2 className="text-2xl font-semibold text-white">{user.userName ?? "N/A"}</h2>
              <span
                className={`inline-flex mt-1 px-3 py-1 text-sm font-medium rounded-full text-white ${user.role?.roleName === "Admin"
                  ? "bg-blue-800"
                  : user.role?.roleName === "Driver"
                    ? "bg-green-800"
                    : "bg-gray-600"
                  }`}
              >
                {user.role?.roleName ?? "N/A"}
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
                  <span>{user.email ?? "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 font-medium">Ngày đăng ký:</span>
                  <span>{new Date(user.createdAt).toLocaleString("vi-VN")}</span>
                </div>
                {/* Thêm thông tin khác nếu có */}
                {user.phone && (
                  <div className="flex items-center">
                    <span className="w-32 font-medium">Số điện thoại:</span>
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Hành Động */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Hành Động</h3>
              <div className="space-y-4">
                <Link
                  to={`/app/dashboard/change-role/${user._id}`}
                  className="block w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 px-4 rounded-lg text-center font-medium shadow-md hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300"
                >
                  <button>Chỉnh sửa vai trò</button>
                </Link>
                <Link
                  to="/app/dashboard/manage-account"
                  className="block w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-2 px-4 rounded-lg text-center font-medium shadow-md hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
                >
                  <button>Quay lại danh sách</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;