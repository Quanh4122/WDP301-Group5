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
import { GoogleIcon } from '../auth/CustomIcons';
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleGoogleLogin = async () => {
    try {
      const user = await dispatch(loginWithGoogle()).unwrap();
      toast.success("Đăng nhập thành công");
      navigate("/");
    } catch (error) {
      toast.error("Đăng nhập bằng Google thất bại");
      console.error("Google login failed:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await dispatch(LoginUser({ email, password })) as any;
      toast.success(result.message);
      setTimeout(() => {
        navigate("/");
      }, 2000)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Đăng nhập thất bại";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <CssBaseline />
      <SignInContainer direction="column" justifyContent="space-between" style={{ marginTop: '40px', marginBottom: '40px' }}>
        <ToastContainer/>
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            Đăng nhập
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                id="email"
                type="email"
                name="email"
                placeholder="Nhập email của bạn"
                autoComplete="email"
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Mật khẩu</FormLabel>
              <TextField
                name="password"
                placeholder="Nhập mật khẩu của bạn"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
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
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
            <Link to={'/app/forgot-password'}>
              <Button component="button" variant="text" sx={{ alignSelf: 'center' }}>
                Quên mật khẩu?
              </Button>
            </Link>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập bằng Google"}
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
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}