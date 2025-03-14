import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";
import Carimage from "../../../assets/car-image1.png"
import PersonIcon from '@mui/icons-material/Person';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import UsbIcon from '@mui/icons-material/Usb';
import { CarModels } from "../model";
import { useNavigate } from "react-router-dom";
import { PRIVATE_ROUTES } from "../../../routes/CONSTANTS";

interface props {
    carModel?: CarModels
}

const CarItem = ({ carModel }: props) => {
    const img: any = carModel?.images[0] || Carimage
    const navigate = useNavigate()
    const goToDetail = () => {
        navigate(PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.CAR_DETAIL, { state: carModel })
    }

    const displayFlue = (val: Number | undefined) => {
        if (val == 1) {
            return "Xăng"
        } else if (val == 2) {
            return "Dầu"
        } else {
            return "Điện"
        }

    }

    return (
        <div className="cursor-pointer"> {/* Added cursor-pointer for better UX */}
            <div className="bg-white rounded-lg shadow-md m-2 w-full max-w-sm"> {/* Replaced Card with div for Tailwind styling */}
                <img
                    src={`http://localhost:3030${carModel?.images[0]}`}
                    alt={`${carModel?.carName} ${carModel?.carVersion}`}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4"> {/* Replaced CardContent with div for Tailwind styling */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-sky-700"> {/* Added text-sky-700 for better visibility */}
                            {carModel?.carName} {carModel?.carVersion}
                        </h3>
                        <div className="flex items-center justify-end">
                            <p className="text-md font-bold text-sky-500">
                                <span className="text-base line-through text-gray-500 mr-1">440K</span>
                                {carModel?.price}K / 1 Ngày
                            </p>
                        </div>
                        <div className="flex items-center justify-end mt-2">
                            <p className="text-md font-bold text-gray-800">2 ngày 4 giờ</p>
                        </div>
                        <div className="flex items-center justify-end mt-2">
                            <p className="text-xs text-gray-800">Giá tạm tính chưa bao gồm VAT</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-sky-500">
                                <PersonIcon className="mr-1" />
                                <span className="text-sm">
                                    {carModel?.numberOfSeat} chỗ
                                </span>
                            </div>
                            <div className="flex items-center text-sky-500">
                                <UsbIcon className="mr-1" />
                                <span className="text-sm">
                                    {carModel?.carType.transmissionType ? "Số tự động" : "Số sàn"}
                                </span>
                            </div>
                            <div className="flex items-center text-sky-500">
                                <LocalGasStationIcon className="mr-1" />
                                <span className="text-sm">
                                    {displayFlue(carModel?.carType.flue)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-10 mt-5 flex justify-center items-center bg-sky-100 text-sky-500 rounded-md hover:bg-sky-200 transition duration-200"
                        onClick={() => goToDetail()}
                    > {/* Adjusted styling */}
                        {/* <CalendarMonthIcon className="mr-1" /> */}
                        Xem xe
                    </div>
                </div>
            </div>
        </div>

    )
}

export default CarItem