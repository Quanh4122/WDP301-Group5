import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";
import Carimage from "../../../assets/car-image1.png"
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import PersonIcon from '@mui/icons-material/Person';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import UsbIcon from '@mui/icons-material/Usb';

const CarItem = () => {
    return (
        <Card sx={{ maxWidth: 340 }} className="bg-gray-100 rounded-lg shadow-md mx-2">
            <CardMedia
                component="img"
                height="194"
                width="200"
                image={Carimage}
                sx={{ width: 340 }}
            />
            <CardContent>
                <div className="">
                    <h3 className="text-lg font-semibold mb-2">KIA K3 2022</h3>
                    {/* <p className="text-gray-600 mb-4">Huyện Hòa Vang</p> */}
                    <div className="flex items-center justify-between">
                        <p className="text-md font-bold text-sky-500"><span className="text-base line-through text-gray-500 mr-1">440K</span>550K /4 giờ
                            <ArrowCircleRightIcon className="mx-2" />
                        </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-md font-bold text-gray-800"><span className="text-base line-through text-gray-500 mr-1">880K</span>1100K/24 giờ</p>
                    </div>
                </div>
                <Typography>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-sky-500">
                            <PersonIcon />
                            <Typography variant="body2" color="textSecondary">
                                5 chỗ
                            </Typography>
                        </div>
                        <div className="flex items-center text-sky-500">
                            <UsbIcon />
                            <Typography variant="body2" color="textSecondary">
                                Số tự động
                            </Typography>
                        </div>
                        <div className="flex items-center text-sky-500">
                            <LocalGasStationIcon />
                            <Typography variant="body2" color="textSecondary">
                                Xăng
                            </Typography>
                        </div>
                    </div>
                </Typography>
            </CardContent>
        </Card>
    )
}

export default CarItem