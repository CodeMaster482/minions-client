import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Face2RoundedIcon from '@mui/icons-material/Face2Rounded';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';

import Input from '../components/input/input';
import InfoCard from '../components/card/card';

const MAX_URL_LENGTH = 256;
const API_URL_SCAN = 'http://90.156.219.248:8080/api/scan';
const API_URL_SCAN_FILE = 'http://90.156.219.248:8080/api/scan/file';
const URL_PATTERN = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/\w \.-]*)*\/?$/; // Improved regex pattern for URL
const IP_PATTERN = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
const DOMAIN_PATTERN = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

const MainPage: React.FC = () => {
  const [URL, setURL] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [scanResult, setScanResult] = React.useState<any>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
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
    } catch (error: any) {
      console.error('Request failed:', error);
      setError(error.message);
      setScanResult(null);
    } finally {
      setLoading(false);
    }
  };

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

  // Drag-and-drop handlers
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

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
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        border: isDragging ? '4px dashed #858585' : 'none',
        backgroundColor: isDragging ? '#111111' : 'transparent',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', flexDirection: 'column' }}>
          <Typography variant="h4" component="div"><strong>Drop</strong> file here to <strong>upload</strong></Typography>
        </div>
      )}

      <div
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 1000,
          display: !isDragging ? 'inherit' : 'none',
        }}
      >
        <IconButton onClick={handleProfileButtonClick}><Face2RoundedIcon /></IconButton>
        <IconButton href="/settings"><SettingsIcon /></IconButton>
      </div>

      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: !isDragging ? 'inline-flex' : 'none', justifyContent: 'center' }}>
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
          <IconButton color="primary" onClick={handleScanRequest}><SendIcon /></IconButton>
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

        {loading && <CircularProgress style={{ marginTop: '2rem' }} />}

        <Collapse in={!!scanResult} timeout={500}>
          <div>{scanResult && <InfoCard scanResult={scanResult} />}</div>
        </Collapse>
      </div>
    </div>
  );
};

export default MainPage;
