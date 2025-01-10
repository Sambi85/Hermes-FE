import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {

  return <Route {...rest} element={<Component />} />;
};

export default ProtectedRoute;
