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
        navigate(PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.CAR_DETAIL)
    }

    return (
        <div onClick={() => goToDetail()}>
            <Card sx={{ maxWidth: 300 }} className="bg-gray-100 rounded-lg shadow-md m-2">
                <CardMedia
                    component="img"
                    height="194"
                    width="200"
                    image={img}
                    sx={{ width: 340 }}
                />
                <CardContent>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">{carModel?.carName + " " + carModel?.carVersion}</h3>
                        {/* <p className="text-gray-600 mb-4">Huyện Hòa Vang</p> */}
                        <div className="flex items-center justify-end">
                            <p className="text-md font-bold text-sky-500"><span className="text-base line-through text-gray-500 mr-1">440K</span>{carModel?.price[3]}K /1 Ngày
                                {/* <ArrowCircleRightIcon className="mx-2" /> */}
                            </p>
                        </div>
                        <div className="flex items-center justify-end mt-2">
                            <p className="text-md font-bold text-gray-800">2 ngày 4 giờ</p>
                        </div>
                        <div className="flex items-center justify-end mt-2">
                            <p className="text-xs text-gray-800">Giá tạm tính chưa bao gồm vat</p>
                        </div>
                    </div>
                    <Typography>
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-sky-500">
                                <PersonIcon />
                                <Typography variant="body2" color="textSecondary">
                                    {carModel?.numberOfSeat} chỗ
                                </Typography>
                            </div>
                            <div className="flex items-center text-sky-500">
                                <UsbIcon />
                                <Typography variant="body2" color="textSecondary">
                                    {carModel?.carType.transmissionType ? "Số tự động" : "Số sàn"}
                                </Typography>
                            </div>
                            <div className="flex items-center text-sky-500">
                                <LocalGasStationIcon />
                                <Typography variant="body2" color="textSecondary">
                                    {carModel?.carType.flue == 1 ? "Xăng" : carModel?.carType.flue == 2 ? "Dầu" : "Điện"}
                                </Typography>
                            </div>
                        </div>
                    </Typography>
                    <Typography >
                        <div className="w-full h-10 mt-5 flex justify-center items-center bg-orange-100 text-orange-500">
                            <CalendarMonthIcon />
                            Xem Lịch xe
                        </div>
                    </Typography>
                </CardContent>
            </Card>
        </div>

    )
}

export default CarItem