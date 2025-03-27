import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Space, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Pagination from "../../home/components/Pagination";
import { toast } from "react-toastify";

// Component con để hiển thị carousel ảnh
const CarImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Tự động chuyển ảnh mỗi 3 giây
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [images]);

  // Xử lý nhấp vào chấm để chuyển ảnh
  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="relative w-full h-24">
      {images.length > 0 && currentImageIndex < images.length ? (
        <>
          <img
            src={images[currentImageIndex]}
            alt={`Car Image ${currentImageIndex}`}
            className="w-full h-24 object-cover rounded-lg shadow-sm"
            onError={() => console.log("Error loading image:", images[currentImageIndex])}
          />
          {images.length > 1 && (
            <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-2 h-2 rounded-full ${
                    currentImageIndex === index ? "bg-sky-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-600 text-center">Không có ảnh</p>
      )}
    </div>
  );
};

interface CarType {
  _id: string;
  bunkBed: boolean;
  flue: number;
  transmissionType: boolean;
}

interface Car {
  _id: string;
  carName: string;
  color: string;
  images: string[];
  carStatus: boolean;
  licensePlateNumber: string;
  price: number;
  carVersion: number;
  carType: CarType;
  numberOfSeat: number;
}

interface CarTableProps {
  cars: Car[];
  onEdit: (car: Car) => void;
  onDelete?: (carId: string) => Promise<any>;
  onCreate?: () => void;
}

const CarTable: React.FC<CarTableProps> = ({ cars, onEdit, onDelete, onCreate }) => {
  const [searchText, setSearchText] = useState<string>("");
  const [flueFilter, setFlueFilter] = useState<number>(0);
  const [seatFilter, setSeatFilter] = useState<number>(0);
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const itemsPerPage = 5;

  const flueOptions = [
    { label: "Tất cả", value: 0 },
    { label: "Máy Xăng", value: 1 },
    { label: "Máy Dầu", value: 2 },
    { label: "Máy Điện", value: 3 },
  ];

  const { seatOptions, validSeatValues } = useMemo(() => {
    const options = [
      { label: "Tất cả", value: 0 },
      ...Array.from(new Set(cars.map((car) => car.numberOfSeat)))
        .sort((a, b) => a - b)
        .map((seat) => ({
          label: `${seat} chỗ`,
          value: seat,
        })),
    ];
    const validValues = options
      .filter((option) => option.value !== 0)
      .map((option) => option.value as number);
    return { seatOptions: options, validSeatValues: validValues };
  }, [cars]);

  useEffect(() => {
    let filtered = [...cars];
    localStorage.setItem("carsData", JSON.stringify(cars));
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      filtered = filtered.filter(
        (car) =>
          car.carName.toLowerCase().includes(lowerSearchText) ||
          car.licensePlateNumber.toLowerCase().includes(lowerSearchText)
      );
    }
    if (flueFilter !== 0) {
      filtered = filtered.filter((car) => car.carType.flue === flueFilter);
    }
    if (seatFilter !== 0) {
      filtered = filtered.filter((car) => car.numberOfSeat === seatFilter);
    } else {
      filtered = filtered.filter((car) => validSeatValues.includes(car.numberOfSeat));
    }
    setFilteredCars(filtered);
    setCurrentPage(1);
  }, [searchText, flueFilter, seatFilter, cars, validSeatValues]);

  const getTransmissionLabel = (value: boolean) => (value ? "Số tự động" : "Số sàn");
  const getFlueLabel = (value: number) => {
    const flueMap: { [key: number]: string } = {
      1: "Máy Xăng",
      2: "Máy Dầu",
      3: "Máy Điện",
    };
    return flueMap[value] || "Không xác định";
  };
  const getBunkBedLabel = (value: boolean) => (value ? "Có giường tầng" : "Không có giường tầng");

  const handleDelete = async (carId: string) => {
    if (!onDelete) return;
    setLoading(true);
    try {
      await onDelete(carId);
      toast.success("Xóa xe thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setFilteredCars((prev) => prev.filter((car) => car._id !== carId));
    } catch (error) {
      toast.error("Xóa xe thất bại. Vui lòng thử lại!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Car> = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => (currentPage - 1) * itemsPerPage + index + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Ảnh",
      key: "images",
      render: (record: Car) => <CarImageCarousel images={record.images.map(image => `http://localhost:3030${image}`)} />,
      width: 130,
    },
    {
      title: "Tên xe",
      dataIndex: "carName",
      key: "carName",
      ellipsis: true,
      width: 170, // Thêm chiều rộng cố định để cột rộng hơn
      render: (text: string, record: Car) => (
        <Link
          to={`/app/dashboard/manager-car/${record._id}`}
          className="text-sky-600 hover:text-sky-800 font-medium transition duration-200"
        >
          <button>{text}</button>
        </Link>
      ),
    },
    { title: "Phiên bản", dataIndex: "carVersion", key: "carVersion", ellipsis: true, width: 80 },
    { title: "Màu sắc", dataIndex: "color", key: "color", ellipsis: true, width: 100 },
    {
      title: "Biển số",
      dataIndex: "licensePlateNumber",
      key: "licensePlateNumber",
      ellipsis: true,
    },
    { title: "Số chỗ", dataIndex: "numberOfSeat", key: "numberOfSeat", width: 80 },
    {
      title: "Loại truyền động",
      key: "transmissionType",
      render: (record: Car) => getTransmissionLabel(record.carType.transmissionType),
      ellipsis: true,
      width: 2,
    },
    {
      title: "Nhiên liệu",
      key: "flue",
      render: (record: Car) => getFlueLabel(record.carType.flue),
      ellipsis: true,
    },
    {
      title: "Giường tầng",
      key: "bunkBed",
      render: (record: Car) => getBunkBedLabel(record.carType.bunkBed),
      ellipsis: true,
    },
    {
      title: "Giá (VNĐ/h)",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <span className="text-sky-600 font-medium">{price.toLocaleString()}</span>
      ),
      width: 120,
    },
    {
      title: "Hành động",
      key: "action",
      render: (record: Car) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => onEdit(record)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white border-none rounded-lg shadow-md transition duration-200"
            disabled={loading}
          >
            Sửa
          </Button>
          {onDelete && (
            <Button
              type="primary"
              danger
              onClick={() => handleDelete(record._id)}
              className="bg-red-500 hover:bg-red-600 text-white border-none rounded-lg shadow-md transition duration-200"
              disabled={loading}
              loading={loading}
            >
              Xóa
            </Button>
          )}
        </Space>
      ),
      width: 180,
      align: "center",
    },
  ];

  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mt-20 mb-20 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-bold text-gray-900">Danh Sách Xe</h1>
          <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
            Cập nhật: {new Date().toLocaleString("vi-VN")}
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 flex flex-col sm:flex-row gap-4">
          {onCreate && (
            <Button
              type="primary"
              onClick={onCreate}
              className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-200"
              disabled={loading}
            >
              Tạo xe mới
            </Button>
          )}
          <div className="relative flex-1">
            <Input
              placeholder="Tìm kiếm theo tên xe hoặc biển số"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3"
              disabled={loading}
            />
          </div>
          <Select
            placeholder="Chọn loại nhiên liệu"
            value={flueFilter}
            onChange={(value) => setFlueFilter(value)}
            options={flueOptions}
            className="w-full sm:w-48"
            disabled={loading}
          />
          <Select
            placeholder="Chọn số chỗ ngồi"
            value={seatFilter}
            onChange={(value) => setSeatFilter(value)}
            options={seatOptions}
            className="w-full sm:w-48"
            disabled={loading}
          />
        </div>

        {/* Table */}
        {paginatedCars.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-gray-600 text-lg">Không tìm thấy xe nào.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table
                columns={columns}
                dataSource={paginatedCars}
                rowKey="_id"
                pagination={false}
                className="w-full"
                rowClassName="hover:bg-gray-50 transition duration-200"
                loading={loading}
              />
            </div>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-8"
        />
      </div>
    </div>
  );
};

export default CarTable;