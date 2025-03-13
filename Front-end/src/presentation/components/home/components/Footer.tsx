import { Phone, MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import logo from "../../../assets/logo1.png";


const Footer = () => {
  return (
    <footer className="bg-neutral-700 text-sky-500 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Cột 1: Giới thiệu */}
        <div>
          <div className="flex items-center flex-shrink-0">
            <img className="h-12 w-30 mr-2" src={logo} alt="logo" />
            <Link to="/" className="tracking-tight">
              <button className="text-2xl">B-Car</button>
            </Link>
          </div>
          <p className="text-sm text-sky-400 mb-4">
            Dịch vụ thuê xe nhanh chóng, tiện lợi và đáng tin cậy.
          </p>
          <div className="flex space-x-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-sky-400 hover:text-blue-500 text-2xl transition-colors duration-200" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-sky-400 hover:text-sky-600 text-2xl transition-colors duration-200" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="text-sky-400 hover:text-sky-600 text-2xl transition-colors duration-200" />
            </a>
          </div>
        </div>

        {/* Cột 2: Dịch vụ */}
        <div>
          <h3 className="text-sky-500 ml-10 text-lg font-semibold mb-6 uppercase tracking-wide">
            Dịch Vụ
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <Link
                to={''}
                className="text-sky-500 hover:text-sky-700 transition-colors duration-200"
              >
                <button>Thuê xe tự lái</button>
              </Link>
            </li>
            <li className="flex items-center">
              <Link
                to={''}
                className="text-sky-500 hover:text-sky-700 transition-colors duration-200"
              >
                <button>Thuê xe người lái</button>
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Khám phá */}
        <div>
          <h3 className="text-sky-500 ml-5 text-lg font-semibold mb-6 uppercase tracking-wide">
            Khám Phá
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <Link
                to={'/'}
                className="text-sky-500 hover:text-sky-700 transition-colors duration-200"
              >
                <button>Trang chủ</button>
              </Link>
            </li>
            <li className="flex items-center">
              <Link
                to={'/app/sign-in'}
                className="text-sky-500 hover:text-sky-700 transition-colors duration-200"
              >
                <button>Đăng nhập</button>
              </Link>
            </li>
            <li className="flex items-center">
              <Link
                to={'/app/register'}
                className="text-sky-500 hover:text-sky-700 transition-colors duration-200"
              >
                <button>Đăng ký tài khoản</button>
              </Link>
            </li>
            <li className="flex items-center">
              <Link
                to={'/app/blog'}
                className="text-sky-500 hover:text-sky-700 transition-colors duration-200"
              >
                <button>B-Car Blog</button>
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 4: Liên hệ */}
        <div>
          <h3 className="text-sky-500 ml-20 text-lg font-semibold mb-6 uppercase tracking-wide">
            Liên Hệ
          </h3>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <Phone className="text-sky-500 w-5 h-5 flex-shrink-0" />
              <span className="text-sky-500">0976 852 120</span>
            </li>
            <li className="flex items-start space-x-3">
              <MapPin className="text-sky-500 w-5 h-5 flex-shrink-0 mt-1" />
              <span className="text-sky-500">
                Hoa Lac Hi-tech Park, Km 29 Đại lộ Thăng Long, Hà Nội, Việt Nam
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="text-sky-500 w-5 h-5 flex-shrink-0" />
              <span className="text-sky-500">thuexenhanh@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Phần dưới footer */}
      <div className="max-w-7xl mx-auto mt-10 text-center">
        <p className="text-sky-400 text-sm">
          © {new Date().getFullYear()} B-Car. Mọi quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
};

export default Footer;