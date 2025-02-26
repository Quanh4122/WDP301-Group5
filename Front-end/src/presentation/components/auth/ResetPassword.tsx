import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { NewPassword } from "../redux/slices/Authentication";
import { Eye, EyeOff } from "lucide-react"; 

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useSelector((state: any) => state.auth);
  const [message, setMessage] = useState("");
  const [error, setError] = useState({ password: "", confirmPassword: "" });

  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromURL = queryParams.get("token");
    if (tokenFromURL) {
      setToken(tokenFromURL);
    } else {
      setMessage("Không tìm thấy token! Vui lòng kiểm tra lại email.");
    }
  }, [location.search]);

  const handleReset = async () => {
    setMessage("");
    setError({ password: "", confirmPassword: "" });

    if (!token) {
      setMessage("Không có token hợp lệ.");
      return;
    }
    if (password.length < 6) {
      setError((prev) => ({ ...prev, password: "Mật khẩu phải có ít nhất 6 ký tự." }));
      return;
    }
    if (password !== confirmPassword) {
      setError((prev) => ({ ...prev, confirmPassword: "Mật khẩu xác nhận không khớp." }));
      return;
    }

    dispatch<any>(NewPassword({ token, password, passwordConfirm: confirmPassword }))
      .then(() => {
        setMessage("Mật khẩu đã được đặt lại thành công!");
        setTimeout(() => navigate("/app/sign-in"), 2000); 
      })
      .catch((err: any) => {
        setMessage(`${err.message}`);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          🔑 Đặt lại mật khẩu
        </h2>
        <p className="text-sm text-gray-500 text-center mb-4">
          Nhập mật khẩu mới của bạn.
        </p>

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
        </div>

        {/* Input Xác nhận mật khẩu */}
        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Xác nhận mật khẩu"
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {error.confirmPassword && <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>}
        </div>

        {/* Nút xác nhận */}
        <button
          onClick={handleReset}
          disabled={isLoading || !password || !confirmPassword}
          className={`w-full p-3 rounded-lg text-white font-semibold transition-all duration-300 ${
            password && confirmPassword
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? "⏳ Đang xử lý..." : "Xác nhận"}
        </button>

        {/* Hiển thị thông báo */}
        {message && (
          <p
            className={`mt-3 text-center font-semibold ${
              message.includes("thành công") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
