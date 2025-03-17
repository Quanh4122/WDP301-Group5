import * as React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';

import Search from './Search';
import { Link } from 'react-router-dom';
import { PRIVATE_ROUTES } from '../../../routes/CONSTANTS';

export default function Header() {
  return (
    <Stack direction="column"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}>
      <Stack
        direction="row"
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '100%',
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          maxWidth: { sm: '100%', md: '1700px' },
          pt: 1.5,
        }}
        spacing={2}
      >
        <NavbarBreadcrumbs />
        <Stack direction="row" sx={{ gap: 1 }}>
          <ColorModeIconDropdown />
        </Stack>
      </Stack>
      <Stack direction="row" sx={{ gap: 1 }}>
        <a className='btn btn-primary' href='/app/transaction'>Danh sách bill</a>
        <a className='btn btn-primary' href='/app/blogManager'>Quản lý blog</a>
        <Link className='btn btn-primary' to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.MANAGER_CAR}`}>Quản lý xe</Link>
        <a className='btn btn-primary' href='/app/manage-account'>Danh sách người dùng</a>
        <a className='btn btn-primary' href='/app/manage-driver-accept'>Quản lý đơn đăng ký tài xế</a>
        <Link className='btn btn-primary' to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.ADMIN_REQUEST}`}>Danh sách đặt</Link>
        <a className='btn btn-primary' href='/app/car-create'>Thêm xe mới</a>
      </Stack>
    </Stack>


  );
}
