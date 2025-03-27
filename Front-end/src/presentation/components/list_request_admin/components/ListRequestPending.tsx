import React, { useEffect, useState } from "react";
import { RequestModelFull } from "../../checkout/models";
import PersonIcon from '@mui/icons-material/Person';
import dayjs from "dayjs";
import { statusRequest, statusRequestAdminView } from "../../../../constants";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { PRIVATE_ROUTES } from "../../../routes/CONSTANTS";
import PenaltyModal from "./PenaltyModal";

interface Props {
    requestList: RequestModelFull[] | [];
}

const ListRequestPending = ({ requestList }: Props) => {
    const [listData, setListData] = useState<RequestModelFull[] | []>([]);
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        setListData(requestList);
    }, [requestList]);



    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleSuccess = () => {
        console.log("Cập nhật phí phạt thành công!");
        // Có thể reload dữ liệu hoặc điều hướng
    };

    const getAvatarUrl = (avatar:any) => {
        if (!avatar || avatar.trim() === "") {
          return null; // Không có ảnh, sẽ dùng icon
        }
        if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
          return avatar; // URL tuyệt đối từ Google hoặc bên ngoài
        }
        return `http://localhost:3030${avatar.startsWith("/") ? "" : "/"}${avatar}`; // Ảnh từ backend
      };

    return (
        <div className="w-full mt-5">
            {requestList?.map((item, index) => (
                <div key={index} className="mb-4 rounded-md shadow-md overflow-hidden bg-white border border-blue-100"> {/* White background, light blue border */}
                    {/* User Info */}
                    <div className="flex items-center justify-between p-4 border-b border-blue-100"> {/* Light blue border */}
                        <div className="flex items-center space-x-4">
                            {item.user?.avatar ? (
                                <img
                                    src={getAvatarUrl(item.user?.avatar)}
                                    alt="Avatar Preview"
                                    className="w-12 h-12 rounded-full object-cover border border-blue-200" // Light blue border
                                />
                            ) : (
                                <PersonIcon className="w-12 h-12 text-blue-500" /> // Light blue icon
                            )}
                            
                            <div>
                                <div className="font-semibold text-blue-700">{item.user?.userName}</div> {/* Blue text */}
                                <div className="text-sm text-gray-500">{item.user?.email}</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">{dayjs(item.timeCreated).format("DD/MM/YYYY")}</div>
                            <div className="text-sm text-blue-600">{statusRequestAdminView.find((dt) => dt.value == item.requestStatus)?.lable}</div> {/* Blue text */}
                            {(
                                <Button
                                    onClick={() => setIsModalVisible(true)}
                                    className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md px-3 py-1" // Light blue button
                                >
                                    Xem báo cáo
                                </Button>
                            )}
                        </div>
                        <PenaltyModal
                            visible={isModalVisible}
                            requestId={item._id} // Thay bằng requestId thực tế
                            onClose={handleCloseModal}
                            onSuccess={handleSuccess}
                        />
                    </div>

                    {/* Car Info */}
                    <div className="flex flex-wrap">
                        {item.car.map((carItem, carIndex) => (
                            <div key={carIndex} className="w-full sm:w-1/2 md:w-1/3 p-4 border-b border-blue-100"> {/* Light blue border */}
                                <div className="flex items-center space-x-4">
                                    {carItem.images && carItem.images.length > 0 ? (
                                        <img
                                            src={`http://localhost:3030${carItem.images[0]}`}
                                            alt="Car Preview"
                                            className="w-16 h-16 rounded-md object-cover border border-blue-200" // Light blue border
                                        />
                                    ) : (
                                        <PersonIcon className="w-16 h-16 text-blue-500" /> // Light blue icon
                                    )}
                                    <div>
                                        <div className="font-semibold truncate w-32 text-blue-700">{carItem.carName}</div> {/* Blue text */}
                                        <div className="text-sm text-gray-600">Số chỗ: {carItem.numberOfSeat}</div>
                                        <div className="text-sm text-gray-600">Biển số: {carItem.licensePlateNumber}</div>
                                        <div className="text-sm text-gray-600">
                                            {(carItem.price).toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            })}
                                            /h
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListRequestPending;