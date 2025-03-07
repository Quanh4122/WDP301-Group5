import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid2';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import { UserModel } from '../models';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CarModal from '../../car_detail/component/CarModal';
import CarCalendar from '../../car_detail/component/CarCalendar';
import dayjs, { Dayjs } from 'dayjs';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { FormControl } from '@mui/material';
import { Form, Input } from 'antd';

interface props {
  userData?: UserModel,
}

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const AddressForm = ({ userData }: props) => {


  const [isOpenModalN, setIsOpenModalN] = React.useState(false)
  const [dateValue, setDateValue] = React.useState<any[]>([dayjs().format('DD/MM/YYYY'), dayjs().add(1, 'day').format('DD/MM/YYYY')]);

  const getDateValue = (value: DateRange<Dayjs>) => {
    setDateValue([
      value && value[0] ? dayjs(value[0].toLocaleString()).format('DD/MM/YYYY') : dayjs().format('DD/MM/YYYY'),
      value && value[1] ? dayjs(value[1].toLocaleString()).format('DD/MM/YYYY') : dayjs().add(1, 'day').format('DD/MM/YYYY')
    ])
  }

  const [timeValue, setTimeValue] = React.useState<any[]>([dayjs().hour() + ":" + "00", dayjs().hour() + ":" + "00"]);

  const getTimeValue = (value: any[]) => {
    setTimeValue([
      value && value[0] ? value[0] : dayjs().hour() + ":" + "00",
      value && value[1] ? value[1] : dayjs().hour() + ":" + "00"
    ])
  }

  return (
    <Grid container spacing={3}>
      <Form className='w-full'>
        <div className='flex w-full justify-between'>
          <Form.Item
            label="Họ và tên"
            layout='vertical'
            name='userName'
            required
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            layout='vertical'
            name='userName'
          >
            <Input />
          </Form.Item>
        </div>

        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="last-name" required>
            Email
          </FormLabel>
          <OutlinedInput
            id="last-name"
            name="last-name"
            type="last-name"
            placeholder="Snow"
            autoComplete="last name"
            required
            value={userData?.email}
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 6 }}>
          <FormLabel htmlFor="city" required>
            Số điện thoại
          </FormLabel>
          <OutlinedInput
            id="city"
            name="city"
            type="city"
            placeholder="New York"
            autoComplete="City"
            required
            value={userData?.phoneNumber}
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 6 }}>
          <FormLabel htmlFor="state" required>
            Địa chỉ
          </FormLabel>
          <OutlinedInput
            id="state"
            name="state"
            type="state"
            placeholder="NY"
            autoComplete="State"
            required
            value={userData?.address}
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 6 }}>
          <FormLabel htmlFor="zip" required>
            Thời gian thuê
          </FormLabel>
          <div
            className="w-full border-2 h-16  rounded-md flex items-center"

          >
            <div
              className="h-full w-12 flex items-center justify-center text-sky-500"
              onClick={() => setIsOpenModalN(true)}
            >
              <CalendarMonthIcon />
            </div>
            <div className="h-full w-auto flex items-center">
              <div>
                <div className="text-xs text-gray-500">Thời gian thuê</div>
                <div className="text-sm font-semibold">{timeValue[0]}, {dateValue[0]} đến {timeValue[1]}, {dateValue[1]}</div>
              </div>
            </div>
            <CarModal
              isOpen={isOpenModalN}
              onCancel={() => setIsOpenModalN(false)}
              title={"Thời gian thuê xe"}
              element={<CarCalendar setDateValue={getDateValue} setTimeValue={getTimeValue} onSubmit={() => setIsOpenModalN(false)} />}
            />
          </div>
        </FormGrid>
        {/* <FormGrid size={{ xs: 6 }}>
        <FormLabel htmlFor="country" required>
          Country
        </FormLabel>
        <OutlinedInput
          id="country"
          name="country"
          type="country"
          placeholder="United States"
          autoComplete="shipping country"
          required
          size="small"
        />
      </FormGrid>
      <FormGrid size={{ xs: 12 }}>
        <FormLabel htmlFor="address1" required>
          Address line 1
        </FormLabel>
        <OutlinedInput
          id="address1"
          name="address1"
          type="address1"
          placeholder="Street name and number"
          autoComplete="shipping address-line1"
          required
          size="small"
        />
      </FormGrid>
      <FormGrid size={{ xs: 12 }}>
        <FormLabel htmlFor="address2">Address line 2</FormLabel>
        <OutlinedInput
          id="address2"
          name="address2"
          type="address2"
          placeholder="Apartment, suite, unit, etc. (optional)"
          autoComplete="shipping address-line2"
          required
          size="small"
        />
      </FormGrid> */}

        {/* <FormGrid size={{ xs: 12 }}>
        <FormControlLabel
          control={<Checkbox name="saveAddress" value="yes" />}
          label="Use this address for payment details"
        />
      </FormGrid> */}
      </Form>

    </Grid>
  );
}

export default AddressForm
