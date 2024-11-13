import { useState } from 'react';

const useFileUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);

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
      setError(err.message);
      setScanResult(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    scanResult,
    handleFileUpload,
  };
};

export default useFileUpload;
