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
                                <div className="flex items-center w-full">
                                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden"> {/*Thêm overflow hidden để ảnh không tràn ra khỏi div*/}
                                        <img
                                            src={item.images[0]}
                                            alt="car"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col ml-4 w-full"> {/* Thay đổi flex direction sang column và thêm margin trái*/}
                                        <div className="font-semibold text-lg text-gray-900">
                                            {item.carName} {item.carVersion}
                                        </div>
                                        <div className="text-gray-600 text-sm mt-1">
                                            {item.licensePlateNumber}
                                        </div>
                                        <div className="flex gap-4 text-sm text-gray-700 mt-2">
                                            <span>
                                                {radioTransmissionType.find(
                                                    (dt) => dt.value === item.cartype?.transmissionType
                                                )?.label}
                                            </span>
                                            <span>
                                                {radioFlue.find((dt) => dt.value === item.cartype?.flue)
                                                    ?.label}
                                            </span>
                                            <span className="font-medium text-blue-600">
                                                {item.price}/h
                                            </span>
                                        </div>
                                    </div>
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