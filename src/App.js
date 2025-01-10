import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/conversations/:id" element={<ProtectedRoute element={ChatPage} />} />
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
