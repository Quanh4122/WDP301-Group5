import { Box, Divider, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { RequestModelFull } from "../../checkout/models";
import SitemarkIcon from "../../checkout/components/SitemarkIcon";
import dayjs from "dayjs";

interface props {
    isOpen: boolean;
    onCancel: () => void,
    title?: String;
    detailRequest: RequestModelFull
}

const DetailRequestItem = ({ isOpen, onCancel, title, detailRequest }: props) => {

    const [totalTime, setTotalTime] = useState<any>()
    const [VATFee, setVATFee] = useState<any>()
    const [totalFee, setTotalFee] = useState<any>()
    const [startDate, setStartDate] = useState<any>()
    const [endDate, setEndDate] = useState<any>()

    useEffect(() => {
        calculateTotalTimeBooking()
        console.log(detailRequest)
    }, [])

    const calculateTotalTimeBooking = () => {
        const startDate = dayjs(detailRequest.startDate)
        const endDate = dayjs(detailRequest.endDate)
        const total = endDate.diff(startDate, 'hour', true)
        setStartDate(startDate.format("HH:mm, DD/MM/YYYY"))
        setEndDate(endDate.format("HH:mm, DD/MM/YYYY"))
        setTotalTime(total)
        const arrprice = detailRequest?.car.map((item) => item.price).reduce((total, current) => {
            return total + current
        })
        const calVATFee = arrprice * total * 0.1
        setVATFee(calVATFee)
        setTotalFee(calVATFee + arrprice * total)
    }

    return (
        <Modal
            title={<div className="flex items-center justify-center text-xl font-bold">{title}</div>}
            open={isOpen}
            onCancel={onCancel}
            centered
            footer={<div>
                {/* <Button>Đồng ý</Button>
                <Button>Từ chối</Button> */}
            </div>}
        >
            <div className="flex">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        width: '100%',
                        maxWidth: 500,
                        paddingX: 5
                    }}
                >
                    <List disablePadding>
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Ngày nhận" />
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{startDate}</Typography>
                        </ListItem>
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Ngày trả" />
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{endDate}</Typography>
                        </ListItem>
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Thuế VAT" />
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{(VATFee * 1000).toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            })}</Typography>
                        </ListItem>
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Total" />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                {(totalFee * 1000).toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                })}
                            </Typography>
                        </ListItem>
                        {/*<ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Total" />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                $144.97
                            </Typography>
                        </ListItem>
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Total" />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                $144.97
                            </Typography>
                        </ListItem> */}
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
                            <Typography gutterBottom>Họ và tên: <span className='text-gray-500'>{detailRequest.user?.userName}</span></Typography>
                            <Typography gutterBottom>Email: <span className='text-gray-500'>{detailRequest.user?.email}</span></Typography>
                            <Typography gutterBottom>Số điện thoại: <span className='text-gray-500'>{detailRequest.user?.phoneNumber}</span></Typography>
                        </div>

                    </Stack>
                </Box>
            </div>

        </Modal >
    )
}

export default DetailRequestItem