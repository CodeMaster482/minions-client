import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Face2RoundedIcon from '@mui/icons-material/Face2Rounded';

import Input from '../components/input/input';
import InfoCard from '../components/card/card';
import Collapse from '@mui/material/Collapse'; // Import Collapse for animation

function MainPage() {
    const [URL, setInputValue] = React.useState('');
    const [scanResult, setScanResult] = React.useState<any>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    const handleProfileButtonClick = () => {
      navigate('/profile'); // Programmatically navigate to the profile page
    };


    // Validation function
    const validateInput = (value: string) => {
      const urlPattern = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/; // Simple URL pattern
      const ipPattern = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/; // IP address pattern
      const domainPattern = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/; // Domain pattern

      return urlPattern.test(value) || ipPattern.test(value) || domainPattern.test(value);
    };

    React.useEffect(() => {
      if (URL.length > 256) {
        setError('URL слишком длинный. Максимальная длина: 256 символов.');
      } else {
        setError(null); // Clear error if the URL length is within the limit
      }
    }, [URL]);
  
    const handleButtonClick = async () => {
      if (!validateInput(URL)) {
        setError('Введите корректный URL, IP-адрес или домен.');
        setScanResult(null); // Clear previous result
        return;
      }

      try {
        const response = await fetch(`http://90.156.219.248:8080/api/scan/uri?request=${encodeURIComponent(URL)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
  
        if (!response.ok) {
          throw new Error(`Error: status ${response.status}`);
        }
  
        const data = await response.json();
        setScanResult(data); // Save the result data to state
        setError(null); // Reset any previous error
      } catch (error: any) {
        console.error('Request failed:', error);
        setError(error.message); // Save the error message to display later
        setScanResult(null); // Clear previous result
      }
    };

    const handleFileButtonClick = () => {
      fileInputRef.current?.click(); // Trigger the file input click
    };

    const handleFileUpload = async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const isImageFile = file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg";
      const url = isImageFile ? "http://90.156.219.248:8080/api/scan/screen" : "http://90.156.219.248:8080/api/scan/file";

      try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error(`Ошибка: статус ${response.status}`);
        const data = await response.json();
        setScanResult(data);
        setError(null);
      } catch (error: any) {
        console.error('File upload failed:', error);
        setError(error.message);
        setScanResult(null);
      }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!isDragging) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      
      const file = event.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    };

    return (
      <div 
        style={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh', 
          flexDirection: 'column', 
          gap: '1rem',
          border: isDragging ? '4px dashed #858585' : 'none', // highlight during drag
          backgroundColor: isDragging ? '#111111' : 'transparent' // light background during drag
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && 
          <div 
            style={{
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '50vh', 
              flexDirection: 'column',
            }}
          >
            <Typography variant="h4" component="div"><strong>Drop</strong> file here to <strong>upload</strong></Typography>
          </div>
        }

        <div style={{
          position: 'fixed', 
          top: '1rem', 
          right: '1rem', 
          zIndex: 1000,
          display: !isDragging ? 'inherit' : 'none'
        }}
        >
          <IconButton onClick={handleProfileButtonClick}>
            <Face2RoundedIcon/>
          </IconButton>
          <IconButton href='/settings'>
            <SettingsIcon />
          </IconButton>
        </div>
        <div 
          style={{ 
            display: 'inline-flex', 
            flexDirection: 'column', 
            gap: '1rem' 
          }}
        >
          <div 
            style={{ 
              display: !isDragging? 'inline-flex': 'none', 
              justifyContent: 'center' 
            }}
          >
            <Input
              size='small'
              error={!!error}
              helperText={error}
              type='text'
              placeholder="IP, domain, URL..."
              onChange={(e) => setInputValue(e.target.value)}
              style={{ height: '40px' }}
              onKeyDown={(e) => e.key === 'Enter' && handleButtonClick()}
            />
            <IconButton
              color='primary' 
              onClick={handleButtonClick}
            >
              <SendIcon />
            </IconButton>
            <IconButton color='primary' onClick={handleFileButtonClick}>
              <AttachFileIcon />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
              />
            </IconButton>
          </div>
  
          {/* Display scan results with animation */}
          <Collapse in={!!scanResult} timeout={500}> {/* Animation duration */}
            <div>
              {scanResult && <InfoCard scanResult={scanResult}></InfoCard>}
            </div>
          </Collapse>
        </div>
      </div>
    );
}

export default MainPage;
