import { Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
import React from "react";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import PersonIcon from "@mui/icons-material/Person";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import UsbIcon from "@mui/icons-material/Usb";
import { CarModel } from "../../checkout/models";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/Store";
import { useSelector } from "react-redux";
import { PRIVATE_ROUTES } from "../../../routes/CONSTANTS";

interface Props {
  carModel: CarModel;
}

const CarItem = ({ carModel }: Props) => {
  const navigate = useNavigate()
  const userId = useSelector((state: RootState) => (state.auth.user as { userId: string } | null)?.userId);

  const displayFlue = (val: Number | undefined) => {
    if (val === 1) {
      return "Xăng";
    } else if (val === 2) {
      return "Dầu";
    } else {
      return "Điện";
    }
  };

  const navigatePage = () => {
    if (userId) {
      navigate(PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.CAR_LIST)
    } else {
      console.log(userId)
      navigate(PRIVATE_ROUTES.PATH + '/' + PRIVATE_ROUTES.SUB.SIGN_IN)
    }
  }

  return (
    <Card
      sx={{
        width: 340, // Chiều rộng cố định
        height: 340, // Chiều cao bằng chiều rộng để tạo hình vuông
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
        },
        overflow: "hidden",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column", // Sắp xếp nội dung theo cột
      }}
      className="mx-2"
    >
      {/* Hình ảnh xe */}
      <CardMedia
        component="img"
        sx={{
          height: 180, // Chiều cao cố định cho ảnh (chiếm khoảng 1/2 thẻ)
          width: "100%",
          objectFit: "cover",
        }}
        image={`http://localhost:3030${carModel.images[0]}`}
        alt={`${carModel.carName} ${carModel.carVersion}`}
      />

      {/* Nội dung */}
      <CardContent
        sx={{
          padding: "12px", // Giảm padding để nội dung vừa với chiều cao còn lại
          flexGrow: 1, // Cho phép CardContent chiếm toàn bộ không gian còn lại
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // Phân bố đều nội dung
        }}
      >
        {/* Tên xe */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            fontSize: "1.1rem", // Giảm font size để vừa
            color: "#1a202c",
            marginBottom: "8px",
          }}
        >
          {carModel.carName + " " + carModel.carVersion}
        </Typography>

        {/* Giá */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1rem", // Giảm font size
                color: "#0284c7",
              }}
            >
              {carModel.price.toLocaleString()} / 1 giờ
            </Typography>
            <ArrowCircleRightIcon sx={{ color: "#0284c7", fontSize: 20 }} />
          </div>
        </div>

        {/* Thông tin xe */}
        <div className="flex justify-between mt-2 text-gray-600">
          <div className="flex items-center space-x-1">
            <PersonIcon sx={{ fontSize: 18, color: "#0284c7" }} />
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
              {carModel?.numberOfSeat} chỗ
            </Typography>
          </div>
          <div className="flex items-center space-x-1">
            <UsbIcon sx={{ fontSize: 18, color: "#0284c7" }} />
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
              {carModel?.carType?.transmissionType ? "Số tự động" : "Số sàn"}
            </Typography>
          </div>
          <div className="flex items-center space-x-1">
            <LocalGasStationIcon sx={{ fontSize: 18, color: "#0284c7" }} />
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
              {displayFlue(carModel?.carType?.flue)}
            </Typography>
          </div>
        </div>

        {/* Nút đặt xe */}
        <Button
          variant="contained"
          sx={{
            marginTop: "8px", // Giảm margin để vừa
            width: "100%",
            padding: "6px 0", // Giảm padding
            backgroundColor: "#0284c7",
            "&:hover": {
              backgroundColor: "#0369a1",
            },
            textTransform: "none",
            fontSize: "0.9rem", // Giảm font size
            fontWeight: 500,
            borderRadius: "8px",
          }}
          onClick={() => navigatePage()}
        >
          Đặt xe ngay
        </Button>
      </CardContent>
    </Card>
  );
};

export default CarItem;