import * as React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ForgotPassword } from '../redux/slices/Authentication';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function ForgotPasswordPage() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);
        try {
            await dispatch(ForgotPassword({ email }) as any);
            setSuccess(true);
        } catch (err) {
            setError('Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, p: 4, borderRadius: 2, boxShadow: 3, bgcolor: 'white' }}>
                <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
                    Reset Password
                </Typography>
                <Typography textAlign="center" color="textSecondary" mb={2}>
                    Enter your email address and we'll send you a link to reset your password.
                </Typography>
                <form onSubmit={handleSubmit}>
                    <OutlinedInput
                        autoFocus
                        required
                        margin="dense"
                        id="email"
                        name="email"
                        placeholder="Email address"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    {error && <Typography color="error" textAlign="center">{error}</Typography>}
                    {success && <Typography color="success.main" textAlign="center">Reset link sent successfully!</Typography>}
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading || !email}
                        sx={{ mt: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
                    </Button>
                </form>
            </Box>
        </Container>
    );
}
