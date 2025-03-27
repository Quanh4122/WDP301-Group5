import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  fetchUsersAndDrivers,
  UpdateUserRole,
} from "../redux/slices/Authentication";
import { toast } from "react-toastify";

const ChangeRoleAccount = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    usersAndDrivers = [],
    isLoading = false,
    error = null,
  } = useSelector((state) => state.auth || {});

  const user = usersAndDrivers.find((u) => u._id === userId);
  const [selectedRole, setSelectedRole] = useState(user?.role?.roleName || "");

  useEffect(() => {
    if (!usersAndDrivers.length) {
      dispatch(fetchUsersAndDrivers());
    }
  }, [dispatch, usersAndDrivers.length]);

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role?.roleName || "User");
    }
  }, [user]);

  const handleRoleChange = () => {
    if (selectedRole && selectedRole !== user?.role?.roleName) {
      dispatch(UpdateUserRole(userId, selectedRole))
        .then(() => {
          toast.success(`Cập nhật vai trò ${user.fullName} thành công!`);
          navigate("/app/dashboard/manage-account");
        })
        .catch((err) => {
          console.error("Failed to update role:", err);
        });
    }
  };

  const handleBack = () => {
    navigate("/app/dashboard/manage-account");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex items-center gap-3 p-5 bg-white rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600"></div>
          <span className="text-lg text-gray-700 font-semibold">
            Đang tải...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Không tìm thấy người dùng.</p>
      </div>
    );
  }

  return (
    <div className=" mt-20 mb-20 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 flex-1 text-center">
            Chi tiết tài khoản
          </h1>
        </header>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* User Info */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Thông tin người dùng: {user.userName}
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                <strong className="font-medium">Email:</strong>{" "}
                <span className="text-gray-600">{user.email ?? "N/A"}</span>
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Vai trò hiện tại:</strong>{" "}
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
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Ngày đăng ký:</strong>{" "}
                <span className="text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </p>
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">
              Chọn vai trò mới:
            </label>
            <select
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-800 bg-white shadow-sm"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="User">Người dùng</option>
              <option value="Driver">Tài xế</option>
            </select>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={handleBack}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium shadow-sm"
            >
              Hủy
            </button>
            <button
              onClick={handleRoleChange}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 font-medium shadow-sm"
              disabled={isLoading || selectedRole === user.role?.roleName}
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeRoleAccount;
