import React, { useEffect, useState } from "react";
import CarItem from "./components/CarItem";
import axiosInstance from "../utils/axios";
import MapBanner from "../../assets/map-banner.png";
import { CarModels } from "./model";
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import UsbIcon from '@mui/icons-material/Usb';
import CarFilterModals from "./components/CarFilterModals";
import PersonIcon from '@mui/icons-material/Person';

// Định nghĩa kiểu cho filter options
interface FilterOption {
    label: string;
    value: number | boolean;
}

const CarList: React.FC = () => {
    // State cho danh sách xe
    const [carList, setCarList] = useState<CarModels[] | undefined>(undefined);
    // State cho modal lọc
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isOpenModalT, setIsOpenModalT] = useState<boolean>(false);
    const [isOpenModalF, setIsOpenModalF] = useState<boolean>(false);
    // State cho phân trang
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage: number = 8; // Số lượng xe trên mỗi trang

    // Dữ liệu cho các bộ lọc
    const filterNumberOfSeat: FilterOption[] = [
        { label: "5 chỗ", value: 5 },
        { label: "7 chỗ", value: 7 },
        { label: "9 chỗ", value: 9 },
    ];

    const filterTransmissionType: FilterOption[] = [
        { label: "Số tự động", value: true },
        { label: "Số sàn", value: false },
    ];

    const filterFlue: FilterOption[] = [
        { label: "Máy Xăng", value: 1 },
        { label: "Máy Dầu", value: 2 },
        { label: "Máy Điện", value: 3 },
    ];

    // Lấy dữ liệu ban đầu
    useEffect(() => {
        onGetData();
    }, []);

    // Reset trang về 1 khi danh sách xe thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [carList]);

    const onGetData = async () => {
        try {
            const res = await axiosInstance.get("/car/getAllCar");
            setCarList(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const onSetListDataNumberOfSeat = async (list: any[]) => {
        if (list && list.length > 0) {
            try {
                const res = await axiosInstance.post("/car/filterCarByNumberOfSeat", list);
                setCarList(res.data);
            } catch (err) {
                console.log(err);
            }
        } else {
            onGetData();
        }
    };

    const onSetListDataTransmissionType = async (list: any[]) => {
        if (list && list.length > 0) {
            try {
                const res = await axiosInstance.post("/car/filterCarByTransmissionType", list);
                setCarList(res.data);
            } catch (err) {
                console.log(err);
            }
        } else {
            onGetData();
        }
    };

    const onSetListDataFlue = async (list: any[]) => {
        if (list && list.length > 0) {
            try {
                const res = await axiosInstance.post("/car/filterCarByFlue", list);
                setCarList(res.data);
            } catch (err) {
                console.log(err);
            }
        } else {
            onGetData();
        }
    };

    // Tính toán phân trang
    const totalItems: number = carList?.length || 0;
    const totalPages: number = Math.ceil(totalItems / itemsPerPage);
    const startIndex: number = (currentPage - 1) * itemsPerPage;
    const endIndex: number = startIndex + itemsPerPage;
    const currentItems: CarModels[] = carList?.slice(startIndex, endIndex) || [];

    // Hàm điều hướng phân trang
    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    // Tạo mảng số trang
    const pageNumbers: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="w-full bg-white">
            {/* Bộ lọc */}
            <div className="w-full px-8 md:px-24 py-6 flex flex-wrap items-center">
                <div
                    className="h-8 px-3 mr-3 rounded-full border border-sky-500 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition duration-200 cursor-pointer"
                    onClick={onGetData}
                >
                    Tất cả
                </div>
                <div
                    className="h-8 px-3 mr-3 rounded-full border border-sky-500 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition duration-200 cursor-pointer"
                    onClick={() => setIsOpenModal(true)}
                >
                    <PersonIcon className="mr-1" />
                    <span>Số chỗ</span>
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
                    <UsbIcon className="mr-1" />
                    <span>Loại xe</span>
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
                    <LocalGasStationIcon className="mr-1" />
                    <span>Nhiên liệu</span>
                </div>
                <CarFilterModals
                    isOpen={isOpenModalF}
                    onCancel={() => setIsOpenModalF(false)}
                    option={filterFlue}
                    title="Nhiên liệu"
                    onSetListData={onSetListDataFlue}
                />
            </div>

            {/* Danh sách xe */}
            <div className="flex flex-wrap justify-center p-4">
                {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                        <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
                            <CarItem carModel={item} />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">Không có xe nào để hiển thị</div>
                )}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 py-6">
                    {/* Nút Previous */}
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg shadow hover:bg-sky-600 transition duration-200 ${currentPage === 1
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-sky-500 text-white"
                            }`}
                    >
                        Previous
                    </button>

                    {/* Số trang */}
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => handlePageClick(number)}
                            className={`px-4 py-2 rounded-lg shadow hover:bg-sky-100 transition duration-200 ${currentPage === number ? "bg-sky-700 text-white" : "bg-gray-200"
                                }`}
                        >
                            {number}
                        </button>
                    ))}

                    {/* Nút Next */}
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg shadow hover:bg-sky-600 transition duration-200 ${currentPage === totalPages
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-sky-500 text-white"
                            }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default CarList;