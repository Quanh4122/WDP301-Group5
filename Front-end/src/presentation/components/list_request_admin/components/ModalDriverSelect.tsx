import { Checkbox, Modal } from "antd";
import React from "react";
import PersonIcon from '@mui/icons-material/Person';

interface props {
    isOpen: boolean;
    onCancel: () => void,
    listDriver?: any[],
    onSelectedValue: (value: any) => void;
}

const ModalDriverSelect = ({ isOpen, onCancel, listDriver, onSelectedValue }: props) => {
    return (
        <Modal
            title={<div className="flex items-center justify-center text-xl font-bold">Danh sách tài xế rảnh</div>}
            open={isOpen}
            onCancel={onCancel}
            width={750}
            centered
            footer={<></>}
            className="overflow-y-auto"
        >
            <div>
                <div>
                    {listDriver?.map((item, index) => (
                        <Checkbox
                            key={index}
                            onChange={(val) => onSelectedValue({ isSelect: val.target.checked, value: val.target.value })}
                            value={item._id}
                        >
                            <div className="flex items-center w-28 mb-3">
                                <div>
                                    {item.user.images ? (
                                        <img
                                            src={`http://localhost:3030${item.user.images}`}
                                            alt="Avatar Preview"
                                            className="w-10 h-10 mx-auto border rounded-full object-cover"
                                        />
                                    ) : <PersonIcon />}
                                </div>
                                {item.user.userName}
                            </div>
                        </Checkbox>
                    ))}
                </div>
            </div>
        </Modal>
    )
}

export default ModalDriverSelect