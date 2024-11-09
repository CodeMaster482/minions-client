import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import './App.css';

import MainPage from './pages/MainPage'
import ProfilePage from './pages/ProfilePage';

interface PrivateRouteProps {
  element: React.ReactNode; // JSX element or any renderable content
}

function PrivateRoute({element}: PrivateRouteProps) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('session_id');
    setIsAuthenticated(!!token);
  }, []);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return element;
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/'
          element={
            <MainPage/>
          }
        />
        <Route path='/settings'></Route>
        <Route path='/profile' 
          element={
            <PrivateRoute element={<ProfilePage/>}/>
          }>
        </Route>
        <Route path='/login'></Route>
      </Routes>
    </div>
  );
}

export default App;