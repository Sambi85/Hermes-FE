import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; // Correct import for useNavigate
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import ChatWindow from './ChatWindow';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import './ChatWindow.css';

const ChatPage = () => {
  return (
    <div className="App">
      <h1>Chat Room</h1>
      <ChatWindow />
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      setIsAuthenticated(true);

    } else {
      window.location.href = process.env.CORE_URL || 'http://localhost:3000/users/sign_in';
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<ProtectedRoute element={ChatPage} />} />
    </Routes>
  );
};

const Root = () => (
  <AuthProvider>
    <Router>
      <App />
    </Router>
  </AuthProvider>
);

export default Root;
