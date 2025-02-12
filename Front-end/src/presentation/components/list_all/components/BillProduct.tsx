import React, { useEffect, useState } from "react";
import { dataBill } from "../CONSTANTS";
import { Button, Divider, Form, Image, Input, InputNumber, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PRIVATE_ROUTES, ROOT } from "../../../routes/CONSTANTS";

interface props {
    dataBill?: dataBill,
    handleOk: () => void;
    handleCancel: () => void;
    isOpen: boolean;
}

const BillProduct = ({
    dataBill,
    handleOk,
    handleCancel,
    isOpen
}: props) => {
    const [form] = useForm()
    const navigate = useNavigate()
    const onFinish = () => {
        const phoneNumber = form.getFieldValue("phoneNumber")
        if (dataBill?.id && dataBill?.quantityProduct && dataBill?.size) {
            const dataSubmit = {
                productId: dataBill?.id,
                quantity: dataBill?.quantityProduct,
                size: dataBill?.size,
                price: dataBill.price,
                images: dataBill.image,
                phoneNumber: phoneNumber
            }
            console.log(dataSubmit)
            axios.post("http://localhost:3030/carts", dataSubmit)
                .then((res) => {
                    console.log("Post successfull !!!", res.data)
                    navigate(ROOT)
                })
                .catch((err) => console.log(err))
        }

    }
    return (
        <Modal
            open={isOpen}
            onCancel={handleCancel}
            onOk={handleOk}
            width={800}
            footer={<></>}
        >
            <div className="w-full  overflow-hidden flex justify-center">
                <div className="bg-white">
                    <div className="w-full px-7 py-4 h-auto flex items-center justify-center">
                        {
                            dataBill?.image?.map((item) => {
                                return (
                                    <Image src={item} width={200} />
                                )
                            })
                        }
                    </div>
                    <Divider />
                    <div className="w-full h-full py-2 px-40 flex justify-center">
                        <div>
                            <div className="font-bold font-sans py-2">
                                {dataBill?.name}
                            </div>
                            <div className="py-2 font-bold">
                                Money:
                                <span className="px-2 font-sans">
                                    {dataBill?.price} $
                                </span>

                            </div>
                            <div className="py-2 font-bold">
                                Quantity:
                                <span className="px-2 font-sans">
                                    {dataBill?.quantityProduct}
                                </span>
                            </div>
                            <div className="py-2 font-bold">
                                Size:
                                <span className="px-2 font-sans">
                                    {dataBill?.size}
                                </span>
                            </div>
                            <div className="py-2 font-bold">
                                Total:
                                <span className="px-2 font-sans">
                                    {Number(dataBill?.quantityProduct) * Number(dataBill?.price)}
                                </span>
                            </div>
                            <div>
                                <Form
                                    form={form}
                                    onFinish={onFinish}
                                    style={{ maxWidth: 600 }}
                                    initialValues={{ remember: true }}
                                    autoComplete="off"
                                >

                                    <Form.Item label="Your phone number " name="phoneNumber" rules={[{ required: true, message: "Please select you quantity !!!" }]}>
                                        <Input />
                                    </Form.Item>
                                    <Button htmlType="submit" type="primary" className="w-full">Buy Now</Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default BillProduct