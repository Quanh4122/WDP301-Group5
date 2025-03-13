import { Box, Divider, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { RequestModelFull } from "../../checkout/models";
import SitemarkIcon from "../../checkout/components/SitemarkIcon";
import dayjs from "dayjs";

interface Props {
    isOpen: boolean;
    onCancel: () => void;
    title?: string; // Changed String to string (lowercase 's' for TypeScript)
    detailRequest: RequestModelFull;
}

const DetailRequestItem = ({ isOpen, onCancel, title, detailRequest }: Props) => {
    const [totalTime, setTotalTime] = useState<number | null>(null);
    const [VATFee, setVATFee] = useState<number | null>(null);
    const [totalFee, setTotalFee] = useState<number | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    useEffect(() => {
        calculateTotalTimeBooking();
        console.log(detailRequest);
    }, [detailRequest]); // Added detailRequest as a dependency to recalculate if it changes

    const calculateTotalTimeBooking = () => {
        const start = dayjs(detailRequest.startDate);
        const end = dayjs(detailRequest.endDate);
        const total = end.diff(start, 'hour', true); // Total hours, including decimals
        setStartDate(start.format("HH:mm, DD/MM/YYYY"));
        setEndDate(end.format("HH:mm, DD/MM/YYYY"));
        setTotalTime(total);

        // Handle the case where detailRequest.car might be empty or undefined
        const carPrices = detailRequest?.car?.map(item => item.price) || [];
        const arrprice = carPrices.reduce((total, current) => total + current, 0); // Added initial value 0
        const calVATFee = arrprice * total * 0.1; // 10% VAT
        setVATFee(calVATFee);
        setTotalFee(calVATFee + arrprice * total);
    };

    return (
        <Modal
            title={<div className="flex items-center justify-center text-xl font-bold">{title}</div>}
            open={isOpen}
            onCancel={onCancel}
            centered
            footer={<div>{/* <Button>Đồng ý</Button><Button>Từ chối</Button> */}</div>}
        >
            <div className="flex">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        width: '100%',
                        maxWidth: 500,
                        paddingX: 5,
                    }}
                >
                    <List disablePadding>
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Ngày nhận" />
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {startDate || "N/A"}
                            </Typography>
                        </ListItem>
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Ngày trả" />
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {endDate || "N/A"}
                            </Typography>
                        </ListItem>
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Thuế VAT" />
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {VATFee !== null
                                    ? (VATFee * 1000).toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })
                                    : "N/A"}
                            </Typography>
                        </ListItem>
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Total" />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                {totalFee !== null
                                    ? (totalFee * 1000).toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })
                                    : "N/A"}
                            </Typography>
                        </ListItem>
                    </List>
                    <Divider />
                    <Stack
                        direction="column"
                        divider={<Divider flexItem />}
                        spacing={2}
                        sx={{ my: 2 }}
                    >
                        <div>
                            <Typography variant="subtitle2" gutterBottom>
                                <div className="font-bold">Thông tin của bạn</div>
                            </Typography>
                            <Typography gutterBottom>
                                Họ và tên: <span className="text-gray-500">{detailRequest.user?.userName || "N/A"}</span>
                            </Typography>
                            <Typography gutterBottom>
                                Email: <span className="text-gray-500">{detailRequest.user?.email || "N/A"}</span>
                            </Typography>
                            <Typography gutterBottom>
                                Số điện thoại: <span className="text-gray-500">{detailRequest.user?.phoneNumber || "N/A"}</span>
                            </Typography>
                        </div>
                    </Stack>
                </Box>
            </div>
        </Modal>
    );
};

export default DetailRequestItem;