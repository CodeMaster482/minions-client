import * as React from 'react';

import { Box } from '@mui/material';
import { Card } from '@mui/material';
import { CardActions } from '@mui/material';
import { CardContent } from '@mui/material';
import { CardProps } from '@mui/material/Card';
import { Button } from '@mui/material';
import { Typography } from '@mui/material';

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
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined" {...props} ref={ref}>
        <CardContent sx={{display: 'contents'}}>
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            {scanResult.UrlGeneralInfo?.Url}
            {scanResult.FileGeneralInfo?.FileStatus}
          </Typography>
          <Typography variant="h5" component="div">
            {scanResult.Zone === "Red" 
              ? "данная ссылка опасна" 
              : scanResult.Zone === "Green" 
              ? "данная ссылка безопасна" 
              : "нет точной информации"}
          </Typography>

          {scanResult.FileGeneralInfo && (
            <Typography variant="body2">
              <strong>Размер файла:</strong> {scanResult.FileGeneralInfo.Size}
            </Typography>
          )}
          {scanResult.IpGeneralInfo && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Информация об IP</Typography>
              <Typography variant="body2">
                <strong>IP:</strong> {scanResult.IpGeneralInfo.Ip}
              </Typography>
              <Typography variant="body2">
                <strong>Категория:</strong> {(scanResult.IpGeneralInfo.Categories || []).join(", ") || "нет данных"}
              </Typography>
              <Typography variant="body2">
                <strong>Страна:</strong> {scanResult.IpGeneralInfo.CountryCode || "нет данных"}
              </Typography>
            </Box>
          )}

          {scanResult.DomainGeneralInfo && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Информация о домене</Typography>
              <Typography variant="body2">
                <strong>Домен:</strong> {scanResult.DomainGeneralInfo.Domain}
              </Typography>
              <Typography variant="body2">
                <strong>Категория:</strong> {(scanResult.DomainGeneralInfo.Categories || []).join(", ") || "нет данных"}
              </Typography>
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

          {scanResult.UrlGeneralInfo && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Информация о URL</Typography>
              <Typography variant="body2">
                <strong>URL:</strong> {scanResult.UrlGeneralInfo.Url}
              </Typography>
              <Typography variant="body2">
                <strong>Категория:</strong> {(scanResult.UrlGeneralInfo.Categories || []).join(", ") || "нет данных"}
              </Typography>
              <Typography variant="body2">
                <strong>Количество файлов:</strong> {scanResult.UrlGeneralInfo.FilesCount || 0}
              </Typography>
            </Box>
          )}
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </Box>
  );
});

export default InfoCard;

// export default function OutlinedCard() {
//   const scanResult = {
//     Zone: "Red",
//     IpGeneralInfo: {
//       Ip: "192.168.0.1",
//       Categories: ["Malicious", "Spam"],
//       CountryCode: "US",
//     },
//     DomainGeneralInfo: {
//       Domain: "example.com",
//       Categories: ["Technology", "Business"],
//       FilesCount: 15,
//       Ipv4Count: 3,
//       HitsCount: 100,
//     },
//     UrlGeneralInfo: {
//       Url: "http://example.com",
//       Categories: ["News"],
//       FilesCount: 5,
//     },
//   };

//   return <InfoCard scanResult={scanResult} />;
// }
