import * as React from 'react';
import { Box, Button, CssBaseline, Divider, FormLabel, FormControl, Link, TextField, Typography, Stack, Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { GoogleIcon, FacebookIcon } from './components/CustomIcons';
import { register } from '../services/Api';
import { toast, ToastContainer } from 'react-toastify';
import { Link as RouterLink } from 'react-router-dom';


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
  const [errors, setErrors] = React.useState({ name: '', phoneNumber: '', email: '', password: '' });
  const [loading, setLoading] = React.useState(false);

  const validateInputs = (data: { name: string; phoneNumber: string; email: string; password: string }) => {
    const newErrors = { name: '', phoneNumber: '', email: '', password: '' };

    if (!data.name) newErrors.name = 'Name is required.';
    if (data.phoneNumber.length < 10 || data.phoneNumber.length > 10) newErrors.phoneNumber = 'Phone number must be at least 10 characters long.';
    if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = 'Please enter a valid email address.';
    if (data.password.length < 6) newErrors.password = 'Password must be at least 6 characters long.';

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    if (validateInputs(data)) {
      setLoading(true);
      try {
        const response = await register(data);
        console.log(response);
        toast.success('Sign up successful!');
        window.location.href = '/app/sign-in';
      } catch (error) {
        console.error(error);
        setErrors({ ...errors, email: 'An error occurred. Please try again.' });
      } finally {
        setLoading(false);
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
          <Typography component="h1" variant="h4">Sign up</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl error={Boolean(errors.name)}>
              <FormLabel>Full Name</FormLabel>
              <TextField name="name" placeholder="Enter your full name" error={Boolean(errors.name)} helperText={errors.name} />
            </FormControl>
            <FormControl error={Boolean(errors.name)}>
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
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign up'}
            </Button>
          </Box>
          <Divider>or</Divider>
          <Button variant="outlined" startIcon={<GoogleIcon />}>Sign up with Google</Button>
          <Button variant="outlined" startIcon={<FacebookIcon />}>Sign up with Facebook</Button>
          <Typography textAlign="center">
            Already have an account? <RouterLink to="/app/sign-in">Sign in</RouterLink>
          </Typography>
        </StyledCard>
      </SignUpContainer>
    </div>
  );
}
