import { Modal, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { CarModel } from "../../checkout/models";

interface Props {
    isOpen: boolean;
    onCancel: () => void;
    listCar: CarModel[] | [];
    setListCarSelect: (list: string[]) => void;
}

const ModalSelectCar = ({ isOpen, onCancel, listCar, setListCarSelect }: Props) => {
    const [selectedCars, setSelectedCars] = useState<string[]>([]);
    useEffect(() => {
        setListCarSelect(selectedCars)
    }, [selectedCars])
    const radioTransmissionType = [
        { label: "Số tự động", value: true },
        { label: "Số sàn", value: false },
    ];

    const radioFlue = [
        { label: "Máy Xăng", value: 1 },
        { label: "Máy Dầu", value: 2 },
        { label: "Máy Điện", value: 3 },
    ];

    const handleCheckboxChange = (carId: string) => {
        setSelectedCars((prev) =>
            prev.includes(carId)
                ? prev.filter((id) => id !== carId)
                : [...prev, carId]
        );
    };

    return (
        <Modal
            title={
                <div className="flex items-center justify-center text-xl font-semibold text-gray-800">
                    Select other Car
                </div>
            }
            open={isOpen}
            onCancel={onCancel}
            width={750}
            centered
            footer={null}
            className="rounded-xl overflow-hidden" // Thêm bo tròn và ẩn tràn cho modal
        >
            <div className="max-h-[60vh] overflow-y-auto px-4 py-3">
                {listCar.length > 0 ? (
                    <div className="grid gap-4">
                        {listCar.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors shadow-sm" // Thêm bóng đổ và hover effect
                            >
                                <Checkbox
                                    checked={selectedCars.includes(item._id || idx.toString())}
                                    onChange={() => handleCheckboxChange(item._id || idx.toString())}
                                    className="shrink-0 mr-4" // Thêm margin phải cho checkbox
                                />
                                <img src={`http://localhost:3030${item?.images[0]}`} alt={item.carName} className="w-32 h-32 object-cover rounded-md" />
                                <div className="ml-4 flex-grow">
                                    <h6 className="text-sm font-semibold text-blue-800">{item.carName} {item.carVersion}</h6>
                                    <ul className="space-y-1">
                                        <li>Giá thuê: <span className="font-medium text-blue-700">{item.price}k / 1h</span></li>
                                        <li>Biển số: <span className="font-medium text-blue-700">{item.licensePlateNumber}</span></li>
                                        <li>Số chỗ: <span className="font-medium text-blue-700">{item.numberOfSeat}</span></li>
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No cars available
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ModalSelectCar;