import React, { useEffect } from 'react';
import { Input } from '@mui/material';

function ProfilePage() {
    // Example: Check if the user is authenticated
    const isAuthenticated = localStorage.getItem('authToken'); // Replace with your actual auth check logic

    // For react-router-dom v5
    // if (!isAuthenticated) {
    //   return <Redirect to="/login" />;
    // }

    return (
        <>
            { isAuthenticated && 
                <Input placeholder="Profile input" />
            }
        </>
    );
}

export default ProfilePage;
