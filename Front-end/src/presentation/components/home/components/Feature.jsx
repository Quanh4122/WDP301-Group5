import { FaCar, FaShieldAlt, FaTachometerAlt, FaGasPump } from "react-icons/fa"; // Sử dụng react-icons

const features = [
  {
    icon: <FaCar size={24} />, // Biểu tượng xe hơi
    text: "Thiết kế đẳng cấp",
    description:
      "Những chiếc xe của B-Car được thiết kế hiện đại, sang trọng, mang lại trải nghiệm lái xe tuyệt vời và phong cách riêng biệt.",
  },
  {
    icon: <FaShieldAlt size={24} />, // Biểu tượng bảo vệ
    text: "An toàn vượt trội",
    description:
      "Công nghệ an toàn tiên tiến giúp bảo vệ bạn và gia đình trên mọi hành trình, với các tính năng như phanh ABS và túi khí đa điểm.",
  },
  {
    icon: <FaTachometerAlt size={24} />, // Biểu tượng tốc độ
    text: "Hiệu suất mạnh mẽ",
    description:
      "Động cơ tối ưu hóa mang lại khả năng tăng tốc vượt trội và vận hành mượt mà trên mọi địa hình.",
  },
  {
    icon: <FaGasPump size={24} />, // Biểu tượng tiết kiệm nhiên liệu
    text: "Tiết kiệm nhiên liệu",
    description:
      "Công nghệ tiết kiệm nhiên liệu tiên tiến giúp giảm chi phí vận hành và bảo vệ môi trường.",
  },
];

const Feature = () => {
  return (
    <section className="relative mt-20 border-b border-neutral-800 mb-40 min-h-[800px] bg-neutral-900 text-white">
      {/* Header */}
      <div className="text-center py-12">
        <span className="inline-block bg-sky-500 text-white rounded-full h-10 leading-10 text-xl font-semibold px-4 uppercase tracking-wider">
          Tính năng nổi bật
        </span>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-8 lg:mt-12 tracking-wide font-bold">
          Lý do bạn nên chọn{" "}
          <span className="bg-gradient-to-r from-sky-500 to-sky-800 text-transparent bg-clip-text">
            B-Car
          </span>
        </h2>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 lg:px-12 mt-10 lg:mt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-neutral-800 transition-colors duration-300"
            >
              <div className="flex justify-center items-center h-14 w-14 bg-sky-100 text-sky-700 rounded-full mb-4">
                {feature.icon}
              </div>
              <h5 className="text-xl font-semibold mb-3">{feature.text}</h5>
              <p className="text-md text-neutral-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;