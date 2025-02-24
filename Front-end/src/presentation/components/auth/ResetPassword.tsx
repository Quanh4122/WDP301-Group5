import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NewPassword } from "../redux/slices/Authentication";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: any) => state.auth);
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    if (password.length < 6) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    dispatch<any>(NewPassword({ password }))
      .then(() => {
        setMessage("Mật khẩu đã được đặt lại thành công!");
      })
      .catch(() => {
        setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Đặt lại mật khẩu
        </h2>
        <p className="text-sm text-gray-500 text-center mb-4">
          Nhập mật khẩu mới của bạn.
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu mới"
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Xác nhận mật khẩu"
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
        />

        <button
          onClick={handleReset}
          disabled={isLoading || !password || !confirmPassword}
          className={`w-full mt-4 p-2 rounded-md text-white font-semibold 
            ${password && confirmPassword ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
        >
          {isLoading ? "Đang xử lý..." : "Xác nhận"}
        </button>

        {message && (
          <p className={`mt-3 text-center font-semibold ${message.includes("thành công") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
