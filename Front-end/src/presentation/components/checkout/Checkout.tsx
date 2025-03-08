import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AddressForm from './components/AddressForm';
import Info from './components/Info';
import InfoMobile from './components/InfoMobile';
import PaymentForm from './components/PaymentForm';
import Review from './components/Review';
import SitemarkIcon from './components/SitemarkIcon';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import axiosInstance from '../utils/axios';
import { User } from 'lucide-react';
import { CarModel, RequestModel, RequestModelFull, UserModel } from './models';
import { CarModels } from '../car_list/model';
import dayjs from 'dayjs';

const Checkout = (props: { disableCustomTheme?: boolean }) => {

  const location = useLocation()
  const requestData = location.state
  const userId = useSelector((state: RootState) => (state.auth?.user as { userId: string } | null)?.userId);
  const [userBooking, setUserBooking] = useState<UserModel>()

  useEffect(() => {
    console.log(location.state, userId)
    getUserById()
  }, [])

  const getUserById = async () => {
    await axiosInstance.get("/getUserById", {
      params: { key: userId }
    })
      .then((res) => setUserBooking(res.data))
      .catch(err => console.log(err))
  }

  const fomatDate = (date: string) => {
    const arr = date.split('/')
    return arr[1] + "/" + arr[0] + "/" + arr[2]
  }

  const handleBooking = async () => {
    // const formBooking: RequestModel = {
    //   userId: userId,
    //   driverId: "",
    //   carId: carDetail._id,
    //   startDate: dayjs(fomatDate(dateValue[0]) + " " + timeValue[0]),
    //   endDate: dayjs(fomatDate(dateValue[1]) + " " + timeValue[1]),
    //   isRequesDriver: false
    // }

    // await axiosInstance.post("/request/createRequest", formBooking)
    //   .then(res => console.log(res))
    //   .catch(err => console.log(err))

  }

  const onBooking = (value: any) => {
    console.log(value)
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box sx={{ position: 'fixed', top: '1rem', right: '1rem' }}>
        <ColorModeIconDropdown />
      </Box>

      <Grid
        container
        sx={{
          height: {
            xs: '100%',
            sm: '100%',
          },
          mt: {
            xs: 4,
            sm: 0,
          },
        }}
      >
        <Grid
          size={{ xs: 12, sm: 6, lg: 4 }}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            backgroundColor: 'background.paper',
            borderRight: { sm: 'none', md: '1px solid' },
            borderColor: { sm: 'none', md: 'divider' },
            alignItems: 'start',
            pt: 16,
            px: 10,
            gap: 4,
          }}
        >
          <SitemarkIcon />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              width: '100%',
              maxWidth: 500,
            }}
          >
            <Info carModel={requestData.car} />
          </Box>
        </Grid>
        <Grid
          size={{ sm: 12, md: 6, lg: 8 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            width: '100%',
            backgroundColor: { xs: 'transparent', sm: 'background.default' },
            alignItems: 'start',
            pt: { xs: 0, sm: 16 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              width: '100%',
              maxWidth: { sm: '100%', md: 600 },
              maxHeight: '720px',
              gap: { xs: 5, md: 'none' },
            }}
          >
            <React.Fragment>
              <AddressForm requestData={requestData} />
            </React.Fragment>
          </Box>
        </Grid>
      </Grid>
    </AppTheme>
  );
}

export default Checkout
