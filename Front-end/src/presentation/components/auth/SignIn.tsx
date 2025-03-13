import * as React from 'react';
import { useNavigate, Link as RouterLink, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { Divider, IconButton, InputAdornment } from '@mui/material';
import { GoogleIcon, FacebookIcon } from '../auth/CustomIcons';
import { useDispatch, useSelector } from '../redux/Store';
import { LoginUser, loginWithGoogle } from '../redux/slices/Authentication';
import { RootState } from '../redux/Store';
import { ToastContainer, toast } from "react-toastify";
import { Eye, EyeOff } from 'lucide-react';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: '100%',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

export default function SignIn() {
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [serverError, setServerError] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state: RootState) => state.auth);

  const handleGoogleLogin = async () => {
    try {
      const user = await dispatch(loginWithGoogle()).unwrap();
      console.log("User object:", user);
      toast.success("Đăng nhập thành công");
      navigate("/");
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Đăng nhập thất bại");
    }
  };

  const validateInputs = () => {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) return;

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await dispatch(LoginUser({ email, password }));
      toast.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error: any) {
      toast.error('errol!');
      console.log(error);
    }
  };

  return (
    <>
      <CssBaseline />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            Đăng nhập
          </Typography>
          {serverError && (
            <Typography color="error" sx={{ textAlign: 'center' }}>
              {serverError}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={!!emailError}
                helperText={emailError}
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                autoComplete="email"
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Mật khẩu</FormLabel>
              <TextField
                error={!!passwordError}
                helperText={passwordError}
                name="password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
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

            <Button type="submit" fullWidth variant="contained" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
            <Link to={'/app/forgot-password'}>
              <Button component="button" variant="text" sx={{ alignSelf: 'center' }}>
                Quên mật khẩu?
              </Button>
            </Link>
          </Box>
          <Typography textAlign="center" color="error">
            {serverError}
          </Typography>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập bằng google"}
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Bạn chưa có tài khoản?{' '}
              <RouterLink to="/app/register">
                <button>Đăng ký</button>
              </RouterLink>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </>
  );
}