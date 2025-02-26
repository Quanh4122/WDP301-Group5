import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditPassword } from "../redux/slices/Authentication";
import { RootState } from "../redux/Store";
import { ToastContainer, toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react"; 
import { TextField, IconButton, InputAdornment } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword: React.FC = () => {
  const dispatch = useDispatch<any>();
  const userId = useSelector((state: RootState) => (state.auth.user as { userId: string } | null)?.userId);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State để kiểm soát hiển thị mật khẩu
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg mb-20">
      <h2 className="text-2xl font-bold text-center mb-4">Thay đổi mật khẩu</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mật khẩu hiện tại */}
        <TextField
          fullWidth
          label="Mật khẩu hiện tại"
          type={showCurrentPassword ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} edge="end">
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Mật khẩu mới */}
        <TextField
          fullWidth
          label="Mật khẩu mới"
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Xác nhận mật khẩu */}
        <TextField
          fullWidth
          label="Xác nhận mật khẩu"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

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
