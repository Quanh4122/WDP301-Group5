import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo1.png";
import { navItems } from "../../../../constants";
import { PRIVATE_ROUTES } from "../../../routes/CONSTANTS";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser, CheckTokenExpiration } from "../../redux/slices/Authentication";
import { AppDispatch, RootState } from "../../redux/Store";
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoggedIn, user, tokenExpiration } = useSelector((state: RootState) => state.auth) as {
    isLoggedIn: boolean;
    user: {
      userId: string;
      userName: string;
      avatar: string;
      role: string;
    } | null;
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
    navigate(`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.SIGN_IN}`);
  };

  const onViewListRequest = () => {
    navigate(`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.BOOKING_LIST}`, {
      state: { userId: user?.userId },
    });
  };

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80 px-4 md:px-32">
      <div className="container mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <img className="h-10 w-10 mr-2" src={logo} alt="logo" />
            <Link to="/" className="text-xl tracking-tight">
              <button>B-Car</button>
            </Link>
          </div>

          <button className="lg:hidden" onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}>
            {mobileDrawerOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <ul className="hidden lg:flex ml-14 mt-3 space-x-12">
            {navItems.map((item, index) => {
              if (item.label === "Dashboard") {
                if (isLoggedIn && user?.role === "Admin") {
                  return (
                    <li key={index}>
                      <Link to={item.href}>
                        <button>{item.label}</button>
                      </Link>
                    </li>
                  );
                }
                return null;
              }
              return (
                <li key={index}>
                  <Link to={item.href}>
                    <button>{item.label}</button>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:flex justify-center space-x-6 items-center">
            {isLoggedIn && user ? (
              <>
                <div onClick={onViewListRequest}>
                  <ShoppingCartIcon />
                </div>
                <Link
                  to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.PROFILE}/${user.userId}`}
                  className="text-black font-medium"
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-10 h-10 mx-auto rounded-full border object-cover"
                    />
                  ) : (
                    <PersonIcon />
                  )}
                </Link>
                <Link to="/" onClick={handleLogout} className="py-2 px-3 border rounded-md">
                  <button>Đăng xuất</button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.SIGN_IN}`}
                  className="py-2 px-3 border rounded-md"
                >
                  <button>Đăng nhập</button>
                </Link>
                <Link
                  to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.REGISTER}`}
                  className="bg-gradient-to-r from-sky-500 to-sky-800 text-white py-2 px-3 rounded-md"
                >
                  <button>Tạo tài khoản</button>
                </Link>
              </>
            )}
          </div>
        </div>

        {mobileDrawerOpen && (
          <div className="lg:hidden mt-4 flex flex-col space-y-4 border-t pt-4">
            {navItems.map((item, index) => {
              if (item.label === "Dashboard" && (!isLoggedIn || user?.role !== "Admin")) {
                return null;
              }
              return (
                <Link key={index} to={item.href} onClick={() => setMobileDrawerOpen(false)}>
                  <button className="w-full text-left px-4 py-2">{item.label}</button>
                </Link>
              );
            })}
            {isLoggedIn && user ? (
              <>
                <Link
                  to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.PROFILE}/${userIdPreview}`}
                  className="flex items-center px-4 py-2"
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
                <Link to="/" onClick={handleLogout} className="block text-left w-full px-4 py-2 border-t">
                  <button>Đăng xuất</button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.SIGN_IN}`}
                  className="block w-full text-left px-4 py-2 border-t"
                >
                  <button>Đăng nhập</button>
                </Link>
                <Link
                  to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.REGISTER}`}
                  className="block w-full text-left px-4 py-2"
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