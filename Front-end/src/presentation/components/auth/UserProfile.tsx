import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";

const UserProfile: React.FC = () => {
  const { user, isLoggedIn, loginMethod } = useSelector((state: RootState) => state.auth) as {
    isLoggedIn: boolean;
    loginMethod: string | null; // Thêm loginMethod vào type
    user: {
      userId: string;
      userName: string;
      avatar?: string;
      fullName?: string;
      phoneNumber?: string;
      address?: string;
      email?: string;
    } | null;
  };

  console.log("User:", user, "Login Method:", loginMethod);

  const [avatarPreview, setAvatarPreview] = useState("");
  const [userIdPreview, setUserIdPreview] = useState("");
  const [userNamePreview, setUserNamePreview] = useState("");

  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.avatar) {
        setAvatarPreview(
          user.avatar.startsWith("http") ? user.avatar : `http://localhost:3030${user.avatar}`
        );
      } else {
        setAvatarPreview("");
      }
      setUserIdPreview(user.userId || "");
      setUserNamePreview(user.userName || "");
    } else {
      setAvatarPreview("");
      setUserIdPreview("");
      setUserNamePreview("");
    }
  }, [user, isLoggedIn]);

  console.log("Avatar URL:", avatarPreview);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-20 mb-20">
      <h2 className="text-2xl font-bold mb-4">Hồ sơ người dùng</h2>
      {isLoggedIn && user ? (
        <>
          <div className="flex items-center space-x-4">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-36 h-36 rounded-full" />
            ) : (
              <PersonIcon style={{ width: 50, height: 50 }} />
            )}
            <div>
              <p className="text-xl font-semibold">{userNamePreview || "Người dùng"}</p>
              <p className="text-gray-600">{user.email || "Chưa cập nhật email"}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <strong>Tên đầy đủ:</strong> {user.fullName || "Chưa cập nhật"}
              </li>
              <li>
                <strong>Số điện thoại:</strong> {user.phoneNumber || "Chưa cập nhật"}
              </li>
              <li>
                <strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}
              </li>
            </ul>
          </div>

          <div className="mt-6 flex space-x-4">
            <Link
              to={`/app/edit-profile/${userIdPreview}`}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              <button>Cập nhật thông tin</button>
            </Link>
            {/* Chỉ hiển thị nút Change Password nếu không đăng nhập bằng Google */}
            {loginMethod !== "google" && (
              <Link
                to={`/app/change-password/${userIdPreview}`}
                className="px-4 py-2 bg-violet-400 text-white rounded-md hover:bg-violet-500 transition"
              >
                <button>Đổi mật khẩu</button>
              </Link>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600">Vui lòng đăng nhập để xem hồ sơ.</p>
      )}
    </div>
  );
};

export default UserProfile;