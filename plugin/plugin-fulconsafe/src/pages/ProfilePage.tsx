import React, { useEffect, useState } from 'react';
import { Input } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for routing in v6
import { useAuth } from '../context/AuthProvider'; // Import your custom hook
import { Typography } from '@mui/material';

function ProfilePage() {
  const { isAuthenticated } = useAuth(); // Accessing the authentication state
  const navigate = useNavigate(); // Using useNavigate for navigation in v6
  const [htmlContent, setHtmlContent] = useState(''); // State to hold the fetched HTML content
  const [loading, setLoading] = useState(true); // Loading state for fetching

  // Effect hook to handle authentication check and fetching HTML content
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  // Effect hook to fetch data from the API
  useEffect(() => {
    const fetchHtmlContent = async () => {
      try {
        const response = await fetch('http://90.156.219.248:8080/api/statistics/top-links');
        if (response.ok) {
          const data = await response.text(); // Get the response text (HTML)
          setHtmlContent(data); // Set the HTML content in state
        } else {
          console.error('Failed to fetch HTML content');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false once fetch is complete
      }
    };

    fetchHtmlContent();
  }, []); // Empty dependency array means this will run only once when component mounts

  if (!isAuthenticated) {
    return null; // Optionally return null until the redirect happens
  }

  if (loading) {
    return <div>Loading...</div>; // Render a loading state while fetching
  }

  return (
    <div>
      <Typography variant="h5" component="div">
            Статистика
      </Typography>
      <iframe
        title="HTML Content"
        srcDoc={htmlContent} // Inject fetched HTML content directly into the iframe
        width="1500px"
        height="800px"
        style={{ border: 'none', marginTop: '20px' }} // Optional styles
      />
    </div>
  );
}

export default ProfilePage;
