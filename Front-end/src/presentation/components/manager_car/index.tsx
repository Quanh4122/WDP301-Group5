import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import CarTable from "./component/CarTable";


// Định nghĩa kiểu cho CarType
interface CarType {
    _id: string;
    bunkBed: boolean;
    flue: number;
    transmissionType: boolean;
}

// Định nghĩa kiểu cho Car
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

const CarList: React.FC = () => {
    const [carList, setCarList] = useState<Car[] | undefined>(undefined);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axiosInstance.get("/car/getAllCar");
            setCarList(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleEdit = (car: Car) => {
        console.log("Edit car:", car);
        // Thực hiện logic chỉnh sửa
    };

    const handleDelete = (carId: string) => {
        console.log("Delete car:", carId);
        // Thực hiện logic xóa
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Danh sách xe</h1>
            {carList && (
                <CarTable
                    cars={carList}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default CarList;