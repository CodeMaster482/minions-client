import * as React from 'react';

import IconButton from '@mui/material/IconButton'

import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings'
import AttachFileIcon from '@mui/icons-material/AttachFile';

import Input from '../componets/input/input';
import Button from '../componets/button/button';
import InfoCard from '../componets/card/card';


function MainPage() {
    const [URL, setInputValue] = React.useState('');
    const [scanResult, setScanResult] = React.useState<any>(null);
    const [error, setError] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);


    // Validation function
    const validateInput = (value: string) => {
      const urlPattern = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/; // Simple URL pattern
      const ipPattern = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/; // IP address pattern
      const domainPattern = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/; // Domain pattern

      return urlPattern.test(value) || ipPattern.test(value) || domainPattern.test(value);
    };
  
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

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`http://90.156.219.248:8080/api/scan/file`, {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`Ошибка: статус ${response.status}`);
        }
  
        const data = await response.json();
        setScanResult(data); // Save the result data to state
        setError(null); // Reset any previous error
      } catch (error: any) {
        console.error('File upload failed:', error);
        setError(error.message);
        setScanResult(null);
      }
    };

    return (
      <div style={{
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        flexDirection: 'column', 
        gap: '1rem'
      }}>

        <div style={{
          position: 'fixed', 
          top: '1rem', 
          right: '1rem', 
          zIndex: 1000
        }}>
          <IconButton>
            <SettingsIcon />
          </IconButton>
        </div>
        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center' }}>
            <Input
              size='small'
              error={!!error}
              helperText={error}
              type='text'
              placeholder="IP, domain, URL..."
              onChange={(e) => setInputValue(e.target.value)}
              style={{ height: '40px' }}
            />
            <Button
              disabled={true}
              variant="contained" 
              size="small" 
              type="submit" 
              endIcon={<SendIcon />}
              onClick={handleButtonClick}
              style={{ height: '40px', display: 'none' }}
            >
              Send
            </Button>
            <IconButton color='primary' onClick={handleButtonClick}>
              <SendIcon />
            </IconButton>
            <IconButton color='primary' onClick={handleFileButtonClick}>
              <AttachFileIcon />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </IconButton>
          </div>
  
          {/* Display scan results */}
          {scanResult && 
            <InfoCard scanResult={scanResult}></InfoCard>
          }
          {/*scanResult && (
            <div>
              <h3>Результат сканирования</h3>
              <p><strong>Опасность:</strong> {scanResult.Zone === "Red" ? "данная ссылка опасна" : scanResult.Zone === "Green" ? "данная ссылка безопасна" : "нет точной информации"}</p>
  
              {scanResult.IpGeneralInfo && (
                <div>
                  <h4>Информация об IP</h4>
                  <p><strong>IP:</strong> {scanResult.IpGeneralInfo.Ip}</p>
                  <p><strong>Категория:</strong> {(scanResult.IpGeneralInfo.Categories || []).join(", ") || "нет данных"}</p>
                  <p><strong>Страна:</strong> {scanResult.IpGeneralInfo.CountryCode || "нет данных"}</p>
                </div>
              )}
  
              {scanResult.DomainGeneralInfo && (
                <div>
                  <h4>Информация о домене</h4>
                  <p><strong>Домен:</strong> {scanResult.DomainGeneralInfo.Domain}</p>
                  <p><strong>Категория:</strong> {(scanResult.DomainGeneralInfo.Categories || []).join(", ") || "нет данных"}</p>
                  <p><strong>Количество файлов:</strong> {scanResult.DomainGeneralInfo.FilesCount || 0}</p>
                  <p><strong>Количество IP:</strong> {scanResult.DomainGeneralInfo.Ipv4Count || 0}</p>
                  <p><strong>Количество обращений:</strong> {scanResult.DomainGeneralInfo.HitsCount || 0}</p>
                </div>
              )}
  
              {scanResult.UrlGeneralInfo && (
                <div>
                  <h4>Информация о URL</h4>
                  <p><strong>URL:</strong> {scanResult.UrlGeneralInfo.Url}</p>
                  <p><strong>Категория:</strong> {(scanResult.UrlGeneralInfo.Categories || []).join(", ") || "нет данных"}</p>
                  <p><strong>Количество файлов:</strong> {scanResult.UrlGeneralInfo.FilesCount || 0}</p>
                </div>
              )}
            </div>
          )*/}
        </div>
      </div>
    );
}

export default MainPage;