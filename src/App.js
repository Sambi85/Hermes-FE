import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import ChatWindow from './ChatWindow';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const ChatPage = () => {
  return (
    <div className="App">
      <h1>Chat Room</h1>
      <ChatWindow />
    </div>
  );
};

const App = () => {
  return (
    <>
      <Helmet>
        {/* Global meta tags */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self';" />
        <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      </Helmet>
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/conversations/:id" element={<ProtectedRoute element={ChatPage} />} />
      </Routes>
    </>
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
