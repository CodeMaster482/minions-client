import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // For navigation
import { useAuth } from '../context/AuthProvider'; // Custom authentication hook
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // ArrowBackIcon for the button

// URLs for API endpoints
const API_BASE_URL = 'http://90.156.219.248:8080/api/stat';
const LOGOUT_API_URL = 'http://90.156.219.248:8080/api/auth/logout';

function ProfilePage() {
  const { isAuthenticated } = useAuth(); // Accessing authentication state and user data
  const navigate = useNavigate(); // Using useNavigate for routing
  const [htmlContentGreen, setHtmlContentGreen] = useState(''); // State to hold the fetched green HTML content
  const [htmlContentRed, setHtmlContentRed] = useState(''); // State to hold the fetched red HTML content
  const [loading, setLoading] = useState(true); // Loading state for fetching
  const [timePeriod, setTimePeriod] = useState<string>('all-time'); // State for time period selection
  const blob = new Blob([htmlContentGreen], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  // Effect hook to handle authentication check and redirect to login if needed
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  // Effect hook to fetch data based on selected time period
  useEffect(() => {
    const fetchHtmlContent = async () => {
      setLoading(true); // Set loading to true when fetching data
      try {
        // Build the API endpoint based on the selected time period
        let apiUrlGreen = '';
        let apiUrlRed = '';
        switch (timePeriod) {
          case 'month':
            apiUrlGreen = `${API_BASE_URL}/top-green-links-month`; // Fetch data for the month
            apiUrlRed = `${API_BASE_URL}/top-red-links-month`;
            break;
          case 'week':
            apiUrlGreen = `${API_BASE_URL}/top-green-links-week`; // Fetch data for the week
            apiUrlRed = `${API_BASE_URL}/top-red-links-week`;
            break;
          case 'all-time':
            apiUrlGreen = `${API_BASE_URL}/top-green-links-all-time`; // Fetch data for all time
            apiUrlRed = `${API_BASE_URL}/top-red-links-all-time`;
            break;
          default:
            apiUrlGreen = `${API_BASE_URL}/top-green-links-all-time`;
            apiUrlRed = `${API_BASE_URL}/top-red-links-all-time`;
        }

        // Fetch green links data
        const responseGreen = await fetch(apiUrlGreen);
        if (responseGreen.ok) {
          const dataGreen = await responseGreen.text(); // Get the HTML response for green links
          setHtmlContentGreen(dataGreen); // Set the green HTML content in state
        } else {
          console.error('Failed to fetch green HTML content');
        }

        // Fetch red links data
        const responseRed = await fetch(apiUrlRed);
        if (responseRed.ok) {
          const dataRed = await responseRed.text(); // Get the HTML response for red links
          setHtmlContentRed(dataRed); // Set the red HTML content in state
        } else {
          console.error('Failed to fetch red HTML content');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false once fetch is complete
      }
    };

    fetchHtmlContent();
  }, [timePeriod]); // Dependency array includes 'timePeriod' to refetch data when it changes

  // Handle the button clicks for selecting the time period
  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period); // Update the selected time period
  };

  // Handle back navigation
  const handleNavigateBack = () => {
    navigate('/'); // Navigate back to the previous page
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch(LOGOUT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        navigate('/login'); // Redirect to login page
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!isAuthenticated) {
    return null; // Optionally return null until the redirect happens
  }

  if (loading) {
    return <div>Loading...</div>; // Render loading state while fetching
  }

  return (
    <div>
      {/* Back Button in Top Left Corner */}
      <Box position="absolute" top={16} left={16}>
        <IconButton onClick={handleNavigateBack} aria-label="back">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Typography 
        variant="h5" 
        component="div" 
        style={{ 
          marginTop: '10vh',
          marginLeft: '10vh' 
        }}
      >
        Статистика
      </Typography>

      {/* Buttons for selecting time period */}
      <div style={{ marginTop: '20px', marginLeft: '10vh' }}>
        <Button 
          variant="contained" 
          onClick={() => handleTimePeriodChange('all-time')} 
          style={{ marginRight: '1vh' }}
        >
          All Time
        </Button>
        <Button variant="contained" onClick={() => handleTimePeriodChange('month')} style={{ marginRight: '1vh' }}>
          This Month
        </Button>
        <Button variant="contained" onClick={() => handleTimePeriodChange('week')} style={{ marginRight: '1vh' }}>
          This Week
        </Button>
      </div>

      {/* Flexbox container for iframes */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '20px', 
        marginLeft: '10vh', 
        marginRight: '10vh' 
      }}>
        {/* Green Links Typography Label */}
        <div style={{ textAlign: 'center', marginRight: '20px' }}>
          <Typography variant="h6" style={{ marginBottom: '10px' }}>
            Green Links
          </Typography>
          <iframe
            title="Green Links HTML Content"
            src={url}
            width="600px"
            height="640px"
            style={{ border: 'none' }}
            onError={() => console.error('Ошибка загрузки данных в iframe')}
          />
        </div>
        
        {/* Red Links Typography Label */}
        <div style={{ textAlign: 'center' }}>
          <Typography variant="h6" style={{ marginBottom: '10px' }}>
            Red Links
          </Typography>
          <iframe
            title="Red Links HTML Content"
            srcDoc={htmlContentRed} // Inject fetched HTML content directly into the iframe
            width="600px" // Makes the iframe take up 48% of the container width
            height="650px"
            style={{ border: 'none' }} // Optional styles
          />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
