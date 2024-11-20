import React, { useState, useEffect } from 'react';
import { Box, Card, CardActions, CardContent, Button, Typography, Chip, Avatar } from '@mui/material';
import { CardProps } from '@mui/material/Card';

import { getCategoryLabel, getCategoryColor, getTextColor } from '../../lib/categoriesMap';

type CustomCardProps = CardProps & {
  scanResult: {
    Zone: string;
    IpGeneralInfo?: {
      Ip: string;
      Categories?: string[];
      CountryCode?: string;
    };
    DomainGeneralInfo?: {
      Domain: string;
      Categories?: string[];
      FilesCount?: number;
      Ipv4Count?: number;
      HitsCount?: number;
    };
    UrlGeneralInfo?: {
      Url: string;
      Categories?: string[];
      FilesCount?: number;
      Favicon?: string;  // Assuming we get a favicon here
    };
    FileGeneralInfo?: {
      FileStatus?: string;
      Size?: number;
    };
  };
};

const InfoCard = React.forwardRef<HTMLDivElement, CustomCardProps>(function InfoCard(
  { scanResult, ...props },
  ref,
) {
  const [urlMeta, setUrlMeta] = useState<any>(null);

  // Fetch metadata for the URL if available
  useEffect(() => {
    if (scanResult.UrlGeneralInfo?.Url) {
      fetch(`https://api.linkpreview.net?key=yourAPIkey&q=${scanResult.UrlGeneralInfo.Url}`)
        .then(res => res.json())
        .then(data => setUrlMeta(data));
    }
  }, [scanResult.UrlGeneralInfo?.Url]);

  return (
    <Box sx={{ minWidth: 400, margin: '1.5vh' }}>
      <Card variant="outlined" {...props} ref={ref} sx={{ margin: '1vh' }}>
        <CardContent sx={{ display: 'contents' }}>
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, margin: '1vh' }}>
            {scanResult.UrlGeneralInfo?.Url}
            {scanResult.FileGeneralInfo?.FileStatus}
          </Typography>
          <Typography variant="h5" component="div" sx={{ margin: '1vh' }}>
            {scanResult.Zone === 'Red'
              ? 'Данная ссылка опасна'
              : scanResult.Zone === 'Green'
              ? 'Данная ссылка безопасна'
              : 'Нет точной информации'}
          </Typography>

          {/* URL Preview Section */}
          {scanResult.UrlGeneralInfo?.Url && (
            <Box sx={{ margin: '1vh' }}>
              <Typography variant="h6">Превью URL:</Typography>
              {urlMeta ? (
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '1vh' }}>
                  <Avatar alt="Website Preview" src={urlMeta.image || scanResult.UrlGeneralInfo.Favicon || '/default-thumbnail.png'} sx={{ width: 56, height: 56 }} />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle1">{urlMeta.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{urlMeta.description}</Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: '1vh' }}>Загрузка данных...</Typography>
              )}
            </Box>
          )}

          {/* IP General Info */}
          {scanResult.IpGeneralInfo && (
            <Box sx={{ mt: 2, margin: '1vh' }}>
              <Typography variant="h6" sx={{ margin: '1vh' }}>Информация об IP</Typography>
              <Typography variant="body2" sx={{ margin: '1vh' }}>
                <strong>IP:</strong> {scanResult.IpGeneralInfo.Ip}
              </Typography>
              <Typography variant="body2" sx={{ margin: '1vh' }}>
                <strong>Категория:</strong>
              </Typography>
              <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(scanResult.IpGeneralInfo.Categories || []).map((category, index) => {
                  const bgColor = getCategoryColor(category);
                  const txtColor = getTextColor(bgColor);

                  return (
                    <Chip
                      size="small"
                      key={index}
                      label={getCategoryLabel(category, 'en')}
                      variant="filled"
                      sx={{
                        margin: '2px',
                        backgroundColor: bgColor,
                        color: txtColor,
                      }}
                    />
                  );
                })}
              </Box>
              <Typography variant="body2" sx={{ margin: '1vh' }}>
                <strong>Страна:</strong> {scanResult.IpGeneralInfo.CountryCode || 'нет данных'}
              </Typography>
            </Box>
          )}

          {/* Domain General Info */}
          {scanResult.DomainGeneralInfo && (
            <Box sx={{ mt: 2, margin: '1vh' }}>
              <Typography variant="h6">Информация о домене</Typography>
              <Typography variant="body2">
                <strong>Домен:</strong> {scanResult.DomainGeneralInfo.Domain}
              </Typography>
              <Typography variant="body2">
                <strong>Категория:</strong>
              </Typography>
              <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(scanResult.DomainGeneralInfo.Categories || []).map((category, index) => {
                  const bgColor = getCategoryColor(category);
                  const txtColor = getTextColor(bgColor);

                  return (
                    <Chip
                      size="small"
                      key={index}
                      label={getCategoryLabel(category, 'en')}
                      variant="filled"
                      sx={{
                        margin: '2px',
                        backgroundColor: bgColor,
                        color: txtColor,
                      }}
                    />
                  );
                })}
              </Box>
              <Typography variant="body2">
                <strong>Количество файлов:</strong> {scanResult.DomainGeneralInfo.FilesCount || 0}
              </Typography>
              <Typography variant="body2">
                <strong>Количество IP:</strong> {scanResult.DomainGeneralInfo.Ipv4Count || 0}
              </Typography>
              <Typography variant="body2">
                <strong>Количество обращений:</strong> {scanResult.DomainGeneralInfo.HitsCount || 0}
              </Typography>
            </Box>
          )}
        </CardContent>
        <CardActions>
          <Button size="small">Detailed View</Button>
        </CardActions>
      </Card>
    </Box>
  );
});

export default InfoCard;
