import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Space, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";

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
    onDelete?: (carId: string) => void;
    onCreate?: () => void;
}

const CarTable: React.FC<CarTableProps> = ({ cars, onEdit, onDelete, onCreate }) => {
    const [searchText, setSearchText] = useState<string>("");
    const [flueFilter, setFlueFilter] = useState<number>(0);
    const [seatFilter, setSeatFilter] = useState<number>(0);
    const [filteredCars, setFilteredCars] = useState<Car[]>(cars);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 5;

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
            filtered = filtered.filter((car) =>
                validSeatValues.includes(car.numberOfSeat)
            );
        }
        setFilteredCars(filtered);
        setCurrentPage(1);
    }, [searchText, flueFilter, seatFilter, cars, validSeatValues]);

    const getTransmissionLabel = (value: boolean) =>
        value ? "Số tự động" : "Số sàn";
    const getFlueLabel = (value: number) => {
        const flueMap: { [key: number]: string } = {
            1: "Máy Xăng",
            2: "Máy Dầu",
            3: "Máy Điện",
        };
        return flueMap[value] || "Không xác định";
    };
    const getBunkBedLabel = (value: boolean) =>
        value ? "Có giường tầng" : "Không có giường tầng";

    const columns: ColumnsType<Car> = [
        { title: "STT", key: "stt", render: (_, __, index) => (currentPage - 1) * pageSize + index + 1, width: 60, align: "center" },
        { title: "Tên xe", dataIndex: "carName", key: "carName", ellipsis: true },
        { title: "Phiên bản", dataIndex: "carVersion", key: "carVersion", ellipsis: true, width: 80 },
        { title: "Màu sắc", dataIndex: "color", key: "color", ellipsis: true, width: 100 },
        { title: "Biển số", dataIndex: "licensePlateNumber", key: "licensePlateNumber", ellipsis: true },
        { title: "Số chỗ", dataIndex: "numberOfSeat", key: "numberOfSeat", width: 80 },
        {
            title: "Loại truyền động",
            key: "transmissionType",
            render: (record: Car) => getTransmissionLabel(record.carType.transmissionType),
            ellipsis: true,
        },
        { title: "Nhiên liệu", key: "flue", render: (record: Car) => getFlueLabel(record.carType.flue), ellipsis: true },
        { title: "Giường tầng", key: "bunkBed", render: (record: Car) => getBunkBedLabel(record.carType.bunkBed), ellipsis: true },
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
                    >
                        Sửa
                    </Button>
                    {onDelete && (
                        <Button
                            type="primary"
                            danger
                            onClick={() => onDelete(record._id)}
                            className="bg-red-500 hover:bg-red-600 text-white border-none rounded-lg shadow-md transition duration-200"
                        >
                            Xóa
                        </Button>
                    )}
                </Space>
            ),
            width: 180,
        },
    ];

    const totalPages = Math.ceil(filteredCars.length / pageSize);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

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

    const PaginationCustom = () => (
        <div className="flex justify-center items-center mt-6 space-x-2">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-sky-500 text-white disabled:bg-gray-300 hover:bg-sky-600 transition-all duration-200 disabled:cursor-not-allowed"
            >
                Trước
            </button>
            {getPageNumbers().pages.map((page) => (
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-sky-500 text-white disabled:bg-gray-300 hover:bg-sky-600 transition-all duration-200 disabled:cursor-not-allowed"
            >
                Sau
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-semibold text-gray-800">Danh sách xe</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {onCreate && (
                        <Button
                            type="primary"
                            onClick={onCreate}
                            className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-200 mb-4 md:mb-0"
                        >
                            Tạo xe mới
                        </Button>
                    )}
                    <div className="md:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Input
                                    placeholder="Tìm kiếm theo tên xe hoặc biển số"
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-sky-500 focus:ring-sky-500 py-2 px-3"
                                />
                            </div>
                            <div>
                                <Select
                                    placeholder="Chọn loại nhiên liệu"
                                    value={flueFilter}
                                    onChange={(value) => setFlueFilter(value)}
                                    options={flueOptions}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Select
                                    placeholder="Chọn số chỗ ngồi"
                                    value={seatFilter}
                                    onChange={(value) => setSeatFilter(value)}
                                    options={seatOptions}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <Table
                        columns={columns}
                        dataSource={filteredCars}
                        rowKey="_id"
                        pagination={false} // Tắt phân trang mặc định của antd
                        className="w-full"
                        rowClassName="hover:bg-gray-50 transition duration-200"
                    />
                </div>
                <PaginationCustom />
            </div>
        </div>
    );
};

export default CarTable;