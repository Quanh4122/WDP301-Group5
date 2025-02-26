import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo1.png";
import { navItems } from "../../../../constants";
import { PRIVATE_ROUTES } from "../../../routes/CONSTANTS";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../../redux/slices/Authentication";
import { AppDispatch, RootState } from "../../redux/Store"; // Import kiểu dispatch và state

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>(); // Fix lỗi TypeScript bằng cách khai báo kiểu dispatch

  const navigate = useNavigate();

  // Lấy trạng thái từ Redux với kiểu an toàn
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth) as { isLoggedIn: boolean; user: { userName: string, userId: string, avatar: string } | null };

  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(`http://localhost:3030${user.avatar}`);
    }
  }, [user]);

  const handleLogout = async () => {
    await dispatch(LogoutUser()); // Dispatch logout action
    navigate(0); // Reload trang sau khi logout
  };

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80 px-32">
      <div className="container px-4 mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img className="h-10 w-10 mr-2" src={logo} alt="logo" />
            <Link to="/" className="text-xl tracking-tight">
              <button>B-Car</button>
            </Link>
          </div>

          {/* Menu Desktop */}
          <ul className="hidden lg:flex ml-14 mt-3 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link to={item.href}>
                  <button>{item.label}</button>
                </Link>
              </li>
            ))}
          </ul>

          {/* Buttons Desktop */}
          <div className="hidden lg:flex justify-center space-x-6 items-center">
            {isLoggedIn ? (
              <>
                <Link to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.PROFILE}/${user?.userId}`} className="text-black font-medium">
                  {avatarPreview && (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-10 h-10 mx-auto rounded-full border object-cover"
                    />
                  )}
                </Link>
                <button onClick={handleLogout} className="py-2 px-3 border rounded-md">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.SIGN_IN}`}
                  className="py-2 px-3 border rounded-md"
                >
                  Đăng nhập
                </Link>
                <Link to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.REGISTER}`} className="bg-gradient-to-r from-sky-500 to-sky-800 py-2 px-3 rounded-md">
                  Tạo tài khoản
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 w-full p-12 flex flex-col justify-center items-center lg:hidden transition-colors">
            <div className="flex flex-col md:flex-row h-85 p-6 gap-6 -mt-10">
              <div className="flex-1 flex flex-col items-center gap-6">
                <ul className="space-y-4">
                  {navItems.map((item, index) => (
                    <li key={index} className="text-lg">
                      <Link to={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1 flex flex-col items-center gap-4">
                {isLoggedIn ? (
                  <button onClick={handleLogout} className="w-full text-center py-2 px-3 border rounded-md">
                    Đăng xuất
                  </button>
                ) : (
                  <>
                    <Link
                      to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.SIGN_IN}`}
                      className="w-full text-center py-2 px-3 border rounded-md"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.REGISTER}`}
                      className="w-full text-center py-2 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800"
                    >
                      Tạo tài khoản
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
