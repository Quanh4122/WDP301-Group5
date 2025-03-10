import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { RequestModelFull } from "../checkout/models";
import RequestItem from "./component/RequestItem";
import { useLocation } from "react-router-dom";
import RequestInSelected from "./component/RequestInSelected";

const RequestList = () => {

    const [requestList, setRequestList] = useState<RequestModelFull[]>()
    const [requestInSelected, setRequestInSelected] = useState<RequestModelFull>()
    const [requestInPending, setRequestPending] = useState<RequestModelFull[]>()
    const location = useLocation()

    useEffect(() => {
        getListCar()
    }, [])

    const getListCar = async () => {
        await axiosInstance.get("/request/getListRequest", {
            params: {
                key: location.state
            }
        })
            .then(res => onCategoryTypeByRequestList(res.data))
            .catch(err => console.log(err))

    }

    const onCategoryTypeByRequestList = (list: RequestModelFull[]) => {
        setRequestInSelected(list.filter((item) => item.requestStatus == "1")[0])
        setRequestPending(list.filter((item) => item.requestStatus == "2"))

    }

    return (
        <section className="w-full min-h-64 pt-9">
            {/* <div className="w-full h-auto ">
                {
                    requestList && requestList.map((item) => (
                        <RequestItem requestModel={item} />
                    ))
                }
            </div> */}
            <RequestInSelected requestData={requestInSelected} />
        </section>
    )
}

export default RequestList