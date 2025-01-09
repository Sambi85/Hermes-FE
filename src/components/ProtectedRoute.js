// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { user } = useAuth();

  // If the user is authenticated, render the protected component (Element)
  if (user) {
    return <Element {...rest} />;
  }

  // If the user is not authenticated, redirect to the backend login page
  return <Navigate to="http://localhost:3000/users/sign_in" />;
};

export default ProtectedRoute;
