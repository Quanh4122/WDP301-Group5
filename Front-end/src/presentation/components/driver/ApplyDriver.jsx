import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { applyForDriver, getApplicationByUserId, updatePendingApplication } from "../../components/redux/slices/Authentication";
import { toast } from "react-toastify";

const ApplyDriver = () => {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [experience, setExperience] = useState("");
  const [driversLicensePhoto, setDriversLicensePhoto] = useState(null);

  const dispatch = useDispatch();
  const { userId } = useParams();
  const { isLoading, error, applicationStatus, applicationData } = useSelector((state) => state.auth);

  // Check existing application on component mount
  useEffect(() => {
    console.log("test1");
    const fetchApplication = async () => {
      if (userId) {
        try {
          await dispatch(getApplicationByUserId({ userId })).unwrap();
        } catch (err) {
          console.log("Error fetching application:", err);
        }
      }
    };
    fetchApplication();
  }, [userId, dispatch]);

  // Pre-fill form if there's existing data
  useEffect(() => {
    console.log("test2", applicationData);
    if (applicationData) {
      setLicenseNumber(applicationData.licenseNumber || "");
      setExperience(applicationData.experience || "");
    }
  }, [applicationData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      console.error("No userId provided");
      return;
    }

    const formData = {
      userId,
      licenseNumber,
      experience,
      ...(driversLicensePhoto && { driversLicensePhoto }),
    };

    try {
      // Allow updates for both "pending" and "rejected" statuses
      if (applicationStatus === "pending" || applicationStatus === "rejected") {
        await dispatch(updatePendingApplication(formData)).unwrap();
        toast.success("Cập nhật đơn ứng tuyển thành công!");
      } else if (!applicationStatus) {
        await dispatch(applyForDriver(formData)).unwrap();
        toast.success("Gửi hồ sơ đăng ký thành công!");
      } else {
        toast.info("Không thể cập nhật đơn đã được duyệt!");
        return;
      }

      if (!error) {
        setDriversLicensePhoto(null);
        await dispatch(getApplicationByUserId({ userId })).unwrap();
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      console.error("Error submitting application:", err);
    }
  };

  return (
    <div className="mt-20 mb-20 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {(applicationStatus === "pending" || applicationStatus === "rejected")
              ? "Cập Nhật Đơn Ứng Tuyển Lái Xe"
              : applicationStatus === "approved"
              ? "Đơn Ứng Tuyển Lái Xe"
              : "Ứng Tuyển Lái Xe"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {applicationStatus === "pending"
              ? "Bạn đã có một đơn ứng tuyển đang chờ xử lý."
              : applicationStatus === "rejected"
              ? "Đơn của bạn đã bị từ chối, bạn có thể cập nhật và gửi lại."
              : applicationStatus === "approved"
              ? "Đơn của bạn đã được duyệt."
              : "Vui lòng điền thông tin để đăng ký."}
          </p>
        </div>

        {/* Application Status Display */}
        {applicationStatus && applicationData && (
          <div className="bg-gray-100 p-4 rounded-lg space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Trạng Thái Đơn Ứng Tuyển</h3>
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-semibold">Trạng thái:</span>{" "}
                <span className={`capitalize ${
                  applicationStatus === "pending" ? "text-yellow-600" :
                  applicationStatus === "rejected" ? "text-red-600" :
                  "text-green-600"
                }`}>
                  {applicationStatus}
                </span>
              </p>
              <p>
                <span className="font-semibold">Ngày gửi:</span>{" "}
                {new Date(applicationData.appliedAt).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Số GPLX:</span>{" "}
                {applicationData.licenseNumber || "Chưa cập nhật"}
              </p>
              <p>
                <span className="font-semibold">Kinh nghiệm:</span>{" "}
                {applicationData.experience || "Chưa cập nhật"}
              </p>
              {applicationData.driversLicensePhoto && (
                <p>
                  <span className="font-semibold">Ảnh GPLX:</span> Đã tải lên
                </p>
              )}
            </div>
          </div>
        )}

        {/* Form - Show for no application, pending, or rejected */}
        {(!applicationStatus || applicationStatus === "pending" || applicationStatus === "rejected") && (
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div>
              <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="driversLicensePhoto" className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh giấy phép lái xe
              </label>
              <input
                id="driversLicensePhoto"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) => setDriversLicensePhoto(e.target.files[0])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-200 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
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
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (applicationStatus === "pending" || applicationStatus === "rejected") ? (
                  "Cập Nhật Đơn"
                ) : (
                  "Gửi Đơn Ứng Tuyển"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyDriver;