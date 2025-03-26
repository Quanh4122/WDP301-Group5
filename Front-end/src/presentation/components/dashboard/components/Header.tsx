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
import Statistic from 'antd/es/statistic/Statistic';
import { BarChart } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 text-white shadow-lg flex flex-col">
      {/* Logo hoặc tiêu đề */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-sky-400">B-Car Admin</h2>
      </div>

      {/* Menu điều hướng */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link
          to="/app/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 text-sky-400 hover:text-sky-600 no-underline"
        >
          <BarChart className="w-5 h-5" />
          <span>Thống kê</span>
        </Link>
        <Link
          to="/app/dashboard/blogManager"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 text-sky-400 hover:text-sky-600 no-underline"
        >
          <FaBlog className="w-5 h-5" />
          <span>Quản lý blog</span>
        </Link>
        <Link
          to={`${PRIVATE_ROUTES.PATH}/dashboard/${PRIVATE_ROUTES.SUB.MANAGER_CAR}`}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 text-sky-400 hover:text-sky-600 no-underline"
        >
          <FaCar className="w-5 h-5" />
          <span>Quản lý xe</span>
        </Link>
        <Link
          to="/app/dashboard/manage-account"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 text-sky-400 hover:text-sky-600 no-underline"
        >
          <FaUsers className="w-5 h-5" />
          <span>Danh sách người dùng</span>
        </Link>
        <Link
          to="/app/dashboard/manage-driver-accept"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 text-sky-400 hover:text-sky-600 no-underline"
        >
          <FaUserCheck className="w-5 h-5" />
          <span>Quản lý đơn đăng ký tài xế</span>
        </Link>
        <Link
          to="/app/dashboard/admin-request"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 text-sky-400 hover:text-sky-600 no-underline"
        >
          <FaClipboardList className="w-5 h-5" />
          <span>Danh sách đặt</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;