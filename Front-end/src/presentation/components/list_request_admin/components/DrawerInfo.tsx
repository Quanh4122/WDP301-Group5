import { Drawer } from "antd";
import React from "react";

interface props {
    visible: boolean;
    requestId: string;
    onClose: () => void;
    onSuccess?: () => void; // Callback khi submit thành công
}

const DrawerInfo = ({ visible, requestId, onClose }: props) => {
    return (
        <Drawer
            open={visible}
            onClose={onClose}
        >

        </Drawer>
    )
}

export default DrawerInfo