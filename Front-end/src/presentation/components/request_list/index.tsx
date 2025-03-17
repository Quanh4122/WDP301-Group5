import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { RequestModelFull } from "../checkout/models";
import RequestItem from "./component/RequestItem";
import { useLocation, useNavigate } from "react-router-dom";
import RequestInSelected from "./component/RequestInSelected";
import { Button } from "antd";
import { AlertTriangle } from "lucide-react";
import { PRIVATE_ROUTES } from "../../routes/CONSTANTS";
import RequestInReject from "./component/RequestInReject";

const RequestList = () => {

    const [requestList, setRequestList] = useState<RequestModelFull[]>()
    const [requestInSelected, setRequestInSelected] = useState<RequestModelFull>()
    const [requestInPending, setRequestPending] = useState<RequestModelFull[]>()
    const [requestInReject, setRequestInReject] = useState<RequestModelFull>()
    const [display, setDisplay] = useState(false);
    const [isDisplayReject, setIsDisplayReject] = useState(false)
    const location = useLocation()
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const uId = queryParams.get("userId");
        if (uId) {
            setIsDisplayReject(true)
            getListCar(uId)
        } else {
            getListCar(location.state.userId)
        }
    }, [])

    const getListCar = async (id: any) => {
        await axiosInstance.get("/request/getListRequest", {
            params: {
                key: id
            }
        })
            .then(res => onCategoryTypeByRequestList(res.data))
            .catch(err => console.log(err))

    }

    const onCategoryTypeByRequestList = (list: RequestModelFull[]) => {
        setRequestInSelected(list.filter((item) => item.requestStatus == "1")[0])
        setRequestPending(list.filter((item) => item.requestStatus == "2" || item.requestStatus == "3"))
        setRequestInReject(list.filter((item) => item.requestStatus == "4")[0])
    }

    return (
        <section className="w-full min-h-64 pt-9">
            <div className="w-full h-auto px-20">
                <Button
                    type="primary"
                    onClick={() => setDisplay(!display)}
                >
                    <span>{display ? "Xem danh sách" : "Xem chi tiết đang đặt"}</span>
                </Button>
            </div>

            {isDisplayReject && requestInReject ? <RequestInReject requestModal={requestInReject} />
                :
                display == false ?
                    requestInSelected ? <RequestInSelected requestModal={requestInSelected} />
                        : <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                                <AlertTriangle className="text-red-500 w-16 h-16 mx-auto" />
                                <h1 className="text-2xl font-semibold text-gray-800 mt-4">Opps !!</h1>
                                <p className="text-gray-600 mt-2">
                                    Hiện tại bạn chưa thêm xe nào vào giỏ hàng
                                </p>
                                <div className="mt-6 flex gap-4 justify-center">
                                    <Button onClick={() => navigate(-1)} className="bg-gray-500 hover:bg-gray-600 text-white">
                                        Quay lại
                                    </Button>
                                    <Button onClick={() => navigate(PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.CAR_LIST)} className="bg-blue-500 hover:bg-blue-600 text-white">
                                        Xem xe
                                    </Button>
                                </div>
                            </div>
                        </div>
                    :
                    <div className="w-full h-auto p-10">
                        {
                            requestInPending && requestInPending.map((item) => (
                                <RequestItem requestModel={item} />
                            ))
                        }
                    </div>
            }
            {/* <div className="w-full h-auto ">
                {
                    requestList && requestList.map((item) => (
                        <RequestItem requestModel={item} />
                    ))
                }
            </div> */}
        </section>
    )
}

export default RequestList