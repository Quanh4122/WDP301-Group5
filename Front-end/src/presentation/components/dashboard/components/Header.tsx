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
        <a className='btn btn-primary' href='/app/car-lists'>Car list</a>
        <a className='btn btn-primary' href='/app/driver-list'>Driver list</a>
        <Link className='btn btn-primary' to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.ADMIN_REQUEST}`}>Booking list</Link>
        <Link className='btn btn-primary' to={`${PRIVATE_ROUTES.PATH}/${PRIVATE_ROUTES.SUB.DRIVER_CREATE}`}>Add new driver</Link>
        <a className='btn btn-primary' href='/app/car-create'>Add new car</a>
        <a className='btn btn-primary' href='/app/transaction'>Bill list</a>
        <a className='btn btn-primary' href='/app/blogManager'>Blog manager</a>
      </Stack>
    </Stack>


  );
}
