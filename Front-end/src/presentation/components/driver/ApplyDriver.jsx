import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { applyForDriver } from "../../components/redux/slices/Authentication";
import { toast, ToastContainer } from "react-toastify";

const ApplyDriver = () => {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [experience, setExperience] = useState("");
  const [driversLicensePhoto, setDriversLicensePhoto] = useState(null); // State cho file ảnh
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userId) {
      console.log("Dispatching applyForDriver with userId:", userId);
      await dispatch(
        applyForDriver({
          userId,
          licenseNumber,
          experience,
          driversLicensePhoto, // Gửi file ảnh
        })
      );
      toast.success("Gửi hồ sơ đăng ký thành công!");
      // Reset form nếu không có lỗi
      if (!error) {
        setLicenseNumber("");
        setExperience("");
        setDriversLicensePhoto(null);
      }
    } else {
      console.error("No userId provided");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-lg w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Ứng Tuyển Lái Xe
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Vui lòng điền thông tin và upload ảnh giấy phép lái xe để đăng ký.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
        >
          <div>
            <label
              htmlFor="licenseNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Số giấy phép lái xe
            </label>
            <input
              id="licenseNumber"
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200 placeholder-gray-400"
              placeholder="Nhập số giấy phép lái xe"
            />
          </div>

          <div>
            <label
              htmlFor="experience"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Kinh nghiệm lái xe
            </label>
            <input
              id="experience"
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200 placeholder-gray-400"
              placeholder="Nhập kinh nghiệm lái xe (ví dụ: 2 năm)"
            />
          </div>

          <div>
            <label
              htmlFor="driversLicensePhoto"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ảnh giấy phép lái xe
            </label>
            <input
              id="driversLicensePhoto"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={(e) => setDriversLicensePhoto(e.target.files[0])}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
            />
          </div>

          {/* Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading || !driversLicensePhoto} // Vô hiệu hóa nếu chưa chọn file
              className={`w-full py-3 px-4 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-200 ${
                isLoading || !driversLicensePhoto
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                  Đang gửi...
                </span>
              ) : (
                "Gửi Đơn Ứng Tuyển"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyDriver;
