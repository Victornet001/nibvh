import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{
      display: 'flex', justifyContent: 'center',
      alignItems: 'center', height: '100vh',
      background: '#f8faf9'
    }}>
      <div className="spinner"></div>
    </div>
  );

  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

export default AdminRoute;