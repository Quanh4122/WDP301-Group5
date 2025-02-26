import { Button, Form, Input } from "antd";
import React from "react";
import BannerCreateCar from '../../assets/banner-created-car.png'

const CarCreate = () => {
    return (
        <div className="w-full h-auto flex p-10">
            <div className="w-2/5 px-20">
                <div className="w-full font-bold text-lg text-sky-500">
                    Thêm xe
                </div>
                <Form className="">
                    <div className="w-full flex justify-between">
                        <Form.Item>
                            <Input placeholder="Tên xe" />
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder="Màu xe" />
                        </Form.Item>
                    </div>
                    <div className="w-full flex justify-between">
                        <Form.Item>
                            <Input placeholder="Ảnh xe" />
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder="Đời xe" />
                        </Form.Item>
                    </div>
                    <div className="w-full flex justify-between">
                        <Form.Item>
                            <Input placeholder="Số lượng chỗ" />
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder="Nguyên liệu tiêu thụ" />
                        </Form.Item>
                    </div>
                    <div className="w-full flex justify-between">
                        <Form.Item>
                            <Input placeholder="Số tự động hay số sàn" />
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder="Nguyên liệu tiêu thụ" type="" />
                        </Form.Item>
                    </div>
                </Form>
                <Button type="primary" className="w-full h-12 text-lg font-bold">Tạo xe</Button>
            </div>
            <div className="w-1/2">
                <img src={BannerCreateCar} alt="banner-create-car" />
            </div>
        </div>
    )
}

export default CarCreate