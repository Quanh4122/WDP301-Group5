
const HeroSection = () => {
  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">

        <span className='bg-gradient-to-r from-sky-500 to-sky-800 text-transparent bg-clip-text'>
          B-Car{" "}mang đến những chiếc xe chất lượng
        </span>

      </h1>
      <p className='mt-10 text-lg text-center text-neutral-500 max-w-4xl'>
        Lựa chọn chiếc xe yêu thích cùng bàn đồng hành trên mọi nẻo đường
      </p>
      <div className="flex justify-center my-10">
        <button className="bg-gradient-to-r text-white from-sky-500 to-sky-800 py-3 px-4 mx-3 rounded-md">
          Trải nghiệm dịch vụ ngay
        </button>
      </div>
    </div>
  );
}

export default HeroSection;
