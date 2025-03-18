import * as React from 'react';
import { Box, Button, CssBaseline, Divider, FormLabel, FormControl, TextField, Typography, Stack, Card, InputAdornment, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { GoogleIcon, FacebookIcon } from './CustomIcons';
import { toast, ToastContainer } from 'react-toastify';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../redux/Store';
import { RegisterUser } from '../redux/slices/Authentication';
import { RootState } from '../redux/Store';
import { Eye, EyeOff } from 'lucide-react';

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(2, 4),
  background: '#fffffffff',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow: theme.shadows[5],
  background: '#ffffff',
  [theme.breakpoints.up('sm')]: { width: '450px' },
}));

interface FormDataType {
  userName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const { isLoading, error } = useSelector((state: RootState) => state.auth);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: FormDataType = {
      userName: formData.get('userName') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      const response = await dispatch(RegisterUser(data)).then((action: any) => action.payload);

      // 🟢 Duy nhất 1 dòng xử lý tất cả thông báo từ back-end
      toast[response.status === 'success' ? 'success' : 'warn'](response.message);

      if (response.status === 'success') 
      navigate('/app/verify');
    } catch (error: any) {
      toast.error(error.message || 'Đăng ký thất bại, vui lòng thử lại.');
    }
  };

};

return (
  <div>
    <ToastContainer />
    <CssBaseline />
    <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
    <SignUpContainer alignItems="center" justifyContent="center">
      <StyledCard variant="outlined">
        <Typography component="h1" variant="h4">
          Đăng ký
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl>
            <FormLabel>Họ và tên</FormLabel>
            <TextField name="userName" placeholder="Enter your full name"  />
          </FormControl>
          <FormControl >
            <FormLabel>Số điện thoại</FormLabel>
            <TextField name="phoneNumber" placeholder="Enter your phone number" error={Boolean(errors.phoneNumber)} helperText={errors.phoneNumber} />
          </FormControl>
          <FormControl error={Boolean(errors.email)}>
            <FormLabel>Email</FormLabel>
            <TextField name="email" placeholder="Enter your email" error={Boolean(errors.email)} helperText={errors.email} />
          </FormControl>
          <FormControl error={Boolean(errors.password)}>
            <FormLabel>Password</FormLabel>
            <TextField
              name="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"} // Thay đổi giữa password và text
              error={Boolean(errors.password)}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign up'}
          </Button>
        </Box>
        <Divider>or</Divider>
        <Typography textAlign="center">
          Bạn đã có tài khoản? <RouterLink to="/app/sign-in"><button>Đăng nhập</button></RouterLink>
        </Typography>
      </StyledCard>
    </SignUpContainer>
  </div>
);
}
