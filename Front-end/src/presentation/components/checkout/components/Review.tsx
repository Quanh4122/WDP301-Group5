import React, { useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CarModel, UserModel } from '../models';
import dayjs from 'dayjs';
import { CarModels } from '../../car_list/model';

interface props {
  userData?: UserModel,
  carModal?: [CarModel],
}

const Review = ({ userData, carModal }: props) => {

  const [totalTime, setTotalTime] = useState<any>()
  const [VATFee, setVATFee] = useState<any>()
  useEffect(() => {
    calculateTotalTimeBooking()

  }, [])

  const calculateTotalTimeBooking = () => {
    // const startDate = dayjs(dateValue[0] + " " + timeValue[0], 'DD/MM/YYYY HH:mm')
    // const endDate = dayjs(dateValue[1] + " " + timeValue[1], 'DD/MM/YYYY HH:mm')
    // const total = endDate.diff(startDate, 'hour', true)
    // setTotalTime(total)
    // const calVATFee = carModal?.price && carModal?.price * total * 0.1
    // setVATFee(calVATFee)
  }

  return (
    <Stack spacing={2}>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Thời gian thuê" />
          <Typography variant="body2">{totalTime} h</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Thuế VAT" />
          <Typography variant="body2">{VATFee} kđ</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            $144.97
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            $144.97
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            $144.97
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <Stack
        direction="column"
        divider={<Divider flexItem />}
        spacing={2}
        sx={{ my: 2 }}
      >
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Thông tin của bạn
          </Typography>
          <Typography gutterBottom>Họ và tên: <span className='text-gray-500'>{userData?.userName}</span></Typography>
          <Typography gutterBottom>Email: <span className='text-gray-500'>{userData?.email}</span></Typography>
          <Typography gutterBottom>Số điện thoại: <span className='text-gray-500'>{userData?.phoneNumber}</span></Typography>
        </div>
        {/* <div>
          <Typography variant="subtitle2" gutterBottom>
            Payment details
          </Typography>
          <Grid container>
            {payments.map((payment) => (
              <React.Fragment key={payment.name}>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ width: '100%', mb: 1 }}
                >
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {payment.name}
                  </Typography>
                  <Typography variant="body2">{payment.detail}</Typography>
                </Stack>
              </React.Fragment>
            ))}
          </Grid>
        </div> */}
      </Stack>
    </Stack>
  );
}

export default Review
