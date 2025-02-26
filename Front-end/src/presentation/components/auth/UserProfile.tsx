import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { Link } from "react-router-dom";

const UserProfile: React.FC = () => {
  const { user, email } = useSelector((state: RootState) => state.auth) as
    {
      user: { userId: string; userName: string; avatar?: string; fullName?: string; phoneNumber?: string; address?: string } | null;
      email: string | null;
    };


  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg">Bạn chưa đăng nhập!</p>
        <Link
          to="/login"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }
  console.log("Avatar URL:", user.avatar);


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-20 mb-20">
      <h2 className="text-2xl font-bold mb-4">Hồ sơ người dùng</h2>
      <div className="flex items-center space-x-4">
        <img src={`http://localhost:3030${user.avatar}`} alt="Avatar" />

        <div>
          <p className="text-xl font-semibold">{user.userName}</p>
          <p className="text-gray-600">{email}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
        <ul className="mt-2 space-y-2">
          <li><strong>Tên đầy đủ:</strong> {user.fullName || "Chưa cập nhật"}</li>
          <li><strong>Số điện thoại:</strong> {user.phoneNumber || "Chưa cập nhật"}</li>
          <li><strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}</li>
        </ul>
      </div>

      <div className="mt-6 flex space-x-4">
        <Link to={`/app/edit-profile/${user.userId}`} className="px-4 py-2 bg-green-500 text-white rounded-md">
          <button>Edit Profile</button>
        </Link>
        <Link
          to={`/app/change-password/${user.userId}`}
          type="submit"
          className=" px-4 py-2 bg-violet-400 text-white rounded-md hover:bg-violet-500 transition"
        >
          <button>Change Password</button>
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;
