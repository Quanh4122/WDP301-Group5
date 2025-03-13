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
import { toast } from 'react-toastify';

export default function ForgotPasswordPage() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        try {
            await dispatch(ForgotPassword({ email }) as any);
            toast.success(`Gửi về ${email} thành công. Vui lòng kiểm tra.`);
        } catch (err) {
            toast.error('Gửi email thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" className='mt-40 mb-40'>
            <Box sx={{ mt: 8, p: 4, borderRadius: 2, boxShadow: 3, bgcolor: 'white' }}>
                <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
                    Đặt lại mật khẩu
                </Typography>
                <Typography textAlign="center" color="textSecondary" mb={2}>
                    Hãy điền email tài khoản của bản. Chúng tôi sẽ gửi cho bản đường dẫn đặt lại mật khẩu.
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
