import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditPassword } from "../redux/slices/Authentication";
import { RootState } from "../redux/Store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword: React.FC = () => {
  const dispatch = useDispatch<any>();
  const userId = useSelector((state: RootState) => (state.auth.user as { userId: string } | null)?.userId);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Người dùng không hợp lệ, vui lòng đăng nhập lại!");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      console.log("Gửi request đổi mật khẩu với userId:", userId);
      const response = await dispatch(EditPassword(userId, { currentPassword, newPassword, confirmPassword })).unwrap();
      
      if (response?.success) {
        toast.success("Thay đổi mật khẩu thành công!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } 
    } catch (err: any) {
      console.error("Lỗi đổi mật khẩu:", err);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");}
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg mb-20">
      <h2 className="text-2xl font-bold text-center mb-4">Thay đổi mật khẩu</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Mật khẩu hiện tại</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block font-semibold">Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block font-semibold">Xác nhận mật khẩu</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          disabled={isLoading}
        >
          {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
