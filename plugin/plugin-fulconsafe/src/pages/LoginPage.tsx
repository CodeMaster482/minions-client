import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Input, Button, Typography, Box, IconButton } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/KeyboardArrowLeft';

import { useAuth } from '../context/AuthProvider';

function AuthPage() {
    const auth = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);  // Toggle between login and registration
    
    const handleAuth = async () => {
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
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(authData)
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
            // navigate('/profile');
        
        } catch (error) {
            console.error('Error during authentication:', error);
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
            display="inline-flex"
            flexDirection="column" 
            alignItems="flex-start" 
            justifyContent="center"
            minHeight="100vh"
            width="50vh"
            p={3}
        >
            <IconButton onClick={handleNavigateBack}>
                <ArrowBackIcon />
            </IconButton>
            <Box>
                <Typography variant="h4" gutterBottom>{isLogin ? 'Login' : 'Register'}</Typography>
                <Input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ mb: 2, width: '100%' }}
                />
                <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 2, width: '100%' }}
                />

                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleAuth}
                >
                    {isLogin ? 'Login' : 'Register'}
                </Button>

                <Box mt={2}>
                    <Typography variant="body2">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <Button 
                            variant="text" 
                            color="primary" 
                            onClick={() => setIsLogin(!isLogin)} 
                            sx={{ textTransform: 'none', marginLeft: 1 }}
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
