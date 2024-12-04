import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProtectedRoute from '../src/components/protectedRoutes/ProtectedRoutes';

import './App.css';

import MainPage from './pages/MainPage/MainPage'
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/Settings';
import { AuthProvider } from './context/AuthProvider';
import LoginPage from './pages/LoginPage';

type AppProps = {
  toggleTheme?: () => void;
};

const App: React.FC<AppProps> = ({ toggleTheme }) => {
  return (
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path='/' element={ <MainPage toggleTheme={toggleTheme}/> }/>
            <Route path='/settings' element={ <SettingsPage toggleTheme={toggleTheme} /> }/>

            {/* Protected Route for /profile */}
            <Route path="/profile" element={ <ProfilePage/> }/>
            <Route path='/login' element={ <LoginPage/> }/>
          </Routes>
        </div>
      </AuthProvider>
  );
}

export default App;