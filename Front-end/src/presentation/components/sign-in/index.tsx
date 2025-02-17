import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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
import ForgotPassword from './components/ForgotPassword';
import { GoogleIcon, FacebookIcon } from './components/CustomIcons';
import { Link } from 'react-router-dom';
import { Divider } from '@mui/material';
import { login } from '../services/Api';


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
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();


    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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

        const data = new FormData(event.currentTarget);
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        try {
            const response = await login({ email, password });
            console.log(response);
            navigate('/');
            window.location.reload();
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <>
            <CssBaseline />
            <SignInContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
                        Sign in
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
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                error={!!passwordError}
                                helperText={passwordError}
                                name="password"
                                placeholder="Enter your password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <ForgotPassword open={open} handleClose={handleClose} />
                        <Button type="submit" fullWidth variant="contained">
                            Sign in
                        </Button>
                        <Button component="button" onClick={handleClickOpen} variant="text" sx={{ alignSelf: 'center' }}>
                            Forgot your password?
                        </Button>
                    </Box>
                    <Typography textAlign="center" color="error">
                        {serverError}
                    </Typography>
                    <Divider>or</Divider>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button fullWidth variant="outlined" onClick={() => alert('Sign in with Google')} startIcon={<GoogleIcon />}>
                            Sign in with Google
                        </Button>
                        <Button fullWidth variant="outlined" onClick={() => alert('Sign in with Facebook')} startIcon={<FacebookIcon />}>
                            Sign in with Facebook
                        </Button>
                        <Typography sx={{ textAlign: 'center' }}>
                            Don&apos;t have an account?{' '}
                            <Link to="/app/register">
                                Sign up
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </SignInContainer>
        </>
    );
}
