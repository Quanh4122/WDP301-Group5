import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { CarModels } from "./model";
import { Button, Dropdown, Menu, List, Pagination as AntdPagination, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import UsbIcon from "@mui/icons-material/Usb";
import PersonIcon from "@mui/icons-material/Person";
import CarItem from "./components/CarItem";
import CarCalendar from "../car_detail/component/CarCalendar";
import CarModal from "../car_detail/component/CarModal";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import dayjs, { Dayjs } from "dayjs";
import { DateRange } from "@mui/x-date-pickers-pro/models";
import { ToastContainer } from "react-toastify";

// Định nghĩa kiểu cho bộ lọc
interface FilterOptions {
  seats: string | null;
  transmission: boolean | null;
  fuel: number | null;
}

// Định nghĩa các hằng số
export const NumberOfSeat = [
  { label: "4 chỗ", value: "4" },
  { label: "5 chỗ", value: "5" },
  { label: "7 chỗ", value: "7" },
  { label: "9 chỗ", value: "9" },
];

export const Flue = [
  { label: "Máy xăng", value: 1 },
  { label: "Máy dầu", value: 2 },
  { label: "Máy điện", value: 3 },
];

export const TranmissionType = [
  { label: "Số tự động", value: true },
  { label: "Số sàn", value: false },
];

const CarList: React.FC = () => {
  const [filteredCars, setFilteredCars] = useState<CarModels[] | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpenModalN, setIsOpenModalN] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOptions>({
    seats: null,
    transmission: null,
    fuel: null,
  });
  const itemsPerPage: number = 8;

  // State cho ngày giờ
  const [dateValue, setDateValue] = useState<string[]>([
    dayjs().format("DD/MM/YYYY"),
    dayjs().add(1, "day").format("DD/MM/YYYY"),
  ]);
  const [timeValue, setTimeValue] = useState<string[]>([
    dayjs().hour() + ":00",
    dayjs().hour() + ":00",
  ]);

  const getDateValue = (value: DateRange<Dayjs>) => {
    setDateValue([
      value && value[0] ? dayjs(value[0].toLocaleString()).format("DD/MM/YYYY") : dayjs().format("DD/MM/YYYY"),
      value && value[1] ? dayjs(value[1].toLocaleString()).format("DD/MM/YYYY") : dayjs().add(1, "day").format("DD/MM/YYYY"),
    ]);
  };

  const getTimeValue = (value: any[]) => {
    setTimeValue([
      value && value[0] ? value[0] : dayjs().hour() + ":00",
      value && value[1] ? value[1] : dayjs().hour() + ":00",
    ]);
  };

  const formatDate = (date: string) => {
    const arr = date.split("/");
    return arr[1] + "/" + arr[0] + "/" + arr[2];
  };

  // Hàm lọc dữ liệu
  const applyFilters = (cars: CarModels[]): CarModels[] => {
    return cars.filter((car) => {
      return (
        (filters.seats == null || car.numberOfSeat == filters.seats) &&
        (filters.transmission == null || car.carType.transmissionType == filters.transmission) &&
        (filters.fuel == null || car.carType.flue == filters.fuel)
      );
    });
  };

  // Lấy danh sách xe ban đầu dựa trên thời gian
  const getListCarFree = async () => {
    try {
      const res = await axiosInstance.get("/car/getAllCarFree", {
        params: {
          key: [
            dayjs(formatDate(dateValue[0]) + " " + timeValue[0]).toDate(),
            dayjs(formatDate(dateValue[1]) + " " + timeValue[1]).toDate(),
          ],
        },
      });
      setFilteredCars(applyFilters(res.data));
    } catch (err) {
      console.log(err);
      message.error("Lỗi khi tải danh sách xe!");
    }
  };

  // Lấy tất cả xe mà không áp dụng bộ lọc thời gian
  const getAllCars = async () => {
    try {
      const res = await axiosInstance.get("/car/getAllCar");
      setFilteredCars(applyFilters(res.data));
      setFilters({ seats: null, transmission: null, fuel: null });
    } catch (err) {
      console.log(err);
      message.error("Lỗi khi tải danh sách xe!");
    }
  };

  useEffect(() => {
    getListCarFree();
  }, []);

  // Cập nhật filteredCars khi filters thay đổi
  useEffect(() => {
    getListCarFree();
  }, [filters]);

  const handleSeatSelect = ({ key }: { key: string }) => {
    setFilters((prev) => ({ ...prev, seats: key }));
    setCurrentPage(1);
  };

  const handleTransmissionSelect = ({ key }: { key: string }) => {
    setFilters((prev) => ({
      ...prev,
      transmission: key === "true",
    }));
    setCurrentPage(1);
  };

  const handleFuelSelect = ({ key }: { key: string }) => {
    setFilters((prev) => ({
      ...prev,
      fuel: parseInt(key),
    }));
    setCurrentPage(1);
  };

  const indexOfLastCar = currentPage * itemsPerPage;
  const indexOfFirstCar = indexOfLastCar - itemsPerPage;
  const currentCars = filteredCars?.slice(indexOfFirstCar, indexOfLastCar) || [];
  const totalPages = Math.ceil((filteredCars?.length || 0) / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Dropdown menus
  const seatMenu = (
    <Menu onClick={handleSeatSelect}>
      {NumberOfSeat.map((item) => (
        <Menu.Item key={item.value}>{item.label}</Menu.Item>
      ))}
    </Menu>
  );

  const transmissionMenu = (
    <Menu onClick={handleTransmissionSelect}>
      {TranmissionType.map((item) => (
        <Menu.Item key={item.value.toString()}>{item.label}</Menu.Item>
      ))}
    </Menu>
  );

  const fuelMenu = (
    <Menu onClick={handleFuelSelect}>
      {Flue.map((item) => (
        <Menu.Item key={item.value}>{item.label}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="w-full bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="w-full bg-black text-white shadow-lg py-4 px-4 md:px-24">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
          <div className="flex w-full md:w-auto items-center gap-3 bg-white rounded-lg shadow-md p-2">
            <div className="flex items-center shadow-md hover:shadow-lg transition-all duration-200">
              <div
                className="h-14 w-14 flex items-center justify-center text-sky-500 hover:text-sky-600 cursor-pointer transition-colors duration-200"
                onClick={() => setIsOpenModalN(true)}
              >
                <CalendarMonthIcon fontSize="large" />
              </div>
              <div className="flex-grow px-4 py-2">
                <div className="text-xs text-gray-500 font-medium">Thời gian thuê</div>
                <div className="text-sm font-semibold text-gray-800">
                  {timeValue[0]}, {dateValue[0]}{" "}
                  <span className="text-sky-500">đến</span> {timeValue[1]}, {dateValue[1]}
                </div>
              </div>
            </div>
            <CarModal
              isOpen={isOpenModalN}
              onCancel={() => setIsOpenModalN(false)}
              title="Thời gian thuê xe"
              element={
                <CarCalendar
                  setDateValue={getDateValue}
                  setTimeValue={getTimeValue}
                  onSubmit={() => setIsOpenModalN(false)}
                />
              }
            />
            <Button
              onClick={getListCarFree}
              size="large"
              className="bg-sky-500 text-white border-none hover:bg-sky-600 rounded-lg"
            >
              TÌM XE
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Dropdown overlay={seatMenu}>
              <Button className="bg-white text-gray-800 border-none rounded-lg flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                <PersonIcon fontSize="small" className="text-sky-500" />
                Số chỗ
                <DownOutlined className="text-gray-600" />
              </Button>
            </Dropdown>
            <Dropdown overlay={transmissionMenu}>
              <Button className="bg-white text-gray-800 border-none rounded-lg flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                <UsbIcon fontSize="small" className="text-sky-500" />
                Loại xe
                <DownOutlined className="text-gray-600" />
              </Button>
            </Dropdown>
            <Dropdown overlay={fuelMenu}>
              <Button className="bg-white text-gray-800 border-none rounded-lg flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                <LocalGasStationIcon fontSize="small" className="text-sky-500" />
                Nhiên liệu
                <DownOutlined className="text-gray-600" />
              </Button>
            </Dropdown>
            <Button
              onClick={getAllCars}
              className="bg-sky-500 text-white border-none rounded-lg px-4 py-2 hover:bg-sky-600"
            >
              Tất cả
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-24 py-12">
        {currentCars.length > 0 ? (
          <>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
              dataSource={currentCars}
              renderItem={(item) => (
                <List.Item>
                  <CarItem carModel={item} />
                </List.Item>
              )}
            />
            <div className="flex justify-center mt-8">
              <AntdPagination
                current={currentPage}
                total={filteredCars?.length || 0}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
                showSizeChanger={false}
                className="text-sky-500"
              />
            </div>
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