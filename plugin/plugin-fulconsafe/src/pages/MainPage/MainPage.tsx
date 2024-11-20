import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { IconButton, Collapse, Typography, CircularProgress } from '@mui/material';

import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Face2RoundedIcon from '@mui/icons-material/Face2Rounded';

import Input from '../../components/input/input';
import InfoCard from '../../components/card/card';

import './MainPage.css';

const MAX_URL_LENGTH = 256;
const API_URL_SCAN = 'http://90.156.219.248:8080/api/scan';
const API_URL_SCAN_FILE = 'http://90.156.219.248:8080/api/scan/file';
const URL_PATTERN = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/\w \.-]*)*\/?$/; // Improved regex pattern for URL
const IP_PATTERN = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
const DOMAIN_PATTERN = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

const MainPage: React.FC = () => {
  const [URL, setURL] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleProfileButtonClick = () => navigate('/profile');

  // URL validation
  const validateInput = (value: string) => 
    URL_PATTERN.test(value) || IP_PATTERN.test(value) || DOMAIN_PATTERN.test(value);

  // Handle URL scan request
  const handleScanRequest = async () => {
    if (!validateInput(URL)) {
      setError('Введите корректный URL, IP-адрес или домен.');
      setScanResult(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL_SCAN}/uri?request=${encodeURIComponent(URL)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`Error: status ${response.status}`);

      const data = await response.json();
      setScanResult(data);
      setError(null);
    } catch (err: any) {
      console.error(`Error: request failed: `, err);
      
      setError(err.message);
      setScanResult(null);
    } finally {
      setLoading(false);
    }
  }

  // Handle file upload
  const handleFileUpload = async (file: File, url: string) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setScanResult(data);
      setError(null);
    } catch (err: any) {
      console.error('File upload failed:', err);
      setError(err.message);
      setScanResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Drag-and-drop handlers with optimizations
  const handleDragLeave = () => {
    setIsDragging(false); // Only update when necessary
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    // Only set isDragging when state changes
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    const isImageFile = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg';
    const url = isImageFile ? `${API_URL_SCAN}/screen` : `${API_URL_SCAN_FILE}`;
    
    if (file) handleFileUpload(file, url);
  };

  return (
    <div
      className={`drop-zone ${isDragging ? 'dragging' : ''}`}  // Apply CSS class for dragging state
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="dragging-overlay">
          <Typography variant="h4" component="div"><strong>Drop</strong> file here to <strong>upload</strong></Typography>
        </div>
      )}

      <div className="top-right-icons">
        <IconButton onClick={handleProfileButtonClick}><Face2RoundedIcon /></IconButton>
        <IconButton href="/settings"><SettingsIcon /></IconButton>
      </div>

      <div className="input-container">
        <div className="input-row">
          <Input
            size="small"
            error={!!error}
            helperText={error}
            type="text"
            placeholder="IP, domain, URL..."
            onChange={(e) => setURL(e.target.value)}
            style={{ height: '40px' }}
            onKeyDown={(e) => e.key === 'Enter' && handleScanRequest()}
          />
          <IconButton color="primary" sx={{marginLeft: '1vh'}} onClick={handleScanRequest}><SendIcon /></IconButton>
          <IconButton color="primary" onClick={() => fileInputRef.current?.click()}>
            <AttachFileIcon />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], API_URL_SCAN_FILE)}
            />
          </IconButton>
        </div>

        {loading && (
          <div className="loading-overlay">
            <CircularProgress style={{ marginTop: '2rem' }} />
          </div>
        )}

        <Collapse in={!!scanResult} timeout={1000} sx={{display: !(isDragging || loading) ? 'inherit' : 'none'}}>
          <div>{scanResult && <InfoCard scanResult={scanResult} />}</div>
        </Collapse>
      </div>
    </div>
  );
};

export default MainPage;
