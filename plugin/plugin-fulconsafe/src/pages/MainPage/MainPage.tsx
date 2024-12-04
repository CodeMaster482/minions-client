import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  IconButton,
  Collapse,
  Typography,
  CircularProgress,
  Drawer,
  Switch,
  Tooltip,
} from '@mui/material';

import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Face2RoundedIcon from '@mui/icons-material/Face2Rounded';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

import Input from '../../components/input/input';
import InfoCard from '../../components/card/card';

import './MainPage.css';

const MAX_URL_LENGTH = 256;
const API_URL_SCAN = 'http://90.156.219.248:8080/api/scan';
const API_URL_SCAN_FILE = 'http://90.156.219.248:8080/api/scan/file';
const URL_PATTERN = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/\w \.-]*)*\/?$/;
const IP_PATTERN = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
const DOMAIN_PATTERN = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

interface MainPageProps {
  toggleTheme: any;
}

const MainPage: React.FC<MainPageProps> = ({ toggleTheme }) => {
  const [URL, setURL] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const [showGrayLinks, setShowGrayLinks] = useState<boolean>(false);
  const [showGreenLinks, setShowGreenLinks] = useState<boolean>(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleProfileButtonClick = () => {
    navigate('/profile');
  };

  // Load persistent settings from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('isDarkTheme');
    if (savedTheme) {
      setIsDarkTheme(JSON.parse(savedTheme));
    }

    const savedGrayLinks = localStorage.getItem('showGrayLinks');
    if (savedGrayLinks) {
      setShowGrayLinks(JSON.parse(savedGrayLinks));
    }

    const savedGreenLinks = localStorage.getItem('showGreenLinks');
    if (savedGreenLinks) {
      setShowGreenLinks(JSON.parse(savedGreenLinks));
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('isDarkTheme', JSON.stringify(isDarkTheme));
    localStorage.setItem('showGrayLinks', JSON.stringify(showGrayLinks));
    localStorage.setItem('showGreenLinks', JSON.stringify(showGreenLinks));
  }, [isDarkTheme, showGrayLinks, showGreenLinks]);

  // Validate URL
  const validateInput = (value: string) =>
    URL_PATTERN.test(value) || IP_PATTERN.test(value) || DOMAIN_PATTERN.test(value);

  // Handle scan request
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
      data.FileName = file.name;
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
    event.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    const isImageFile =
      file.type === 'image/png' ||
      file.type === 'image/jpg' ||
      file.type === 'image/jpeg';
    const url = isImageFile ? `${API_URL_SCAN}/screen` : `${API_URL_SCAN_FILE}`;

    if (file) handleFileUpload(file, url);
  };

  const handleThemeChange = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
    toggleTheme();
  }

  return (
    <div
      className={`drop-zone ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="dragging-overlay">
          <Typography variant="h4" component="div" sx={{m: '4vh'}}><strong>Бросте</strong> файл в окно для <strong>проверки</strong></Typography>
        </div>
      )}

      {!isDragging && (
        <div className="top-right-icons">
          <IconButton onClick={handleProfileButtonClick}><Face2RoundedIcon/></IconButton>
          <IconButton onClick={toggleDrawer(true)}><SettingsIcon/></IconButton>
        </div>
      )}

      <div className="input-container">
        {!isDragging && (
          <div className="input-row">
            <Input
              size="small"
              error={!!error}
              helperText={error}
              type="text"
              placeholder="IP, домен, URL..."
              onChange={(e) => setURL(e.target.value)}
              style={{ height: '40px' }}
              onKeyDown={(e) => e.key === 'Enter' && handleScanRequest()}
              autoComplete="off"
            />
            <IconButton color="primary" sx={{ marginLeft: '1vh' }} onClick={handleScanRequest}><SendIcon /></IconButton>
            <IconButton color="primary" onClick={() => fileInputRef.current?.click()}>
              <AttachFileIcon />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files) {
                    const file = e.target.files[0];
                    const isImageFile =
                      file.type === 'image/png' ||
                      file.type === 'image/jpg' ||
                      file.type === 'image/jpeg';
                    const url = isImageFile ? `${API_URL_SCAN}/screen` : `${API_URL_SCAN_FILE}`;
                    handleFileUpload(file, url);
                  }
                }}
              />
            </IconButton>
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <CircularProgress style={{ marginTop: '2rem' }} />
          </div>
        )}

        <Collapse in={!!scanResult && !(isDragging || loading)} timeout={1000}>
          <div style={{display: 'grid'}}>{scanResult && <InfoCard scanResult={scanResult} />}</div>
        </Collapse>
      </div>

      <Drawer open={open} onClose={toggleDrawer(false)} anchor='right' color='secondary'>
        <div className="settings-toggle">
          <div style={{display: 'inline-flex'}}>
            <SettingsIcon />
            <Typography variant="h6" sx={{ml: '6vh'}}>Settings</Typography>
          </div>
          <div className="setting-row">
            <Typography variant="body1">Show Gray Links</Typography>
            <Switch
              checked={showGrayLinks}
              onChange={() => setShowGrayLinks((prev) => !prev)}
              color="primary"
            />
          </div>
          <div className="setting-row">
            <Typography variant="body1">Show Green Links</Typography>
            <Switch
              checked={showGreenLinks}
              onChange={() => setShowGreenLinks((prev) => !prev)}
              color="primary"
            />
          </div>
          <div className="setting-row">
            <Typography variant="body1">Theme</Typography>
            {!isDarkTheme ? <ModeNightIcon /> : <WbSunnyIcon />}
            <Switch
              checked={isDarkTheme}
              onChange={handleThemeChange}
              color="primary"
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default MainPage;
