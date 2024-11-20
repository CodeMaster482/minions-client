// src/pages/Settings.tsx

import React from 'react';
import { Switch } from '@mui/material';

interface SettingsPageProps {
  toggleTheme: any;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ toggleTheme }) => {
  return (
    <div>
      <h2>Settings</h2>
      <div>
        <label>Dark Mode</label>
        <Switch onChange={toggleTheme} />
      </div>
    </div>
  );
};

export default SettingsPage;
