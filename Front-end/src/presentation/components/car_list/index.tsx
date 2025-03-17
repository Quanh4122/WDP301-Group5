import React, { useEffect, useState } from "react";
import CarItem from "./components/CarItem";
import axiosInstance from "../utils/axios";
import { CarModels } from "./model";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import UsbIcon from "@mui/icons-material/Usb";
import PersonIcon from "@mui/icons-material/Person";
import CarFilterModals from "./components/CarFilterModals";
import SearchIcon from "@mui/icons-material/Search";

interface FilterOption {
  label: string;
  value: number | boolean;
}

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => currentPage > 1 && onPageChange(currentPage - 1);
  const handleNext = () => currentPage < totalPages && onPageChange(currentPage + 1);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return { pages, endPage };
  };

  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-sky-500 text-white disabled:bg-gray-300 hover:bg-sky-600 transition-all duration-200 disabled:cursor-not-allowed"
      >
        Trước
      </button>
      {getPageNumbers().pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === page
              ? "bg-sky-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          } transition-all duration-200`}
        >
          {page}
        </button>
      ))}
      {totalPages > 5 && getPageNumbers().endPage < totalPages && (
        <span className="px-4 py-2 text-gray-500">...</span>
      )}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-sky-500 text-white disabled:bg-gray-300 hover:bg-sky-600 transition-all duration-200 disabled:cursor-not-allowed"
      >
        Sau
      </button>
    </div>
  );
};

const CarList: React.FC = () => {
  const [carList, setCarList] = useState<CarModels[] | undefined>(undefined);
  const [filteredCars, setFilteredCars] = useState<CarModels[] | undefined>(undefined);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalT, setIsOpenModalT] = useState<boolean>(false);
  const [isOpenModalF, setIsOpenModalF] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const itemsPerPage: number = 8;

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

  useEffect(() => {
    onGetData();
  }, []);

  const onGetData = async () => {
    try {
      const res = await axiosInstance.get("/car/getAllCar");
      setCarList(res.data);
      setFilteredCars(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const onSetListDataNumberOfSeat = async (list: any[]) => {
    if (list.length > 0) {
      try {
        const res = await axiosInstance.post("/car/filterCarByNumberOfSeat", list);
        setCarList(res.data);
        setFilteredCars(res.data);
      } catch (err) {
        console.log(err);
      }
    } else {
      onGetData();
    }
  };

  const onSetListDataTransmissionType = async (list: any[]) => {
    if (list.length > 0) {
      try {
        const res = await axiosInstance.post("/car/filterCarByTransmissionType", list);
        setCarList(res.data);
        setFilteredCars(res.data);
      } catch (err) {
        console.log(err);
      }
    } else {
      onGetData();
    }
  };

  const onSetListDataFlue = async (list: any[]) => {
    if (list.length > 0) {
      try {
        const res = await axiosInstance.post("/car/filterCarByFlue", list);
        setCarList(res.data);
        setFilteredCars(res.data);
      } catch (err) {
        console.log(err);
      }
    } else {
      onGetData();
    }
  };

  // Filter cars based on search query
  useEffect(() => {
    const filtered = carList?.filter((car) =>
      `${car.carName || ""} `
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredCars(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchQuery, carList]);

  // Pagination logic
  const indexOfLastCar = currentPage * itemsPerPage;
  const indexOfFirstCar = indexOfLastCar - itemsPerPage;
  const currentCars = filteredCars?.slice(indexOfFirstCar, indexOfLastCar) || [];
  const totalPages = Math.ceil((filteredCars?.length || 0) / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header with Search */}
      <div className="w-full bg-white shadow-md py-6 px-8 md:px-24">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Danh Sách Xe</h1>
          <div className="relative w-full md:w-1/3 shadow-sm rounded-full overflow-hidden border border-gray-200 bg-white">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên xe hoặc hãng xe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-12 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="w-full px-8 md:px-24 py-6 flex flex-wrap gap-4 bg-white shadow-md mt-4">
        <button
          onClick={onGetData}
          className="px-4 py-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-all duration-200 shadow-md"
        >
          Tất cả
        </button>
        <button
          onClick={() => setIsOpenModal(true)}
          className="px-4 py-2 rounded-full border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white transition-all duration-200 shadow-md flex items-center gap-1"
        >
          <PersonIcon fontSize="small" />
          Số chỗ
        </button>
        <CarFilterModals
          isOpen={isOpenModal}
          onCancel={() => setIsOpenModal(false)}
          option={filterNumberOfSeat}
          title="Số chỗ"
          onSetListData={onSetListDataNumberOfSeat}
        />
        <button
          onClick={() => setIsOpenModalT(true)}
          className="px-4 py-2 rounded-full border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white transition-all duration-200 shadow-md flex items-center gap-1"
        >
          <UsbIcon fontSize="small" />
          Loại xe
        </button>
        <CarFilterModals
          isOpen={isOpenModalT}
          onCancel={() => setIsOpenModalT(false)}
          option={filterTransmissionType}
          title="Loại xe"
          onSetListData={onSetListDataTransmissionType}
        />
        <button
          onClick={() => setIsOpenModalF(true)}
          className="px-4 py-2 rounded-full border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white transition-all duration-200 shadow-md flex items-center gap-1"
        >
          <LocalGasStationIcon fontSize="small" />
          Nhiên liệu
        </button>
        <CarFilterModals
          isOpen={isOpenModalF}
          onCancel={() => setIsOpenModalF(false)}
          option={filterFlue}
          title="Nhiên liệu"
          onSetListData={onSetListDataFlue}
        />
      </div>

      {/* Car List */}
      <div className="container mx-auto px-8 md:px-24 py-12">
        {currentCars.length > 0 ? (
          <>
            <div className="flex flex-wrap justify-center gap-6">
              {currentCars.map((item, index) => (
                <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                  <CarItem carModel={item} />
                </div>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <h3 className="text-gray-600 text-2xl font-semibold">Không tìm thấy xe</h3>
            <p className="text-gray-400 mt-2">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarList;