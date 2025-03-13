import { Box, Typography } from "@mui/material";

// Giả sử các logo đã được import từ thư mục assets
import BMWLogo from '../../../assets/BMWLogo.png';
import MercedesLogo from '../../../assets/MercedesLogo.png';
import PorscheLogo from '../../../assets/PorscheLogo.png';
import KiaLogo from '../../../assets/KiaLogo.png';
import HuyndaiLogo from '../../../assets/HuyndaiLogo.jpg';

const CarLogoCarousel = () => {
  const logos = [
    BMWLogo,
    MercedesLogo,
    PorscheLogo,
    KiaLogo,
    HuyndaiLogo,
    BMWLogo, 
    MercedesLogo,
    PorscheLogo,
    KiaLogo,
    HuyndaiLogo,
    BMWLogo,
    MercedesLogo,
    PorscheLogo,
    KiaLogo,
    HuyndaiLogo,
    BMWLogo,
    MercedesLogo,
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5', // Nền xám nhạt chuyên nghiệp
        padding: 4,
        overflow: 'hidden', // Ẩn phần thừa của carousel
      }}
    >
      {/* Tiêu đề */}
      <Typography
        variant="h4"
        component="h2"
        sx={{ textAlign: 'center', marginBottom: 4, fontWeight: 'bold', color: '#333' }}
      >
        Các thương hiệu xe hàng đầu
      </Typography>

      {/* Carousel Container */}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          height: 100, // Chiều cao của carousel
        }}
      >
        <Box
          sx={{
            display: 'flex',
            animation: 'scroll 20s linear infinite', // Animation chạy vô hạn
            '&:hover': {
              animationPlayState: 'paused', // Dừng khi hover
            },
          }}
          component="div"
        >
          {logos.map((logo, index) => (
            <Box
              key={index}
              sx={{
                flexShrink: 0,
                width: 150, // Chiều rộng mỗi logo
                height: 100, // Chiều cao mỗi logo
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 20px', // Khoảng cách giữa các logo
                backgroundColor: '#fff', // Nền trắng cho logo
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Hiệu ứng bóng
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.1)', // Phóng to khi hover
                },
              }}
            >
              <img
                src={logo}
                alt={`Car Logo ${index}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain', // Giữ tỷ lệ logo
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {/* CSS Animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </Box>
  );
};

export default CarLogoCarousel;