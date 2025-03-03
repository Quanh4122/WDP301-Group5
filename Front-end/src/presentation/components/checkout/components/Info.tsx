import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { CarModels } from '../../car_list/model';

const products = [
  {
    name: 'Professional plan',
    desc: 'Monthly subscription',
    price: '$15.00',
  },
  {
    name: 'Dedicated support',
    desc: 'Included in the Professional plan',
    price: 'Free',
  },
  {
    name: 'Hardware',
    desc: 'Devices needed for development',
    price: '$69.99',
  },
  {
    name: 'Landing page template',
    desc: 'License',
    price: '$49.99',
  },
];

interface InfoProps {
  carModel: CarModels
}

const Info = ({ carModel }: InfoProps) => {
  return (
    <React.Fragment>
      {/* <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        Tên xe
      </Typography> */}
      <Typography variant="h4" gutterBottom>
        {carModel.carName + " " + carModel.carVersion}
      </Typography>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText
            sx={{ mr: 2 }}
            primary={"Giá thuê: "}
          />
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {carModel.price}k / 1h
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText
            sx={{ mr: 2 }}
            primary={"Màu xe: "}
          />
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {carModel.color}
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText
            sx={{ mr: 2 }}
            primary={"Biển số xe: "}
          />
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {carModel.licensePlateNumber}
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText
            sx={{ mr: 2 }}
            primary={"Số chỗ: "}
          />
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {carModel.numberOfSeat}
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText
            sx={{ mr: 2 }}
            primary={"Nguyễn liệu tiêu thụ: "}
          />
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {carModel.carType.flue == 1 ? "Máy xăng" : carModel.carType.flue == 2 ? "Máy dầu" : "Máy điện"}
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText
            sx={{ mr: 2 }}
            primary={"Loại chuyển động: "}
          />
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {carModel.carType.transmissionType ? "Số tự động" : "Số sàn"}
          </Typography>
        </ListItem>
      </List>
    </React.Fragment>
  );
}

export default Info
