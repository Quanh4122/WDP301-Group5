import React from "react";
import CarMany from '../../../assets/car-many-image.png'
import { Box, Button, Typography } from "@mui/material";


const ManyCarBanner = () => {
    return (
        <Box
            sx={{
                position: 'relative',
                height: 400, // Điều chỉnh chiều cao cho phù hợp
                overflow: 'hidden', // Để ẩn phần hình ảnh thừa
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <img src={CarMany} />
            {/* Khung chứa nội dung */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Màu nền trong suốt
                    padding: 4,
                    borderRadius: 1,
                    textAlign: 'center',
                }}
                className="w-full max-w-md" // Sử dụng Tailwind để giới hạn chiều rộng
            >
                {/* Tiêu đề */}
                <Typography variant="h5" component="h2" gutterBottom >
                    1,000+ xe và hơn thế nữa
                    <br />
                    Hãy trải nghiệm hôm nay!
                </Typography>

                {/* Nút */}
                <Button variant="contained" color="primary">
                    TÌM XE
                </Button>
            </Box>
        </Box>
    )
}

export default ManyCarBanner