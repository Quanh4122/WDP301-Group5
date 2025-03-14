import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center mt-10 lg:mt-24 px-4">
      {/* Tiêu đề */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl lg:text-6xl text-center font-bold tracking-tight leading-tight"
      >
        <span className="bg-gradient-to-r from-sky-600 to-sky-900 text-transparent bg-clip-text">
          B-Car
        </span>
        <span className="text-gray-800"> mang đến những chiếc xe chất lượng</span>
      </motion.h1>

      {/* Mô tả */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-6 text-lg lg:text-xl text-center text-gray-600 max-w-3xl"
      >
        Lựa chọn chiếc xe yêu thích cùng bạn đồng hành trên mọi nẻo đường
      </motion.p>

      {/* Nút hành động */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex justify-center mt-10"
      >
        <Link to="/app/car-lists">
          <button
            className="relative bg-gradient-to-r from-sky-500 to-sky-800 text-white py-3 px-6 rounded-lg shadow-md hover:from-sky-600 hover:to-sky-900 transition-all duration-300 transform hover:scale-105"
          >
            Trải nghiệm dịch vụ ngay
          </button>
        </Link>
      </motion.div>
    </div>
  );
};

export default HeroSection;