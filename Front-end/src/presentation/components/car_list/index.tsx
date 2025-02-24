import React, { useEffect, useState } from "react";
import CarItem from "./components/CarItem";
import axiosInstance from "../utils/axios";
import MapBanner from "../../assets/map-banner.png"
import { CarModels } from "./model";

const CarList = () => {

    const Item = [
        { id: 1 },
        { id: 1 },
        { id: 1 },
        { id: 1 },
        { id: 1 },
    ]

    const [carList, setCarList] = useState<CarModels[]>()

    useEffect(() => {
        onGetData()
        console.log(carList)
    }, [])

    const onGetData = async () => {
        await axiosInstance.get('/car/getAllCar')
            .then(res => setCarList(res.data))
            .catch(err => console.log(err))
    }

    return (
        <div className="w-full">
            <div className="w-full h-20 bg-black">
                <img src={MapBanner} className="w-40 h-20" />
            </div>
            <div className=" flex flex-wrap items-center py-10 px-20">
                {
                    carList && carList.map((item) => (
                        <CarItem carModel={item} />
                    ))
                }
            </div>
        </div>

    )
}

export default CarList