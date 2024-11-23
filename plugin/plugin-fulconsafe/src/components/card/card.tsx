import React, { useState, useEffect } from 'react';
import { Box, Card, CardActions, CardContent, Button, Typography, Chip, Avatar } from '@mui/material';
import { CardProps } from '@mui/material/Card';
import { getCategoryLabel, getCategoryColor, getTextColor } from '../../lib/categoriesMap';

const langRU = 'ru'

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
    UrlDomainWhoIs?: {
      DomainName?: string;
    };
    UrlGeneralInfo?: {
      Url: string;
      Categories?: string[];
      FilesCount?: number;
      Ipv4Count?: number;
    };
    FileGeneralInfo?: {
      FileStatus?: string;
      Size?: number;
      Sha1?: string;
      Md5?: string;
      Sha256?: string;
      HitsCount?: string;
      FirstSeen?: string;
      LastSeen?: string;
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

  // Helper to determine safety status
  const getSafetyStatus = (zone: string) => {
    if (zone === 'Red') return { text: 'Опасно', color: 'error.main' };
    if (zone === 'Green') return { text: 'Безопасно', color: 'success.main' };
    return { text: 'Неизвестно', color: 'grey.500' };
  };

  const safetyStatus = getSafetyStatus(scanResult.Zone);

  return (
    <Box sx={{ minWidth: 400, margin: '1.5vh' }}>
      <Card variant="outlined" {...props} ref={ref} sx={{ margin: '1vh', borderColor: safetyStatus.color }}>
        <CardContent sx={{ display: 'contents' }}>
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, margin: '1vh' }}>
            {scanResult.UrlGeneralInfo?.Url}
            {scanResult.FileGeneralInfo?.FileStatus}
          </Typography>
          <Typography variant="h5" component="div" sx={{ margin: '1vh', color: safetyStatus.color }}>
            {safetyStatus.text}
          </Typography>

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
                      label={getCategoryLabel(category, langRU)}
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
                      label={getCategoryLabel(category, langRU)}
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

          {/* URL General Info */}
          {scanResult.UrlGeneralInfo && (
            <Box sx={{ mt: 2, margin: '1vh' }}>
              <Typography variant="h6">Информация о домене</Typography>
              <Typography variant="body2">
                <strong>Домен:</strong> {scanResult.UrlGeneralInfo.Url}
              </Typography>
              <Typography variant="body2">
                <strong>Категория:</strong>
              </Typography>
              <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(scanResult.UrlGeneralInfo.Categories || []).map((category, index) => {
                  const bgColor = getCategoryColor(category);
                  const txtColor = getTextColor(bgColor);

                  return (
                    <Chip
                      size="small"
                      key={index}
                      label={getCategoryLabel(category, langRU)}
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
                <strong>Количество файлов:</strong> {scanResult.UrlGeneralInfo.FilesCount || 0}
              </Typography>
              <Typography variant="body2">
                <strong>Количество IP:</strong> {scanResult.UrlGeneralInfo.Ipv4Count || 0}
              </Typography>
              <Typography variant="body2">
                <strong>Домен:</strong> {scanResult.UrlDomainWhoIs?.DomainName || 0}
              </Typography>
            </Box>
          )}

          {/* File General Info */}
          {scanResult.FileGeneralInfo && (
            <Box sx={{ mt: 2, margin: '1vh' }}>
              <Typography variant="h6">Информация о файле</Typography>
              <Typography variant="body2">
                <strong>Статус:</strong> {scanResult.FileGeneralInfo.FileStatus || 'Не определено'}
              </Typography>
              <Typography variant="body2">
                <strong>SHA1:</strong> {scanResult.FileGeneralInfo.Sha1 || 'Не определено'}
              </Typography>
              <Typography variant="body2">
                <strong>MD5:</strong> {scanResult.FileGeneralInfo.Md5 || 'Не определено'}
              </Typography>
              <Typography variant="body2">
                <strong>Размер файла:</strong> {scanResult.FileGeneralInfo.Size || 0} байт
              </Typography>
              <Typography variant="body2">
                <strong>Количество проверок:</strong> {scanResult.FileGeneralInfo.HitsCount || 0}
              </Typography>
              <Typography variant="body2">
                <strong>Первое обнаружение:</strong> {scanResult.FileGeneralInfo.FirstSeen || 'Не указано'}
              </Typography>
              <Typography variant="body2">
                <strong>Последнее обнаружение:</strong> {scanResult.FileGeneralInfo.LastSeen || 'Не указано'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
});

export default InfoCard;
