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
    const [isOpenModalT, setIsOpenModalT] = useState(false)
    const [isOpenModalF, setIsOpenModalF] = useState(false)
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
                .then(res => (setCarList(res.data), console.log(res.data)))
                .catch(err => console.log(err))
        } else {
            onGetData()
        }
    }

    return (
        <div className="w-full bg-white"> {/* White background */}

            <div className="w-full px-8 md:px-24 py-6 flex flex-wrap items-center"> {/* Padding adjusted for responsiveness */}
                <div className="h-8 px-3 mr-3 rounded-full border border-sky-500 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition duration-200"> {/* Rounded buttons with hover effect */}
                    Tất cả
                </div>
                <div
                    className="h-8 px-3 mr-3 rounded-full border border-sky-500 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition duration-200 cursor-pointer"
                    onClick={() => setIsOpenModal(true)}
                >
                    <PersonIcon className="mr-1" /><span>Số chỗ</span>
                </div>
                <CarFilterModals
                    isOpen={isOpenModal}
                    onCancel={() => setIsOpenModal(false)}
                    option={filterNumberOfSeat}
                    title="Số chỗ"
                    onSetListData={onSetListDataNumberOfSeat}
                />
                <div
                    className="h-8 px-3 mr-3 rounded-full border border-sky-500 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition duration-200 cursor-pointer"
                    onClick={() => setIsOpenModalT(true)}
                >
                    <UsbIcon className="mr-1" /><span>Loại xe</span>
                </div>
                <CarFilterModals
                    isOpen={isOpenModalT}
                    onCancel={() => setIsOpenModalT(false)}
                    option={filterTransmissionType}
                    title="Loại xe"
                    onSetListData={onSetListDataTransmissionType}
                />
                <div
                    className="h-8 px-3 mr-3 rounded-full border border-sky-500 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition duration-200 cursor-pointer"
                    onClick={() => setIsOpenModalF(true)}
                >
                    <LocalGasStationIcon className="mr-1" /><span>Nhiên liệu</span>
                </div>
                <CarFilterModals
                    isOpen={isOpenModalF}
                    onCancel={() => setIsOpenModalF(false)}
                    option={filterFlue}
                    title="Nhiên liệu"
                    onSetListData={onSetListDataFlue}
                />
            </div>
            <div className="flex flex-wrap justify-center p-4">
                {carList && carList.map((item, index) => (
                    <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"> {/* Added width classes and padding */}
                        <CarItem carModel={item} />
                    </div>
                ))}
            </div>
        </div>

    )
}

export default CarList