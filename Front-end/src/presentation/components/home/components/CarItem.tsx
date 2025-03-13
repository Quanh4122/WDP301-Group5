import { Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
import React from "react";
import Carimage from "../../../assets/car-image1.png";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import PersonIcon from '@mui/icons-material/Person';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import UsbIcon from '@mui/icons-material/Usb';

const CarItem = () => {
  return (
    <Card
      sx={{
        maxWidth: 340,
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
        },
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
      className="mx-2"
    >
      {/* Hình ảnh xe */}
      <CardMedia
        component="img"
        sx={{
          height: 180,
          width: "100%",
          objectFit: "cover",
        }}
        image={Carimage}
        alt="KIA K3 2022"
      />

      {/* Nội dung */}
      <CardContent sx={{ padding: "16px" }}>
        {/* Tên xe */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#1a202c",
            marginBottom: "12px",
          }}
        >
          KIA K3 2022
        </Typography>

        {/* Giá */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1.1rem",
                color: "#0284c7",
              }}
            >
              <span className="text-gray-500 line-through text-sm mr-2">440K</span>
              550K / 4 giờ
            </Typography>
            <ArrowCircleRightIcon sx={{ color: "#0284c7" }} />
          </div>
          <div className="flex items-center justify-between">
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1.1rem",
                color: "#1a202c",
              }}
            >
              <span className="text-gray-500 line-through text-sm mr-2">880K</span>
              1100K / 24 giờ
            </Typography>
          </div>
        </div>

        {/* Thông tin xe */}
        <div className="flex justify-between mt-4 text-gray-600">
          <div className="flex items-center space-x-1">
            <PersonIcon sx={{ fontSize: 20, color: "#0284c7" }} />
            <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
              5 chỗ
            </Typography>
          </div>
          <div className="flex items-center space-x-1">
            <UsbIcon sx={{ fontSize: 20, color: "#0284c7" }} />
            <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
              Số tự động
            </Typography>
          </div>
          <div className="flex items-center space-x-1">
            <LocalGasStationIcon sx={{ fontSize: 20, color: "#0284c7" }} />
            <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
              Xăng
            </Typography>
          </div>
        </div>

        {/* Nút đặt xe */}
        <Button
          variant="contained"
          sx={{
            marginTop: "16px",
            width: "100%",
            padding: "8px 0",
            backgroundColor: "#0284c7",
            "&:hover": {
              backgroundColor: "#0369a1",
            },
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 500,
            borderRadius: "8px",
          }}
        >
          Đặt xe ngay
        </Button>
      </CardContent>
    </Card>
  );
};

export default CarItem;