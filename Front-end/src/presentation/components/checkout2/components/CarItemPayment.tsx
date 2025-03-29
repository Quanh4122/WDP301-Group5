import React from "react";
import { CarModel } from "../../checkout/models";
import DeleteIcon from '@mui/icons-material/Delete';

interface props {
    carData: CarModel;
    isBusy?: boolean;
    onDelete?: (carId: string) => void;
    small?: boolean;
}

const CarItemPayment = ({ carData, isBusy, onDelete, small }: props) => {
    return (
        <div className="w-full h-12 mb-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center w-2/12 relative">
                    <img
                        src={`http://localhost:3030${carData?.images[0]}`} alt={carData.carName}
                        className="w-12 h-12 object-cover rounded-lg shadow-sm"
                    />
                    {isBusy &&
                        <span className="absolute top-0 left-0 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-br-lg rounded-tl-lg shadow-md">
                            Bận
                        </span>
                    }
                </div>
                <div className="flex items-center justify-between w-10/12">
                    <p className="text-xs font-semibold text-blue-800">
                        {carData.carName} {carData.carVersion}
                    </p>
                    <p>
                        Biển số: <span className="font-medium text-blue-700">{carData.licensePlateNumber}</span>
                    </p>
                    {
                        small || <p>
                            Giá thuê:{" "}
                            <span className="font-medium text-blue-700">
                                {carData.price && carData.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}/ 1h
                            </span>
                        </p>
                    }

                </div>
                {
                    small || <div className="hover:text-blue-600 hover:text-xl cursor-pointer flex items-center justify-end w-1/12"
                        onClick={() => onDelete && onDelete(carData._id)}
                    >
                        <DeleteIcon />
                    </div>
                }

            </div>
        </div>
    )
}

export default CarItemPayment