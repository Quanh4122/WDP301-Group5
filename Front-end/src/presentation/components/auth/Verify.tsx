import * as React from 'react';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { toast, ToastContainer } from "react-toastify";
import { ResendOTP, VerifyEmail } from "../redux/slices/Authentication";
import { useNavigate } from "react-router-dom";
import { Box, Button, CssBaseline, FormControl, FormLabel, TextField, Typography, Stack, Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import ColorModeSelect from '../shared-theme/ColorModeSelect';

const VerifyContainer = styled(Stack)(({ theme }) => ({
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

const Verify: React.FC = () => {
  const [otp, setOtp] = useState<string>(""); // Thêm state otp
  const [timer, setTimer] = useState<number>(120);
  const [canResend, setCanResend] = useState<boolean>(false);
  const navigate = useNavigate();

  const dispatch = useDispatch<any>();
  const { user, isLoading } = useSelector((state: RootState) => ({
    user: state.auth.user as { email: string } | null,
    isLoading: state.auth.isLoading,
  }));

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  const handleVerify = async () => {
    try {
      const result = await dispatch(VerifyEmail({
        email: user?.email || "",
        otp
      }));
      console.log(result);
      toast.success(result.message);
      setTimeout(() => {
        navigate("/app/sign-in");
      }, 2000);      
    } catch (err: any) {
      const errorMessage = err?.response.data?.message || err?.message || 'Đã xảy ra lỗi không xác định từ server';
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleResend = async () => {
    try {
      const result = await dispatch(ResendOTP(user?.email || ""));
        toast.success(result?.message);
        setTimer(120);
        setCanResend(false);
    } catch (error) {
      const errorMessage = (error as any)?.response?.data?.message || "Gửi lại OTP thất bại";
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <CssBaseline />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <VerifyContainer alignItems="center" justifyContent="center">
        <ToastContainer/>
        <StyledCard variant="outlined">
          <Typography component="h1" variant="h4">
            Xác minh Email
          </Typography>
          <Typography textAlign="center" color="text.secondary">
            Nhập mã OTP được gửi đến email{' '}
            <strong>{user?.email || "Chưa có email"}</strong>
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel>Mã OTP</FormLabel>
              <TextField
                value={otp}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setOtp(e.target.value)
                }
                placeholder="Nhập mã OTP"
                inputProps={{ maxLength: 6 }}
                sx={{ '& .MuiInputBase-input': { textAlign: 'center' } }}
              />
            </FormControl>
            <Button
              variant="contained"
              onClick={handleVerify}
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Đang xác minh..." : "Xác minh"}
            </Button>
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                {timer > 0
                  ? `Mã OTP sẽ hết hạn sau: ${formatTime(timer)}`
                  : "Mã OTP đã hết hạn!"}
              </Typography>
              <Button
                onClick={handleResend}
                disabled={!canResend || isLoading}
                sx={{
                  mt: 1,
                  textTransform: 'none',
                  ...(canResend && !isLoading
                    ? { color: 'primary.main' }
                    : { color: 'text.disabled' }),
                }}
              >
                {isLoading ? "Đang gửi..." : "Gửi lại OTP"}
              </Button>
            </Box>
          </Box>
        </StyledCard>
      </VerifyContainer>
    </div>
  );
};

export default Verify;