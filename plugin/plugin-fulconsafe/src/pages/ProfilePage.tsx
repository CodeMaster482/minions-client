import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend);

// URLs for API endpoints
const API_BASE_URL = 'http://90.156.219.248:8080/api/v2/stat';
const LOGOUT_API_URL = 'http://90.156.219.248:8080/api/auth/logout';

function ProfilePage() {
  const { isAuthenticated, logout } = useAuth(); // Destructure logout from useAuth
  const navigate = useNavigate();
  const [greenLinksData, setGreenLinksData] = useState([]);
  const [redLinksData, setRedLinksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('all-time');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let apiUrlGreen = '';
        let apiUrlRed = '';
        switch (timePeriod) {
          case 'month':
            apiUrlGreen = `${API_BASE_URL}/top-green-links-month`;
            apiUrlRed = `${API_BASE_URL}/top-red-links-month`;
            break;
          case 'week':
            apiUrlGreen = `${API_BASE_URL}/top-green-links-week`;
            apiUrlRed = `${API_BASE_URL}/top-red-links-week`;
            break;
          case 'all-time':
          default:
            apiUrlGreen = `${API_BASE_URL}/top-green-links-all-time`;
            apiUrlRed = `${API_BASE_URL}/top-red-links-all-time`;
            break;
        }

        // Fetch green links data
        const responseGreen = await fetch(apiUrlGreen);
        if (responseGreen.ok) {
          const dataGreen = await responseGreen.json();
          setGreenLinksData(dataGreen);
        } else {
          console.error('Failed to fetch green links data');
        }

        // Fetch red links data
        const responseRed = await fetch(apiUrlRed);
        if (responseRed.ok) {
          const dataRed = await responseRed.json();
          setRedLinksData(dataRed);
        } else {
          console.error('Failed to fetch red links data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timePeriod]);

  const handleTimePeriodChange = (period:any) => {
    setTimePeriod(period);
  };

  const handleNavigateBack = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(LOGOUT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        logout(); // Update authentication state
        localStorage.removeItem('session_id'); // Clear session token
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  // Function to prepare data for the pie chart
  const prepareChartData = (data:any) => {
    return {
      labels: data.map((item:any) =>
        item.request.length > 20 ? item.request.substring(0, 20) + '...' : item.request
      ),
      datasets: [
        {
          data: data.map((item:any) => item.access_count),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
        },
      ],
    };
  };

  // Function to render pie charts
  const renderPieChart = (data:any, title:any) => {
    // Check if there is data to display
    const filteredData = data.filter((item:any) => item.request !== 'N/A');
    const hasData = filteredData.length > 0;

    if (!hasData) {
      return (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Typography variant="h6" style={{ marginBottom: '10px', fontSize: '16px' }}>
            {title}
          </Typography>
          <Typography variant="body1">No data to display</Typography>
        </div>
      );
    }

    // Continue rendering the chart if data is available
    return (
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Typography variant="h6" style={{ marginBottom: '10px', fontSize: '16px' }}>
          {title}
        </Typography>
        <div style={{ width: '100%', height: '250px' }}>
          <Pie
            data={prepareChartData(filteredData)}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false, // Hide legend to save space
                },
                tooltip: {
                  enabled: true,
                  callbacks: {
                    label: (context) => {
                      const label = filteredData[context.dataIndex].request;
                      const count = filteredData[context.dataIndex].access_count;
                      return `${label}: ${count}`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box',
        padding: '10px',
      }}
    >
      {/* Back Button */}
      <Box position="absolute" top={16} left={16}>
        <IconButton onClick={handleNavigateBack} aria-label="back" size="small">
          <ArrowBackIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Logout Button */}
      <Box position="absolute" top={16} right={16}>
        <Button onClick={handleLogout} variant="contained" size="small">
          Logout
        </Button>
      </Box>

      <Typography
        variant="h5"
        component="div"
        style={{
          marginTop: '50px',
          textAlign: 'center',
          fontSize: '18px',
        }}
      >
        Статистика
      </Typography>

      {/* Time Period Buttons */}
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          variant="contained"
          onClick={() => handleTimePeriodChange('all-time')}
          style={{ marginRight: '5px', fontSize: '12px' }}
        >
          All Time
        </Button>
        <Button
          variant="contained"
          onClick={() => handleTimePeriodChange('month')}
          style={{ marginRight: '5px', fontSize: '12px' }}
        >
          This Month
        </Button>
        <Button
          variant="contained"
          onClick={() => handleTimePeriodChange('week')}
          style={{ fontSize: '12px' }}
        >
          This Week
        </Button>
      </div>

      {/* Pie Charts */}
      <div
        style={{
          marginTop: '20px',
          padding: '0 10px',
        }}
      >
        {renderPieChart(greenLinksData, 'Green Links')}
        {renderPieChart(redLinksData, 'Red Links')}
      </div>
    </div>
  );
}

export default ProfilePage;
