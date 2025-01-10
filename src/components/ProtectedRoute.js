import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = true; // Replace with your actual authentication logic

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" />;
  }

  // If authenticated, render the passed component
  return <Component {...rest} />;
};

export default ProtectedRoute;