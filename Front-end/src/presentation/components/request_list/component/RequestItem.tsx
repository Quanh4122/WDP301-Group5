import React, { useEffect, useState } from "react";
import { RequestModelFull } from "../../checkout/models";
import dayjs from "dayjs";
import { statusRequest } from "../../../../constants";
import PersonIcon from '@mui/icons-material/Person';

interface props {
    requestModel: RequestModelFull,
}

const RequestItem = ({ requestModel }: props) => {

    const [requestData, setRequestData] = useState<RequestModelFull>(requestModel)
    const [avatarPreview, setAvatarPreview] = useState(`http://localhost:3030${requestData.user.avatar}`);
    const startDate = dayjs(requestData.startDate).format("HH:mm, DD/MM/YYYY ")
    const endDate = dayjs(requestData.endDate).format("HH:mm, DD/MM/YYYY")

    return (
        <div className=" w-full h-16 flex items-center border rounded-lg shadow-md px-5">
            <div className="w-full h-full flex items-center justify-between">
                <div className="flex items-center">
                    <div>
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="Avatar Preview"
                                className="w-10 h-10 mx-auto rounded-full border object-cover"
                            />
                        ) : <PersonIcon />}
                    </div>
                    <div className="ml-5">{requestData.user.fullName ? requestData.user.fullName : requestData.user.email}</div>
                </div>

                <div>
                    <div className="text-sm font-semibold">{requestData.car.licensePlateNumber}</div>
                </div>
                <div>
                    <div className="text-sm font-semibold">{startDate} đến {endDate}</div>
                </div>
                <div>
                    {statusRequest.filter(item => item.value == requestData.requestStatus)[0]?.lable}
                </div>
            </div>
        </div>
    )
}

export default RequestItem