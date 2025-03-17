import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { message, Form } from "antd";
import CarTable from "./component/CarTable";
import CarFormDrawer from "./component/CarFormDrawer";


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

const CarList: React.FC = () => {
    const [carList, setCarList] = useState<Car[] | undefined>(undefined);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [carEdit, setCarEdit] = useState<Car | undefined>()
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get("/car/getAllCar");
                setCarList(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);

    const handleEdit = (car: Car) => {
        setCarEdit(car)
        setIsDrawerVisible(true);
    };

    const handleDelete = (carId: string) => {
        console.log("Delete car:", carId);
    };

    const handleCreate = () => {
        setIsDrawerVisible(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {carList ? (
                <CarTable
                    cars={carList}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCreate={handleCreate}
                />
            ) : (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}
            <CarFormDrawer
                isDrawerVisible={isDrawerVisible}
                setIsDrawerVisible={setIsDrawerVisible}
                form={form}
                carEdit={carEdit}
                setCarList={setCarList}
            />
        </div>
    );
};

export default CarList;