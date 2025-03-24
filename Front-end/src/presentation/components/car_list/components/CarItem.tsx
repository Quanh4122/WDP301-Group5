import React from "react";
import { CarModels } from "../model";
import { useNavigate } from "react-router-dom";
import { PRIVATE_ROUTES } from "../../../routes/CONSTANTS";
import PersonIcon from "@mui/icons-material/Person";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import UsbIcon from "@mui/icons-material/Usb";
import { Button } from "antd";
import store, { RootState } from "../../redux/Store";
import { RequestModalForCallApi } from "../../checkout/models";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";


interface Props {
    carModel?: CarModels;
}

const CarItem = ({ carModel }: Props) => {
    const navigate = useNavigate();

    const goToDetail = () => {
        navigate(PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.CAR_DETAIL, { state: carModel });
    };

    const displayFlue = (val: number | undefined) => {
        if (val === 1) return "Xăng";
        if (val === 2) return "Dầu";
        return "Điện";
    };

    const userId = useSelector((state: RootState) => (state.auth?.user as { userId: string } | null)?.userId);

    const onBooking = async () => {
        const data = {
            carDetail: carModel,
        }
        if (store.getState().auth.isLoggedIn == true) {
            if (carModel) {
                const formBooking: RequestModalForCallApi = {
                    user: userId,
                    car: [carModel._id],
                    startDate: "",
                    endDate: "",
                    isRequestDriver: false,
                    requestStatus: '1'
                }

                await axiosInstance.post("/request/createRequest", formBooking)
                    .then(res => toast.success("Add to request Successfull !!"))
                    .catch(err => toast.error("This car may be added in your request !!"))
            }
        } else {
            navigate(PRIVATE_ROUTES.PATH + '/' + PRIVATE_ROUTES.SUB.SIGN_IN)
        }


    }

    return (
        <div className="cursor-pointer w-full max-w-sm mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                    src={`http://localhost:3030${carModel?.images[0]}`}
                    alt={`${carModel?.carName} ${carModel?.carVersion}`}
                    className="w-full h-48 object-cover"
                />
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 text-sky-700">
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
                    <div className="mt-4 flex items-center justify-between text-sky-500">
                        <div className="flex items-center">
                            <PersonIcon className="mr-1" fontSize="small" />
                            <span className="text-sm">{carModel?.numberOfSeat} chỗ</span>
                        </div>
                        <div className="flex items-center">
                            <UsbIcon className="mr-1" fontSize="small" />
                            <span className="text-sm">
                                {carModel?.carType.transmissionType ? "Số tự động" : "Số sàn"}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <LocalGasStationIcon className="mr-1" fontSize="small" />
                            <span className="text-sm">{displayFlue(carModel?.carType?.flue)}</span>
                        </div>
                    </div>
                    <Button className="w-full h-10 mt-10" type="primary" onClick={onBooking}>
                        Thêm xe
                    </Button>
                    <div
                        className="w-full h-10 mt-5 flex justify-center items-center bg-sky-100 text-sky-500 rounded-md hover:bg-sky-200 transition duration-200"
                        onClick={goToDetail}
                    >
                        Xem xe
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarItem;