import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "antd";

const NotAuthorization = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <AlertTriangle className="text-red-500 w-16 h-16 mx-auto" />
        <h1 className="text-2xl font-semibold text-gray-800 mt-4">Truy cập bị từ chối</h1>
        <p className="text-gray-600 mt-2">
          Bạn không có quyền truy cập vào trang này. Hãy liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          <Button onClick={() => navigate(-1)} className="bg-gray-500 hover:bg-gray-600 text-white">
            Quay lại
          </Button>
          <Button onClick={() => navigate("/")} className="bg-blue-500 hover:bg-blue-600 text-white">
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorization;
