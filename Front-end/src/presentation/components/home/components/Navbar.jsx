import { useState } from "react";
import logo from "../../../assets/logo.png"
import { navItems } from "../../../../constants";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };
  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <img className="h-10 w-10 mr-2" src={logo} alt="logo" />
            <span className="text-xl tracking-tight">DXLAB Co-working Space</span>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-12 ">
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex justify-center space-x-6 items-center">
            <a href="/" className="py-2 px-3 border rounded-md">
              Đăng nhập
            </a>
            <a href="/" className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md">
              Tạo tài khoản
            </a>
          </div>
        </div>
        {
          mobileDrawerOpen && (
            <div
              className="fixed right-0 z-20 w-full p-12 flex flex-col justify-center items-center lg:hidden 
               transition-colors"
            >
              <div className="flex flex-col md:flex-row h-85 p-6 gap-6 -mt-10">
                <div className="flex-1 flex flex-col items-center gap-6">
                  <ul className="space-y-4">
                    {navItems.map((item, index) => (
                      <li key={index} className="text-lg">
                        <a href={item.href}>{item.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex-1 flex flex-col items-center gap-4">
                  <a href="/" className="w-full text-center py-2 px-3 border rounded-md">Đăng nhập</a>
                  <a href="/" className="w-full text-center py-2 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800">
                    Tạo tài khoản
                  </a>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </nav>
  );
}

export default Navbar;
