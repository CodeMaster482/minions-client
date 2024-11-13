import * as React from 'react';
import { Box, Card, CardActions, CardContent, Button, Typography, Chip } from '@mui/material';
import { CardProps } from '@mui/material/Card';

import { getCategoryLabel } from '../../lib/categoriesMap';

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

          {scanResult.FileGeneralInfo && (
            <Typography variant="body2" sx={{ margin: '1vh' }}>
              <strong>Размер файла:</strong> {scanResult.FileGeneralInfo.Size}
            </Typography>
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
                  {(scanResult.IpGeneralInfo.Categories || []).map((category, index) => (
                    <Chip key={index} label={getCategoryLabel(category, 'en')} variant="outlined" sx={{ margin: '2px' }} />
                  ))}
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
                  {(scanResult.DomainGeneralInfo.Categories || []).map((category, index) => (
                    <Chip key={index} label={getCategoryLabel(category, 'en')} variant="outlined" sx={{ margin: '2px' }} />
                  ))}
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
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Информация о URL</Typography>
              <Typography variant="body2">
                <strong>URL:</strong> {scanResult.UrlGeneralInfo.Url}
              </Typography>
              <Typography variant="body2">
                <strong>Категория:</strong>
              </Typography>
              <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(scanResult.UrlGeneralInfo.Categories || []).map((category, index) => (
                    <Chip key={index} label={getCategoryLabel(category, 'en')} variant="outlined" sx={{ margin: '2px' }} />
                  ))}
              </Box>
              <Typography variant="body2">
                <strong>Количество файлов:</strong> {scanResult.UrlGeneralInfo.FilesCount || 0}
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
