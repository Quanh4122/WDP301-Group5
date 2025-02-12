import { Divider, Image, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface props {
    bill: any;
    handleOk: () => void;
    handleCancel: () => void;
    isOpen: boolean;
}

const Bill = ({
    bill,
    handleOk,
    handleCancel,
    isOpen
}: props) => {

    useEffect(() => {

    }, [])

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
                            bill?.images?.map((item: any) => {
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
                                {bill?.name}
                            </div>
                            <div className="py-2 font-bold">
                                Money:
                                <span className="px-2 font-sans">
                                    {bill?.price} $
                                </span>

                            </div>
                            <div className="py-2 font-bold">
                                Quantity:
                                <span className="px-2 font-sans">
                                    {bill?.quantity}
                                </span>
                            </div>
                            <div className="py-2 font-bold">
                                Size:
                                <span className="px-2 font-sans">
                                    {bill?.size}
                                </span>
                            </div>
                            <div className="py-2 font-bold">
                                Total:
                                <span className="px-2 font-sans">
                                    {Number(bill?.quantityProduct) * Number(bill?.price)}
                                </span>
                            </div>
                            <div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default Bill