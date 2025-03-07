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

    useEffect(() => {
        calculateTotalTimeBooking()
    }, [])

    const calculateTotalTimeBooking = () => {
        const startDate = dayjs(detailRequest.startDate)
        const endDate = dayjs(detailRequest.endDate)
        const total = endDate.diff(startDate, 'hour', true)
        setTotalTime(total)
        // const calVATFee = detailRequest.car.price * total * 0.1
        // setVATFee(calVATFee)
        // setTotalFee(calVATFee + detailRequest.car.price * total)
    }

    return (
        <Modal
            title={<div className="flex items-center justify-center text-xl font-bold">{title}</div>}
            open={isOpen}
            onCancel={onCancel}
            width={1000}
            centered
            footer={<div>
                <Button>Đồng ý</Button>
                <Button>Từ chối</Button>
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
                        paddingX: 5,
                    }}
                >
                    <React.Fragment>
                        {/* <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        Tên xe
      </Typography> */}
                        <Typography variant="h4" gutterBottom>
                            {/* {detailRequest.car.carName + " " + detailRequest.car.carVersion} */}
                        </Typography>
                        <List disablePadding>
                            <ListItem sx={{ py: 1, px: 0 }}>
                                <ListItemText
                                    sx={{ mr: 2 }}
                                    primary={"Giá thuê: "}
                                />
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {/* {detailRequest.car.price}k / 1h */}
                                </Typography>
                            </ListItem>
                            <ListItem sx={{ py: 1, px: 0 }}>
                                <ListItemText
                                    sx={{ mr: 2 }}
                                    primary={"Màu xe: "}
                                />
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {/* {detailRequest.car.color} */}
                                </Typography>
                            </ListItem>
                            <ListItem sx={{ py: 1, px: 0 }}>
                                <ListItemText
                                    sx={{ mr: 2 }}
                                    primary={"Biển số xe: "}
                                />
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {/* {detailRequest.car.licensePlateNumber} */}
                                </Typography>
                            </ListItem>
                            <ListItem sx={{ py: 1, px: 0 }}>
                                <ListItemText
                                    sx={{ mr: 2 }}
                                    primary={"Số chỗ: "}
                                />
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {/* {detailRequest.car.numberOfSeat} */}
                                </Typography>
                            </ListItem>
                            {/* <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText
            sx={{ mr: 2 }}
            primary={"Nguyễn liệu tiêu thụ: "}
          />
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {carModel.carType.flue == 1 ? "Máy xăng" : carModel.carType.flue == 2 ? "Máy dầu" : "Máy điện"}
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText
            sx={{ mr: 2 }}
            primary={"Loại chuyển động: "}
          />
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {carModel.carType.transmissionType ? "Số tự động" : "Số sàn"}
          </Typography>
        </ListItem> */}
                        </List>
                    </React.Fragment>
                </Box>
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
                            <ListItemText primary="Thời gian thuê" />
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{totalTime} h</Typography>
                        </ListItem>
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Thuế VAT" />
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{VATFee} kđ</Typography>
                        </ListItem>
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Total" />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                {totalFee}
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
                                Thông tin của bạn
                            </Typography>
                            <Typography gutterBottom>Họ và tên: <span className='text-gray-500'>{detailRequest.user.userName}</span></Typography>
                            <Typography gutterBottom>Email: <span className='text-gray-500'>{detailRequest.user.email}</span></Typography>
                            <Typography gutterBottom>Số điện thoại: <span className='text-gray-500'>{detailRequest.user.phoneNumber}</span></Typography>
                        </div>

                    </Stack>
                </Box>
            </div>

        </Modal >
    )
}

export default DetailRequestItem