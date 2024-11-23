import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the type for authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to read a specific cookie by name
const getCookie = (name: string): string | undefined => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State to track whether the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for authentication status when the app loads
  useEffect(() => {
    // Check if the session_id cookie exists
    const sessionId = getCookie('session_id'); // Replace 'session_id' with the actual cookie name
    if (sessionId) {
      setIsAuthenticated(true); // Set as authenticated if the session_id cookie is found
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    // Set the session_id cookie when logging in
    document.cookie = "session_id=your-session-id; path=/"; // Set this cookie based on your actual logic
  };

  const logout = () => {
    setIsAuthenticated(false);
    // Remove the session_id cookie when logging out
    document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; // Expire the session_id cookie
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
