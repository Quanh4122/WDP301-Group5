import * as React from 'react';
import { Box, Button, CssBaseline, Divider, FormLabel, FormControl, TextField, Typography, Stack, Card, InputAdornment, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { toast, ToastContainer } from 'react-toastify';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../redux/Store';
import { LoginUser, RegisterUser } from '../redux/slices/Authentication';
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

export default function SignUp() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const { isLoading, isVerify } = useSelector((state: RootState) => state.auth);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userName = formData.get('userName') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
  
    setErrorMessage(null);
  
    try {
      const result = await dispatch(RegisterUser({ userName, phoneNumber, email, password })) as any;
  
      if (result?.response.data?.status === 'success') {
        toast.success(result.response.data.message);
        navigate('/app/verify');
      }
    } catch (err: any) {
      const serverMessage = err?.response.data?.message || err?.message || 'Đã xảy ra lỗi không xác định từ server';
      if (serverMessage.includes('Tài khoản của bạn từng đăng ký nhưng chưa xác thực')) {
        toast.error(serverMessage, {
          autoClose: 2000,
          onClose: () => navigate('/app/verify'),
        });
      } else {
        setErrorMessage(serverMessage);
        toast.error(serverMessage);
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
            Đăng ký
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel>Tên người dùng</FormLabel>
              <TextField 
                name="userName" 
                placeholder="Enter your user name"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Số điện thoại</FormLabel>
              <TextField 
                name="phoneNumber" 
                placeholder="Enter your phone number"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <TextField 
                name="email" 
                placeholder="Enter your email" 
                type="email"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Mật khẩu</FormLabel>
              <TextField
                name="password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
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
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
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