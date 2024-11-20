import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    FormControl,
    InputAdornment,
    InputLabel,
    Input,
    Button,
    Typography,
    Box,
    IconButton,
    CircularProgress,
    Collapse,
    FormHelperText
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/KeyboardArrowLeft';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useAuth } from '../context/AuthProvider';
import { useTheme } from '../context/ThemeProvider';

function AuthPage() {
    const auth = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState(''); // For second password field in registration
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLogin, setIsLogin] = useState(true);  // Toggle between login and registration
    const [loading, setLoading] = useState(false);  // To manage loading state during authentication
    const [passwordError, setPasswordError] = useState(false); // Error state for password
    const [password2Error, setPassword2Error] = useState(false); // Error state for confirm password
    const [errorMessage, setErrorMessage] = useState(''); // General error message

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleAuth = async () => {
        if (loading) return; // Prevent multiple submissions

        setLoading(true);

        // Basic validation: Password must be at least 6 characters long
        const isPasswordValid = password.length >= 6;
        const doPasswordsMatch = password === password2;

        if (!isPasswordValid) {
            setPasswordError(true);
            setErrorMessage('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        if (!isLogin && !doPasswordsMatch) {
            setPassword2Error(true);
            setErrorMessage('Passwords do not match');
            setLoading(false);
            return;
        }

        // Clear any existing error messages
        setPasswordError(false);
        setPassword2Error(false);
        setErrorMessage('');

        const authData = {
            username: username,
            password: password
        };

        const url = isLogin
            ? 'http://90.156.219.248:8080/api/auth/login'  // Login endpoint
            : 'http://90.156.219.248:8080/api/auth/register';  // Registration endpoint

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(authData),
            });

            if (!response.ok) {
                throw new Error(isLogin ? 'Login failed' : 'Registration failed');
            }

            const data = await response.json();
            const authToken = data.token;  // Assuming the API returns a token
            localStorage.setItem('session_id', authToken);
            auth.login();
            console.log(`${isLogin ? 'Logged in' : 'Registered'} successfully:`, data);

            // Optionally redirect the user after successful login/registration
            navigate('/profile');

        } catch (error) {
            console.error('Error during authentication:', error);
        } finally {
            setLoading(false);  // Reset loading state after response
        }
    };

    const handleNavigateBack = () => {
        navigate('/');
    };

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate('/profile');
        }
    }, [auth.isAuthenticated, navigate]);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            width="100vw"
            position="relative" // Allows positioning of the back button
        >
            {/* Back Button in Top Left Corner */}
            <Box position="absolute" top={16} left={16}>
                <IconButton onClick={handleNavigateBack}>
                    <ArrowBackIcon />
                </IconButton>
            </Box>
            {/* Form Container */}
            <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="center"
                width="100%"
                maxWidth="400px" // Set a max width for the form
                p={3}
                boxShadow={3}
                borderRadius={2}
                bgcolor='#1d1d1d'
                sx={{
                    transition: 'transform 0.3s ease-in-out', // Smooth transition for form switching
                    transform: isLogin ? 'scale(1)' : 'scale(1.01)', // Slight scaling effect when toggling
                    opacity: isLogin ? 1 : 0.9, // Change opacity for better transition feel
                }}
            >
                <Typography variant="h4" gutterBottom>
                    {isLogin ? 'Login' : 'Register'}
                </Typography>
                <FormControl sx={{ m: 0, width: '100%' }} variant="outlined" error={passwordError}>
                    {/* Username input */}
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <Input
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ mb: 2 }}
                        disabled={loading}
                    />
                </FormControl>

                <FormControl sx={{ m: 0, width: '100%' }} variant="outlined" error={passwordError}>
                    {/* Password input */}
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={showPassword ? 'hide password' : 'show password'}
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        sx={{ mb: 2 }}
                        disabled={loading}
                    />
                    {passwordError && <FormHelperText>{errorMessage}</FormHelperText>}
                </FormControl>

                {/* Conditionally render the second password field for registration */}
                <Collapse in={!isLogin} timeout={500} sx={{width: '100%'}}> {/* Animation timeout */}
                    <FormControl sx={{ m: 0, width: '100%' }} variant="outlined" error={password2Error}>
                        <InputLabel htmlFor="password2">Confirm Password</InputLabel>
                        <Input
                            id="password2"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPassword ? 'hide password' : 'show password'}
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            sx={{ mb: 2 }}
                            disabled={loading}
                        />
                        {password2Error && <FormHelperText>{errorMessage}</FormHelperText>}
                    </FormControl>
                </Collapse>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAuth}
                    sx={{ mb: 2 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : isLogin ? 'Login' : 'Register'}
                </Button>

                <Box mt={2} alignSelf="start">
                    <Typography variant="body2">
                        {isLogin
                            ? "Don't have an account?"
                            : 'Already have an account?'}
                        <Button
                            variant="text"
                            color="primary"
                            onClick={() => setIsLogin(!isLogin)}
                            sx={{ textTransform: 'none', marginLeft: 1 }}
                            disabled={loading}
                        >
                            {isLogin ? 'Register' : 'Login'}
                        </Button>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default AuthPage;
