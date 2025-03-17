import React from 'react';
import { Link } from 'react-router-dom';
import { PRIVATE_ROUTES } from '../../../routes/CONSTANTS';
import { 
  FaFileInvoice, 
  FaBlog, 
  FaCar, 
  FaUsers, 
  FaUserCheck, 
  FaClipboardList 
} from 'react-icons/fa';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 text-white shadow-lg flex flex-col rounded-lg">
      {/* Logo hoặc tiêu đề */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-sky-400">B-Car Admin</h2>
      </div>

      {/* Menu điều hướng */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link
          to="/app/transaction"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 text-gray-200 hover:text-white"
        >
          <FaFileInvoice className="w-5 h-5" />
          <span>Danh sách bill</span>
        </Link>
        <Link
          to="/app/blogManager"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 text-gray-200 hover:text-white"
        >
          <FaBlog className="w-5 h-5" />
          <span>Quản lý blog</span>
        </Link>
        <Link
          to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.MANAGER_CAR}`}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 text-gray-200 hover:text-white"
        >
          <FaCar className="w-5 h-5" />
          <span>Quản lý xe</span>
        </Link>
        <Link
          to="/app/manage-account"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 text-gray-200 hover:text-white"
        >
          <FaUsers className="w-5 h-5" />
          <span>Danh sách người dùng</span>
        </Link>
        <Link
          to="/app/manage-driver-accept"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 text-gray-200 hover:text-white"
        >
          <FaUserCheck className="w-5 h-5" />
          <span>Quản lý đơn đăng ký tài xế</span>
        </Link>
        <Link
          to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.ADMIN_REQUEST}`}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 text-gray-200 hover:text-white"
        >
          <FaClipboardList className="w-5 h-5" />
          <span>Danh sách đặt</span>
        </Link>
      </nav>

      {/* Chuyển đổi chế độ sáng/tối */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Chế độ hiển thị</span>
          <ColorModeIconDropdown />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;