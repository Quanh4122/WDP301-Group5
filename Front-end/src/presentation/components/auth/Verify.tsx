import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VerifyEmailAction, ResendOTPAction } from "../redux/slices/Authentication";
import { RootState } from "../redux/Store";
import { toast } from "react-toastify";

const Verify: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [timer, setTimer] = useState<number>(120);
  const [canResend, setCanResend] = useState<boolean>(false);

  const dispatch = useDispatch<any>();
  const { user, isLoading } = useSelector((state: RootState) => ({
    user: state.auth.user as { email: string } | null,
    isLoading: state.auth.isLoading,
    error: state.auth.error ? "An error occurred" : null,
  }));

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);


  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  const handleVerify = async () => {
    try {
      const result = await dispatch(
        VerifyEmailAction({ email: user?.email || "", otp })
      ).unwrap();
      toast.success(result.response.data.message);
      setTimeout(() => {
        window.location.href = "/app/sign-in";
      }, 1500);
    } catch (err) {
      const errorMessage = (err as any)?.response?.data?.message;
      toast.error(errorMessage);
    }
  };

  const handleResend = async () => {

    try {
      const result = await dispatch(
        ResendOTPAction({ email: user?.email || "" })
      ).unwrap();
      toast.success(result.response.data.message);
      setTimer(120);
      setCanResend(false);
    } catch (err) {
      const errorMessage = (err as any)?.response?.data?.message;
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center mt-20 mb-40 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Xác minh Email
        </h2>
        <p className="text-sm text-gray-500 text-center mb-4">
          Nhập mã OTP được gửi đến email{" "}
          <strong>{user?.email || "Chưa có email"}</strong>.
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setOtp(e.target.value)
          }
          placeholder="Nhập mã OTP"
          className="w-full p-2 border border-gray-300 rounded-md text-center text-lg tracking-widest"
        />

        <button
          onClick={handleVerify}
          disabled={isLoading || otp.length !== 6}
          className={`w-full mt-4 p-2 rounded-md text-white font-semibold ${
            otp.length === 6 && !isLoading
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Đang xác minh..." : "Xác minh"}
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {timer > 0
              ? `Mã OTP sẽ hết hạn sau: ${formatTime(timer)}`
              : "Mã OTP đã hết hạn!"}
          </p>
          <button
            onClick={handleResend}
            disabled={!canResend || isLoading}
            className={`mt-2 text-sm underline ${
              canResend && !isLoading
                ? "text-blue-500 hover:text-blue-600"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Đang gửi..." : "Gửi lại OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;