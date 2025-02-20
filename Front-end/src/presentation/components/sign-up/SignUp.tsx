import * as React from 'react';
import { Box, Button, CssBaseline, Divider, FormLabel, FormControl, TextField, Typography, Stack, Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { GoogleIcon, FacebookIcon } from './components/CustomIcons';
import { toast, ToastContainer } from 'react-toastify';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from '../redux/Store'; // Sử dụng hooks tùy chỉnh từ file store của bạn
import { RegisterUser } from '../redux/slices/Authentication'; // Điều chỉnh đường dẫn theo dự án của bạn
import { RootState } from '../redux/Store'; // Để có kiểu RootState

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
  const [errors, setErrors] = React.useState<FormDataType>({
    userName: '',
    phoneNumber: '',
    email: '',
    password: '',
  });
  const dispatch = useDispatch();
  // Lấy trạng thái từ Redux theo kiểu an toàn
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const validateInputs = (data: FormDataType) => {
    const newErrors: FormDataType = { userName: '', phoneNumber: '', email: '', password: '' };

    if (!data.userName) newErrors.userName = 'User name is required.';
    if (data.phoneNumber.length !== 10) newErrors.phoneNumber = 'Phone number must be exactly 10 characters long.';
    if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = 'Please enter a valid email address.';
    if (data.password.length < 6) newErrors.password = 'Password must be at least 6 characters long.';

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: FormDataType = {
      userName: formData.get('userName') as string,

      phoneNumber: formData.get('phoneNumber') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    if (validateInputs(data)) {
      try {
        // Dispatch action đăng ký thông qua Redux
        await dispatch(RegisterUser(data));
        if (!error) {
          toast.success('Sign up successful!');
          window.location.href = '/app/sign-in';
        }
      } catch (err) {
        console.error(err);
        setErrors((prev) => ({ ...prev, email: 'An error occurred. Please try again.' }));
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      <CssBaseline />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer alignItems="center" justifyContent="center">
        <StyledCard variant="outlined">
          <Typography component="h1" variant="h4">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl error={Boolean(errors.userName)}>
              <FormLabel>Full Name</FormLabel>
              <TextField name="userName" placeholder="Enter your full name" error={Boolean(errors.userName)} helperText={errors.userName} />
            </FormControl>
            <FormControl error={Boolean(errors.phoneNumber)}>
              <FormLabel>Phone Number</FormLabel>
              <TextField name="phoneNumber" placeholder="Enter your phone number" error={Boolean(errors.phoneNumber)} helperText={errors.phoneNumber} />
            </FormControl>
            <FormControl error={Boolean(errors.email)}>
              <FormLabel>Email</FormLabel>
              <TextField name="email" placeholder="Enter your email" error={Boolean(errors.email)} helperText={errors.email} />
            </FormControl>
            <FormControl error={Boolean(errors.password)}>
              <FormLabel>Password</FormLabel>
              <TextField name="password" type="password" placeholder="Enter your password" error={Boolean(errors.password)} helperText={errors.password} />
            </FormControl>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
          </Box>
          <Divider>or</Divider>
          <Button variant="outlined" startIcon={<GoogleIcon />}>
            Sign up with Google
          </Button>
          <Button variant="outlined" startIcon={<FacebookIcon />}>
            Sign up with Facebook
          </Button>
          <Typography textAlign="center">
            Already have an account? <RouterLink to="/app/sign-in">Sign in</RouterLink>
          </Typography>
        </StyledCard>
      </SignUpContainer>
    </div>
  );
}
