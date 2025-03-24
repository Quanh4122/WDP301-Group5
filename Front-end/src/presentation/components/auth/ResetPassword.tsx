import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { NewPassword } from "../redux/slices/Authentication";
import { Eye, EyeOff, Key } from "lucide-react"; 
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useSelector((state: any) => state.auth);

  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromURL = queryParams.get("token");
    if (tokenFromURL) {
      setToken(tokenFromURL);
    } 
  }, [location.search]);

  const handleReset = async () => {

    dispatch<any>(NewPassword({ token, password, passwordConfirm: confirmPassword }))
      .then(() => {
        toast.success("Đặt lại mật khẩu thành công!");
        navigate("/app/sign-in")
      })
      .catch((err: any) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          <Key size={20} className="inline-block mr-2" /> Đặt lại mật khẩu
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
        </div>

        {/* Nút xác nhận */}
        <button
          onClick={handleReset}
          className={`w-full p-3 rounded-lg text-white font-semibold transition-all duration-300 bg-blue-500 hover:bg-blue-700`}
        >
          {isLoading ? "Đang xử lý..." : "Xác nhận"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
