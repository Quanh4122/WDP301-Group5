import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { CarModels } from '../../car_list/model';

interface InfoProps {
  carModel: [CarModels]
}

const Info = ({ carModel }: InfoProps) => {
  return (
    <React.Fragment>
      {
        carModel.map((item) => (
          <div className=' flex items-center border-b-2'>
            {/* <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        Tên xe
      </Typography> */}
            <img src={`http://localhost:3030${item.images[0]}`} className='w-32 h32' />
            <List disablePadding>
              <Typography variant="h6" gutterBottom sx={{ fontSize: 13 }}>
                {item.carName + " " + item.carVersion}
              </Typography>
              <ListItem sx={{ px: 0 }} >
                <ListItemText
                  sx={{ mr: 2 }}
                  primary={"Giá thuê: "}
                />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {item.price}k / 1h
                </Typography>
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary={"Biển số : "}
                />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {item.licensePlateNumber}
                </Typography>
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary={"Số chỗ: "}
                />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {item.numberOfSeat}
                </Typography>
              </ListItem>
            </List>
          </div>
        ))
      }

    </React.Fragment>
  );
}

export default Info
