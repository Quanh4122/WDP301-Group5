import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { CarModels } from "./model";
import { Input, Button, List, Pagination as AntdPagination, Modal, Checkbox, message } from "antd";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import UsbIcon from "@mui/icons-material/Usb";
import PersonIcon from "@mui/icons-material/Person";
import CarItem from "./components/CarItem";
import CarCalendar from "../car_detail/component/CarCalendar";
import CarModal from "../car_detail/component/CarModal";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs, { Dayjs } from "dayjs";
import { DateRange } from '@mui/x-date-pickers-pro/models';
import CarFilterModals from "./components/CarFilterModals";
import { Key } from "lucide-react";

const CarList: React.FC = () => {
  const [carList, setCarList] = useState<CarModels[] | undefined>(undefined);
  const [filteredCars, setFilteredCars] = useState<CarModels[] | undefined>(undefined);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalT, setIsOpenModalT] = useState<boolean>(false);
  const [isOpenModalF, setIsOpenModalF] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpenModalN, setIsOpenModalN] = React.useState(false);
  const itemsPerPage: number = 8;

  const filterNumberOfSeat: { label: string; value: number }[] = [
    { label: "5 chỗ", value: 5 },
    { label: "7 chỗ", value: 7 },
    { label: "9 chỗ", value: 9 },
  ];

  const filterTransmissionType: { label: string; value: boolean }[] = [
    { label: "Số tự động", value: true },
    { label: "Số sàn", value: false },
  ];

  const filterFlue: { label: string; value: number }[] = [
    { label: "Máy Xăng", value: 1 },
    { label: "Máy Dầu", value: 2 },
    { label: "Máy Điện", value: 3 },
  ];

  const [dateValue, setDateValue] = React.useState<any[]>([dayjs().format('DD/MM/YYYY'), dayjs().add(1, 'day').format('DD/MM/YYYY')]);
  const getDateValue = (value: DateRange<Dayjs>) => {
    setDateValue([
      value && value[0] ? dayjs(value[0].toLocaleString()).format('DD/MM/YYYY') : dayjs().format('DD/MM/YYYY'),
      value && value[1] ? dayjs(value[1].toLocaleString()).format('DD/MM/YYYY') : dayjs().add(1, 'day').format('DD/MM/YYYY')
    ]);
  };

  const [timeValue, setTimeValue] = React.useState<any[]>([dayjs().hour() + ":" + "00", dayjs().hour() + ":" + "00"]);

  const getTimeValue = (value: any[]) => {
    setTimeValue([
      value && value[0] ? value[0] : dayjs().hour() + ":" + "00",
      value && value[1] ? value[1] : dayjs().hour() + ":" + "00"
    ]);
  };

  const fomatDate = (date: string) => {
    const arr = date.split('/');
    return arr[1] + "/" + arr[0] + "/" + arr[2];
  };

  useEffect(() => {
    getListCarFree();
  }, []);

  const onGetData = async () => {
    try {
      const res = await axiosInstance.get("/car/getAllCar");
      setCarList(res.data);
      setFilteredCars(res.data);
    } catch (err) {
      console.log(err);
      message.error("Lỗi khi tải danh sách xe!");
    }
  };

  const getListCarFree = async () => {
    await axiosInstance.get('/car/getAllCarFree', {
      params: {
        key: [dayjs(fomatDate(dateValue[0]) + " " + timeValue[0]).toDate(), dayjs(fomatDate(dateValue[1]) + " " + timeValue[1]).toDate()],
      }
    })
      .then(res => {
        setFilteredCars(res.data);
      })
      .catch(err => console.log(err))
  }

  const indexOfLastCar = currentPage * itemsPerPage;
  const indexOfFirstCar = indexOfLastCar - itemsPerPage;
  const currentCars = filteredCars?.slice(indexOfFirstCar, indexOfLastCar) || [];
  const totalPages = Math.ceil((filteredCars?.length || 0) / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };



  return (
    <div className="w-full bg-gray-100 min-h-screen">
      {/* Header with Date Filter */}
      <div className="w-full bg-slate-700 shadow-lg py-2 px-4 md:px-24">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
          <div className="flex w-full md:w-auto items-center gap-3 bg-white rounded-md">
            <div className="flex items-center  shadow-md hover:shadow-lg transition-all duration-200">
              <div
                className="h-14 w-14 flex items-center justify-center text-sky-500 hover:text-sky-600 cursor-pointer transition-colors duration-200"
                onClick={() => setIsOpenModalN(true)}
              >
                <CalendarMonthIcon fontSize="large" />
              </div>
              <div className="flex-grow px-4 py-2">
                <div className="text-xs text-gray-500 font-medium">Thời gian thuê</div>
                <div className="text-sm font-semibold text-gray-800">
                  {timeValue[0]}, {dateValue[0]} <span className="text-sky-500">đến</span> {timeValue[1]}, {dateValue[1]}
                </div>
              </div>
            </div>
            <CarModal
              isOpen={isOpenModalN}
              onCancel={() => setIsOpenModalN(false)}
              title="Thời gian thuê xe"
              element={<CarCalendar setDateValue={getDateValue} setTimeValue={getTimeValue} onSubmit={() => setIsOpenModalN(false)} />}
            />
            <Button
              onClick={() => getListCarFree()}

              size="large"
            >
              TÌM XE
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="w-full px-4 md:px-24 py-6 flex flex-wrap gap-3 bg-white shadow-md mt-2">
        <Button
          onClick={() => onGetData()}
          className="bg-sky-500 hover:bg-sky-600 border-none text-white rounded-full px-4"
        >
          Tất cả
        </Button>
        <Button
          onClick={() => setIsOpenModal(true)}
          className="border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white rounded-full px-4 flex items-center gap-1"
        >
          <PersonIcon fontSize="small" />
          Số chỗ
        </Button>
        <CarFilterModals
          isOpen={isOpenModal}
          onCancel={() => setIsOpenModal(false)}
          option={filterNumberOfSeat}
          title="Số chỗ"
        // onSetListData={onSetListDataNumberOfSeat}
        />
        <Button
          onClick={() => setIsOpenModalT(true)}
          className="border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white rounded-full px-4 flex items-center gap-1"
        >
          <UsbIcon fontSize="small" />
          Loại xe
        </Button>
        <CarFilterModals
          isOpen={isOpenModalT}
          onCancel={() => setIsOpenModalT(false)}
          option={filterTransmissionType}
          title="Loại xe"
        //onSetListData={onSetListDataTransmissionType}
        />
        <Button
          onClick={() => setIsOpenModalF(true)}
          className="border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white rounded-full px-4 flex items-center gap-1"
        >
          <LocalGasStationIcon fontSize="small" />
          Nhiên liệu
        </Button>
        <CarFilterModals
          isOpen={isOpenModalF}
          onCancel={() => setIsOpenModalF(false)}
          option={filterFlue}
          title="Nhiên liệu"
        // onSetListData={onSetListDataFlue}
        />
      </div>

      {/* Car List */}
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