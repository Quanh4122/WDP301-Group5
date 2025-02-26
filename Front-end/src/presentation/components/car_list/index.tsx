import React, { useEffect, useState } from "react";
import CarItem from "./components/CarItem";
import axiosInstance from "../utils/axios";
import MapBanner from "../../assets/map-banner.png"
import { CarModels } from "./model";
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import UsbIcon from '@mui/icons-material/Usb';
import CarFilterModals from "./components/CarFilterModals";
import PersonIcon from '@mui/icons-material/Person';

const CarList = () => {

    const [carList, setCarList] = useState<CarModels[]>()
    const [isOpenModal, setIsOpenModal] = useState(false)
    const filterNumberOfSeat = [
        { label: '5 chỗ', value: 5 },
        { label: '7 chỗ', value: 7 },
        { label: '9 chỗ', value: 9 }
    ]
    const filterTransmissionType = [
        { label: 'Số tự động', value: true },
        { label: 'Số sàn', value: false },
    ]
    const filterFlue = [
        { label: 'Máy Xăng', value: 1 },
        { label: 'Máy Dầu', value: 2 },
        { label: 'Máy Điện', value: 3 }
    ]

    useEffect(() => {
        onGetData()
        console.log(carList)
    }, [])

    const onGetData = async () => {
        await axiosInstance.get('/car/getAllCar')
            .then(res => setCarList(res.data))
            .catch(err => console.log(err))
    }

    const onSetListDataNumberOfSeat = async (list: any[]) => {
        if (list && list.length > 0) {
            await axiosInstance.post('/car/filterCarByNumberOfSeat', list)
                .then(res => setCarList(res.data))
                .catch(err => console.log(err))
        } else {
            onGetData()
        }

    }

    const onSetListDataTransmissionType = async (list: any[]) => {
        if (list && list.length > 0) {
            await axiosInstance.post('/car/filterCarByTransmissionType', list)
                .then(res => setCarList(res.data))
                .catch(err => console.log(err))
        } else {
            onGetData()
        }
    }

    const onSetListDataFlue = async (list: any[]) => {
        if (list && list.length > 0) {
            await axiosInstance.post('/car/filterCarByFlue', list)
                .then(res => setCarList(res.data))
                .catch(err => console.log(err))
        } else {
            onGetData()
        }
    }

    return (
        <div className="w-full">
            <div className="w-full h-20 bg-black">
                <img src={MapBanner} className="w-40 h-20" />
            </div>
            <div className="w-2/3 px-24 h-24 flex flex-wrap items-center">
                <div className="w-auto h-8 px-3 mr-3 rounded-2xl border-1 text-sky-500 border-sky-500 border-solid flex items-center justify-center hover:bg-sky-500 hover:text-white">
                    Tất cả
                </div>
                <div
                    className="w-auto h-8 px-3 mr-3 rounded-2xl border-1 border-sky-500 border-solid flex items-center justify-center text-sky-500 hover:bg-sky-500 hover:text-white"
                    onClick={() => setIsOpenModal(true)}
                >
                    <PersonIcon className="500" /><span>Số chỗ</span>
                    <CarFilterModals
                        isOpen={isOpenModal}
                        onCancel={() => setIsOpenModal(false)}
                        option={filterNumberOfSeat}
                        title="Số chỗ"
                        onSetListData={onSetListDataNumberOfSeat}
                    />
                </div>
                <div
                    className="w-auto h-8 px-3 mr-3 rounded-2xl border-1 border-sky-500 border-solid flex items-center justify-center text-sky-500 hover:bg-sky-500 hover:text-white"
                    onClick={() => setIsOpenModal(true)}
                >
                    <UsbIcon /><span>Loại xe</span>
                    <CarFilterModals
                        isOpen={isOpenModal}
                        onCancel={() => setIsOpenModal(false)}
                        option={filterTransmissionType}
                        title="Loại xe"
                        onSetListData={onSetListDataTransmissionType}
                    />
                </div>
                <div
                    className="w-auto h-8 px-3 mr-3 rounded-2xl border-1 border-sky-500 border-solid flex items-center justify-center text-sky-500 hover:bg-sky-500 hover:text-white"
                    onClick={() => setIsOpenModal(true)}
                >
                    <LocalGasStationIcon /><span>Nhiên liệu</span>
                </div>
                <CarFilterModals
                    isOpen={isOpenModal}
                    onCancel={() => setIsOpenModal(false)}
                    option={filterFlue}
                    title="Nhiên liệu"
                    onSetListData={onSetListDataFlue}
                />
            </div>
            <div className=" flex flex-wrap items-center py-10 px-20">
                {
                    carList && carList.map((item, index) => (
                        <CarItem carModel={item} key={index} />
                    ))
                }
            </div>
        </div>

    )
}

export default CarList