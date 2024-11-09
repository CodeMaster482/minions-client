import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProtectedRoute from '../src/components/protectedRoutes/ProtectedRoutes';

import './App.css';

import MainPage from './pages/MainPage'
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './context/AuthProvider';
import LoginPage from './pages/LoginPage';



function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path='/' element={ <MainPage/> }/>
          <Route path='/settings'></Route>
          
          {/* Protected Route for /profile */}
          <Route
            path="/profile"
            element={ <ProfilePage /> }
          />
          <Route path='/login' element={<LoginPage/>}></Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;