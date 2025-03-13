import React, { useEffect, useState } from "react";
import { RequestModelFull } from "../../checkout/models";
import PersonIcon from '@mui/icons-material/Person';
import dayjs from "dayjs";
import { statusRequest } from "../../../../constants";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { PRIVATE_ROUTES } from "../../../routes/CONSTANTS";

interface props {
    requestList: RequestModelFull[] | []
}

const ListRequestPending = ({ requestList }: props) => {

    const [listData, setListData] = useState<RequestModelFull[] | []>()
    useEffect(() => {
        setListData(requestList)
    }, [])
    const navigate = useNavigate()

    return (
        <div className="w-full h-auto mt-5">
            <div>
                {
                    listData?.map((item, index) => (
                        <div key={index}>
                            <div>
                                <div className="w-full h-28 flex items-center justify-between px-5 border-b-2 border rounded-sm ">
                                    <div
                                    // className="flex items-center"
                                    >
                                        <div>
                                            {item.user?.avatar ? (
                                                <img
                                                    src={`http://localhost:3030${item.user?.avatar}`}
                                                    alt="Avatar Preview"
                                                    className="w-20 h-20 mx-auto border rounded-sm object-cover"
                                                />
                                            ) : <PersonIcon />}
                                        </div>
                                        {item.user?.userName}
                                    </div>
                                    <div>{item.user?.email}</div>
                                    <div>{dayjs(item.timeCreated).format("DD/MM/YYYY")}</div>
                                    <div>{statusRequest.find(dt => dt.value == item.requestStatus)?.lable}</div>
                                    <Button
                                        onClick={() => navigate(PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.ADMIN_DETAIL_REQUEST, { state: item })}
                                    >
                                        {
                                            item.requestStatus == "2" ? "Chi tiết" : ""
                                        }
                                    </Button>
                                </div>
                            </div>
                            <div className="w-full h-auto border rounded-sm shadow-md mb-4 flex overflow-hidden">
                                {
                                    item.car.map(item => (
                                        <div className="w-96 px-5 h-28 border-b-2 flex items-center">
                                            <div>
                                                <div>
                                                    {item.images ? (
                                                        <img
                                                            src={`http://localhost:3030${item.images[0]}`}
                                                            alt="Preview"
                                                            className="w-20 h-20 border rounded-sm object-cover"
                                                        />
                                                    ) : <PersonIcon />}
                                                </div>
                                                <div className="w-24 overflow-hidden whitespace-nowrap text-ellipsis">{item.carName}</div>
                                            </div>
                                            <div className="pl-3">
                                                <div>
                                                    <div className="text-sm font-semibold">
                                                        Số chỗ: <span>{item.numberOfSeat}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold">
                                                        Biển số xe: <span>{item.licensePlateNumber}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold">{(item.price * 1000).toLocaleString('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    })}/h</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>

    )
}

export default ListRequestPending