import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../redux/Store";
import { RootState } from "../redux/Store";
import { UpdateProfile } from "../redux/slices/Authentication";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const EditProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user) as {
    userId: string;
    userName: string;
    fullName: string;
    phoneNumber: string;
    address: string;
    avatar: string;
  } | null;

  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    fullName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || "",
    address: user?.address || "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(`http://localhost:3030${user.avatar}`);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string); // 🟢 Cập nhật preview ngay lập tức
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.userId) {
      toast.error("Lỗi: userId không tồn tại!");
      console.error("Lỗi: userId không tồn tại!");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("userName", formData.userName);
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("address", formData.address);

    if (avatarFile) {
      formDataToSend.append("avatar", avatarFile);
    }

    console.log("Dữ liệu gửi đi:", Object.fromEntries(formDataToSend.entries()));

    try {
      await dispatch(UpdateProfile(user.userId, formDataToSend));
      toast.success("Cập nhật hồ sơ thành công!");
      navigate(`/app/profile/${user?.userId}`);
    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-20 mb-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Chỉnh sửa hồ sơ</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="w-32 h-32 mx-auto rounded-full border object-cover"
            />
          )}
          <label className="block font-semibold">Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
          />
        </div>
        <div>
          <label className="block font-semibold">Username</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-semibold">Tên đầy đủ</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-semibold">Số điện thoại</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-semibold">Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <button type="submit"
            className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              Save
          </button>
          {' '}
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
