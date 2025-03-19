import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo1.png";
import { PRIVATE_ROUTES } from "../../../routes/CONSTANTS";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser, CheckTokenExpiration } from "../../redux/slices/Authentication";
import { AppDispatch, RootState } from "../../redux/Store";
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoggedIn, user, tokenExpiration } = useSelector((state: RootState) => state.auth) as {
    isLoggedIn: boolean;
    user: { userId: string; userName: string; avatar: string; role: string } | null;
    tokenExpiration: number | null;
  };

  const [avatarPreview, setAvatarPreview] = useState("");
  const [userIdPreview, setUserIdPreview] = useState("");

  useEffect(() => {
    if (user) {
      const avatarUrl = user.avatar
        ? user.avatar.startsWith("http")
          ? user.avatar
          : `http://localhost:3030${user.avatar}`
        : "";
      setAvatarPreview(avatarUrl);
      setUserIdPreview(user.userId);
    } else {
      setAvatarPreview("");
      setUserIdPreview("");
    }
  }, [user]);

  useEffect(() => {
    const checkToken = async () => {
      const result = await dispatch(CheckTokenExpiration());
      if ((result.payload as { expired: boolean }).expired) {
        navigate(`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.SIGN_IN}`);
      }
    };

    if (isLoggedIn && tokenExpiration) {
      checkToken();
      const timeToExpiration = tokenExpiration - new Date().getTime();
      if (timeToExpiration <= 0) {
        dispatch(LogoutUser());
        navigate(`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.SIGN_IN}`);
      } else {
        const timeout = setTimeout(() => {
          dispatch(LogoutUser());
          navigate(`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.SIGN_IN}`);
        }, timeToExpiration);
        return () => clearTimeout(timeout);
      }
    }

    const interval = setInterval(checkToken, 60000);
    return () => clearInterval(interval);
  }, [dispatch, isLoggedIn, tokenExpiration, navigate]);

  const handleLogout = async () => {
    await dispatch(LogoutUser());
    setIsModalOpen(false);
    navigate(`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.SIGN_IN}`);
  };

  const onViewListRequest = () => {
    setIsModalOpen(false);
    navigate(`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.BOOKING_LIST}`, {
      state: { userId: user?.userId },
    });
  };

  const onViewProfile = () => {
    setIsModalOpen(false);
    navigate(`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.PROFILE}/${user?.userId}`);
  };

  const toggleModal = () => {
    if (isLoggedIn && user) {
      setIsModalOpen(!isModalOpen);
    }
  };

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80 px-4 md:px-32">
      <div className="container mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img className="h-12 w-30 mr-2" src={logo} alt="logo" />
            <Link to="/" className="tracking-tight">
              <button className="text-2xl">B-Car</button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden" onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}>
            {mobileDrawerOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex ml-14 mt-3 space-x-8">
            <li>
              <Link to="/">
                <button className="text-lg hover:text-sky-500 transition-colors duration-200">Trang chủ</button>
              </Link>
            </li>
            <li>
              <Link to="app/blog">
                <button className="text-lg hover:text-sky-500 transition-colors duration-200">B-Car Blog</button>
              </Link>
            </li>
            {isLoggedIn && user?.role === "Admin" && (
              <li>
                <Link to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.DASH_BOARD}`}>
                  <button className="text-lg hover:text-sky-500 transition-colors duration-200">Thống kê</button>
                </Link>
              </li>
            )}
            {isLoggedIn && user?.role === "User" && (
              <>
                <li>
                  <Link to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.APPLY_DRIVER}/${user?.userId}`}>
                    <button className="text-lg hover:text-sky-500 transition-colors duration-200">Ứng tuyển lái xe</button>
                  </Link>
                </li>
                <li>
                  <Link to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.CAR_LIST}`}>
                    <button className="text-lg hover:text-sky-500 transition-colors duration-200">Danh sách xe</button>
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Desktop Actions */}
          <div className="hidden lg:flex justify-center space-x-6 items-center relative">
            {isLoggedIn && user ? (
              <>
                <div className="relative">
                  <button
                    onClick={toggleModal}
                    className="focus:outline-none"
                  >
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="w-10 h-10 rounded-full border object-cover hover:border-sky-500 transition-all duration-200"
                      />
                    ) : (
                      <PersonIcon className="text-gray-700 hover:text-sky-500 transition-colors duration-200" />
                    )}
                  </button>
                  {isModalOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl z-50 border border-gray-200 overflow-hidden">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-sky-500 to-sky-700 p-4 flex items-center space-x-3">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="User Avatar"
                            className="w-14 h-14 rounded-full object-cover border-2 border-white"
                          />
                        ) : (
                          <PersonIcon className="w-14 h-14 text-white" />
                        )}
                        <div className="text-white">
                          <p className="text-lg font-semibold">{user.userName}</p>
                          <p className="text-sm opacity-80">{user.role}</p>
                        </div>
                      </div>
                      {/* Menu */}
                      <ul className="py-2">
                        <li>
                          <button
                            onClick={onViewProfile}
                            className="w-full text-left px-6 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors duration-200 flex items-center space-x-3"
                          >
                            <PersonIcon className="text-gray-500" />
                            <span className="font-medium">Hồ sơ</span>
                          </button>
                        </li>
                        {user.role === "User" && (
                          <li>
                          <button
                            onClick={onViewListRequest}
                            className="w-full text-left px-6 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors duration-200 flex items-center space-x-3"
                          >
                            <ShoppingCartIcon className="text-gray-500" />
                            <span className="font-medium">Giỏ hàng</span>
                          </button>
                        </li>
                        )}
                        <li>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-6 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors duration-200 flex items-center space-x-3 border-t border-gray-200"
                          >
                            <LogoutIcon className="text-gray-500" />
                            <span className="font-medium">Đăng xuất</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.SIGN_IN}`}
                  className="py-2 px-3 border rounded-lg hover:bg-sky-100 transition-colors duration-200"
                >
                  <button className="text-lg">Đăng nhập</button>
                </Link>
                <Link
                  to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.REGISTER}`}
                  className="bg-gradient-to-r from-sky-500 to-sky-800 text-white py-2 px-3 rounded-lg hover:bg-gradient-to-r hover:from-sky-600 hover:to-sky-800 transition-all duration-200"
                >
                  <button className="text-lg">Tạo tài khoản</button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="lg:hidden mt-4 flex flex-col space-y-4 border-t pt-4">
            <Link
              to="/"
              onClick={() => setMobileDrawerOpen(false)}
            >
              <button className="w-full text-left px-4 py-2 hover:text-sky-500 transition-colors duration-200">Trang chủ</button>
            </Link>
            <Link
              to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.CAR_LIST}`}
              onClick={() => setMobileDrawerOpen(false)}
            >
              <button className="w-full text-left px-4 py-2 hover:text-sky-500 transition-colors duration-200">Danh sách xe</button>
            </Link>
            <Link
              to="app/blog"
              onClick={() => setMobileDrawerOpen(false)}
            >
              <button className="w-full text-left px-4 py-2 hover:text-sky-500 transition-colors duration-200">B-Car Blog</button>
            </Link>
            {isLoggedIn && user?.role === "Admin" && (
              <Link
                to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.DASH_BOARD}`}
                onClick={() => setMobileDrawerOpen(false)}
              >
                <button className="w-full text-left px-4 py-2 hover:text-sky-500 transition-colors duration-200">Thống kê</button>
              </Link>
            )}
            {isLoggedIn && user?.role === "User" && (
              <Link
                to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.APPLY_DRIVER}/${userIdPreview}`}
                onClick={() => setMobileDrawerOpen(false)}
              >
                <button className="w-full text-left px-4 py-2 hover:text-sky-500 transition-colors duration-200">Ứng tuyển lái xe</button>
              </Link>
            )}
            {isLoggedIn && user ? (
              <>
                <Link
                  to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.PROFILE}/${userIdPreview}`}
                  className="flex items-center px-4 py-2 hover:text-sky-500 transition-colors duration-200"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                  ) : (
                    <PersonIcon className="mr-2" />
                  )}
                  <span>Hồ sơ</span>
                </Link>
                <button
                  onClick={onViewListRequest}
                  className="w-full text-left px-4 py-2 flex items-center space-x-2 hover:text-sky-500 transition-colors duration-200"
                >
                  <ShoppingCartIcon />
                  <span>Giỏ hàng</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 border-t hover:text-sky-500 transition-colors duration-200"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.SIGN_IN}`}
                  className="block w-full text-left px-4 py-2 border-t hover:text-sky-500 transition-colors duration-200"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <button>Đăng nhập</button>
                </Link>
                <Link
                  to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.REGISTER}`}
                  className="block w-full text-left px-4 py-2 hover:text-sky-500 transition-colors duration-200"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <button>Tạo tài khoản</button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;