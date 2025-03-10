import * as React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';

import Search from './Search';

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
        <a className='btn btn-primary' href='/app/booking-list'>Booking list</a>
        <a className='btn btn-primary' href='/app'>Add new driver</a>
        <a className='btn btn-primary' href='/app/car-create'>Add new car</a>
      </Stack>
    </Stack>


  );
}
