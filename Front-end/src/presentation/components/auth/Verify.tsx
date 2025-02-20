import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VerifyEmail } from "../redux/slices/Authentication";
import { RootState } from "../redux/Store";

const Verify: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const dispatch = useDispatch();
  const { email, isLoading } = useSelector((state: RootState) => state.auth);

  const handleVerify = async () => {
    if (!email) {
      setMessage("Không tìm thấy email. Vui lòng đăng ký lại.");
      return;
    }

    try {
      await dispatch(VerifyEmail({ email, otp }) as any);
      setMessage("Xác minh thành công!");
    } catch (err) {
      setMessage("OTP không hợp lệ hoặc đã hết hạn.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Xác minh Email</h2>
        <p className="text-sm text-gray-500 text-center mb-4">
          Nhập mã OTP được gửi đến email <strong>{email || "Chưa có email"}</strong>.
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Nhập mã OTP"
          className="w-full p-2 border border-gray-300 rounded-md text-center text-lg tracking-widest"
        />

        <button
          onClick={handleVerify}
          disabled={isLoading || otp.length !== 6}
          className={`w-full mt-4 p-2 rounded-md text-white font-semibold 
            ${otp.length === 6 ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
        >
          {isLoading ? "Đang xác minh..." : "Xác minh"}
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

export default Verify;
