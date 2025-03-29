import React, { useEffect, useState } from "react";
import { RequestModelFull } from "../../checkout/models";
import dayjs from "dayjs";
import { statusRequest, statusRequestAdminView, statusRequestUser } from "../../../../constants";
import PersonIcon from '@mui/icons-material/Person';
import DetailRequestItem from "./DetailRequestItem";
import { Button, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { PRIVATE_ROUTES } from "../../../routes/CONSTANTS";
import axiosInstance from "../../utils/axios";
import { BillModal } from "../../list_request_admin/Modals";

interface Props {
    requestModel: RequestModelFull;
}

const RequestItem = ({ requestModel }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const startDate = dayjs(requestModel.startDate).format("HH:mm, DD/MM/YYYY");
    const endDate = dayjs(requestModel.endDate).format("HH:mm, DD/MM/YYYY");


    return (
        <div className="w-full rounded-lg shadow-md mb-4 bg-white">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
                <div className="font-semibold text-lg">
                    <div className="text-sm text-gray-600">{dayjs(requestModel.timeCreated).format("DD/MM/YYYY")}</div>
                    <div className="text-sm text-blue-600">{
                        statusRequestUser.find((dt) => dt.value == requestModel.requestStatus)?.lable}
                    </div> {/* Blue text */}
                </div>
                <Button onClick={() => setIsOpen(true)}>Xem chi tiết</Button>
            </div>

            {/* Car Items */}
            {requestModel.car.map((item, index) => (
                <div key={index} className="p-4 flex items-center border-b">
                    {/* Car Image */}
                    <div className="w-24 h-24 mr-4">
                        {item.images && item.images.length > 0 ? (
                            <img
                                src={`http://localhost:3030${item.images[0]}`}
                                alt={item.carName}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                <PersonIcon className="text-gray-500" />
                            </div>
                        )}
                    </div>

                    {/* Car Details */}
                    <div className="flex-1">
                        <div className="font-semibold">{item.carName}</div>
                        <div className="text-sm text-gray-600">
                            Số chỗ: {item.numberOfSeat} | Biển số: {item.licensePlateNumber}
                        </div>
                        {
                            requestModel.driver && requestModel.driver.length > 0 &&
                            <div className="text-sm text-gray-600">
                                Tài xế lái: {requestModel.driver[index].userName}
                            </div>
                        }

                    </div>

                    {/* Price */}
                    <div className="font-semibold">
                        {(item.price).toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        })}
                    </div>
                </div>
            ))}

            {/* Total */}
            <div className="p-4 flex justify-end">
                <div className="font-semibold text-lg">
                    Tổng: {(requestModel.car.reduce((acc, car) => acc + car.price, 0)).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    })}
                </div>
            </div>

            {/* Detail Modal */}
            <DetailRequestItem
                isOpen={isOpen}
                onCancel={() => setIsOpen(false)}
                title={"Chi tiết đơn đặt xe"}
                detailRequest={requestModel}
            />
        </div>
    );
};

export default RequestItem;