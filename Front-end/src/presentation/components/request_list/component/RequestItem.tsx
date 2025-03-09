import React, { useEffect, useState } from "react";
import { RequestModelFull } from "../../checkout/models";
import dayjs from "dayjs";
import { statusRequest } from "../../../../constants";
import PersonIcon from '@mui/icons-material/Person';
import DetailRequestItem from "./DetailRequestItem";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { PRIVATE_ROUTES } from "../../../routes/CONSTANTS";

interface props {
    requestModel: RequestModelFull,
}

const RequestItem = ({ requestModel }: props) => {

    const [requestData, setRequestData] = useState<RequestModelFull>(requestModel)
    const [avatarPreview, setAvatarPreview] = useState(`http://localhost:3030${requestData.user?.avatar}`);
    const startDate = dayjs(requestData.startDate).format("HH:mm, DD/MM/YYYY ")
    const endDate = dayjs(requestData.endDate).format("HH:mm, DD/MM/YYYY")
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const navigate = useNavigate()

    const onGoToBooking = () => {
        navigate(PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.BOOKING, {
            state: requestData
        })
    }


    return (
        <div className=" w-full h-auto border rounded-sm shadow-md"
        // onClick={() => setIsOpen(true)}
        >
            <div className="border-b-2 w-full h-10 px-5 flex items-center justify-between">
                <div className="font-bold">{statusRequest.filter(item => item.value == requestData.requestStatus)[0]?.lable}</div>
                <div>
                    <Button className="border rounded-sm" onClick={onGoToBooking}>Đặt xe</Button>
                </div>
            </div>
            {
                requestData.car.map(item => (
                    <div className="w-full h-28 flex items-center justify-between px-5 border-b-2">
                        <div className="flex items-center">
                            <div>
                                {item.images ? (
                                    <img
                                        src={`http://localhost:3030${item.images[0]}`}
                                        alt="Avatar Preview"
                                        className="w-20 h-20 mx-auto border rounded-sm object-cover"
                                    />
                                ) : <PersonIcon />}
                            </div>
                            <div className="ml-5">{item.carName}</div>
                        </div>
                        <div>
                            <div className="text-sm font-semibold">
                                {item.numberOfSeat}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-semibold">
                                {item.licensePlateNumber}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-semibold">{item.price}k Đ/h</div>
                        </div>
                        {
                            requestData.requestStatus == "1" ? <Button className="border rounded-sm"
                            // onClick={() => setIsOpen(true)}
                            >
                                Delete
                            </Button>
                                : <></>
                        }

                    </div>
                ))
            }

            <DetailRequestItem
                isOpen={isOpen}
                onCancel={() => setIsOpen(false)}
                title={"Chi tiết đơn đặt xe"}
                detailRequest={requestData}
            />
        </div>
    )
}

export default RequestItem