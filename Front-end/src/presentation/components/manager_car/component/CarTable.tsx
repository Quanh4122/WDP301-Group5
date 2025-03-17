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
    onEdit?: (car: Car) => void;
    onDelete?: (carId: string) => void;
    onCreate?: () => void;
}

const CarTable: React.FC<CarTableProps> = ({ cars, onEdit, onDelete, onCreate }) => {
    const [searchText, setSearchText] = useState<string>("");
    const [flueFilter, setFlueFilter] = useState<number>(0);
    const [seatFilter, setSeatFilter] = useState<number>(0);
    const [filteredCars, setFilteredCars] = useState<Car[]>(cars);
    const [currentPage, setCurrentPage] = useState<number>(1);

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
    }, [searchText, flueFilter, seatFilter, cars]);

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
        { title: "STT", key: "stt", render: (_, __, index) => (currentPage - 1) * 5 + index + 1, width: 60, align: "center" },
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
                <span className="text-blue-600 font-medium">{price.toLocaleString()}</span>
            ),
            width: 120,
        },
        {
            title: "Hành động",
            key: "action",
            render: (record: Car) => (
                <Space size="middle">
                    {onEdit && (
                        <Button
                            type="primary"
                            onClick={() => onEdit(record)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white border-none rounded-lg shadow-md transition duration-200"
                        >
                            Sửa
                        </Button>
                    )}
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

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-semibold text-gray-800">Danh sách xe</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

                    {onCreate && (
                        <div>
                            <Button
                                type="primary"
                                onClick={onCreate}

                            >
                                Tạo xe mới
                            </Button>
                        </div>

                    )}
                    <div className="md:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Input
                                    placeholder="Tìm kiếm theo tên xe hoặc biển số"
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg  focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                                />
                            </div>
                            <div>
                                <Select
                                    placeholder="Chọn loại nhiên liệu"
                                    value={flueFilter}
                                    onChange={(value) => setFlueFilter(value)}
                                    options={flueOptions}
                                    className="w-full h-12 border-gray-300 rounded-lg  focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                                />
                            </div>
                            <div>
                                <Select
                                    placeholder="Chọn số chỗ ngồi"
                                    value={seatFilter}
                                    onChange={(value) => setSeatFilter(value)}
                                    options={seatOptions}
                                    className="w-full h-12 border-gray-300 rounded-lg  focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
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
                        pagination={{
                            pageSize: 5,
                            showSizeChanger: false,
                            className: "mt-4",
                            itemRender: (page, type, originalElement) => {
                                if (type === "prev") {
                                    return (
                                        <button
                                            className={`px-3 py-1 text-sm rounded-md shadow-sm hover:bg-blue-600 transition duration-200 ${page === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
                                                }`}
                                        >
                                            Previous
                                        </button>
                                    );
                                }
                                if (type === "next") {
                                    return (
                                        <button
                                            className={`px-3 py-1 text-sm rounded-md shadow-sm hover:bg-blue-600 transition duration-200 ${page === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
                                                }`}
                                        >
                                            Next
                                        </button>
                                    );
                                }
                                if (type === "page") {
                                    return (
                                        <button
                                            className={`px-3 py-1 text-sm rounded-md shadow-sm hover:bg-blue-100 transition duration-200 ${page === Math.ceil(filteredCars.length / 5)
                                                ? "bg-blue-700 text-white"
                                                : "bg-gray-200"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                }
                                return originalElement;
                            },
                            onChange: (page) => setCurrentPage(page),
                        }}
                        className="w-full"
                        rowClassName="hover:bg-gray-50 transition duration-200"
                    />
                </div>
            </div>
        </div>
    );
};

export default CarTable;