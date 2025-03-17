import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import { PRIVATE_ROUTES } from "../../routes/CONSTANTS";

const UserProfile: React.FC = () => {
  const { user, isLoggedIn, loginMethod } = useSelector((state: RootState) => state.auth) as {
    isLoggedIn: boolean;
    loginMethod: string | null;
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

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl mt-20 mb-20">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Hồ sơ người dùng</h2>
        {isLoggedIn && user ? (
          <>
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0 mb-8">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-sky-200 shadow-md"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center shadow-md">
                  <PersonIcon style={{ width: 60, height: 60, color: "#6B7280" }} />
                </div>
              )}
              <div className="text-center md:text-left">
                <p className="text-2xl font-semibold text-gray-900">{userNamePreview || "Người dùng"}</p>
                <p className="text-gray-600 text-lg">{user.email || "Chưa cập nhật email"}</p>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-inner">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Thông tin cá nhân</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-center">
                  <span className="w-32 font-medium text-gray-900">Tên đầy đủ:</span>
                  <span>{user.fullName || "Chưa cập nhật"}</span>
                </li>
                <li className="flex items-center">
                  <span className="w-32 font-medium text-gray-900">Số điện thoại:</span>
                  <span>{user.phoneNumber || "Chưa cập nhật"}</span>
                </li>
                <li className="flex items-center">
                  <span className="w-32 font-medium text-gray-900">Địa chỉ:</span>
                  <span>{user.address || "Chưa cập nhật"}</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
              <Link
                to={`/app/edit-profile/${userIdPreview}`}
                className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg text-center"
              >
                <button>Cập nhật thông tin</button>
              </Link>
              {loginMethod !== "google" && (
                <Link
                  to={`/app/change-password/${userIdPreview}`}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg text-center"
                >
                  <button>Đổi mật khẩu</button>
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">Vui lòng đăng nhập để xem hồ sơ.</p>
            <Link
              to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.SIGN_IN}`}
              className="mt-4 inline-block bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              <button>Đăng nhập</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;