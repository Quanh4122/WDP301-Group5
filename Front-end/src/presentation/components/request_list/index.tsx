import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { RequestModelFull } from "../checkout/models";
import RequestItem from "./component/RequestItem";
import { useLocation } from "react-router-dom";

const RequestList = () => {

    const [requestList, setRequestList] = useState<RequestModelFull[]>()
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
            .then(res => setRequestList(res.data))
            .catch(err => console.log(err))

    }

    return (
        <section className="w-full min-h-64 flex items-center justify-center p-10">
            <div className="w-full h-auto flex">
                {
                    requestList && requestList.map((item) => (
                        <RequestItem requestModel={item} />
                    ))
                }
            </div>
        </section>
    )
}

export default RequestList