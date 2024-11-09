// src/components/ProtectedRoute.tsx

import React from 'react';
import { Route, Navigate, RouteProps } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

// Define the ProtectedRouteProps interface without trying to extend RouteProps
interface ProtectedRouteProps {
  element: React.ReactNode;
  path: string;
  // You can add other props like exact, strict, etc., if needed
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, path }) => {
  const { isAuthenticated } = useAuth();

  // If the user is authenticated, render the element; otherwise, redirect to login
  return (
    <Route
      path={path}
      element={isAuthenticated ? element : <Navigate to="/login" />}
    />
  );
};

export default ProtectedRoute;
