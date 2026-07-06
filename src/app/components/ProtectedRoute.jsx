import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { session, role, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If user is logged in but doesn't have the right role, redirect to a default place
    // For now, redirect to login or show an unauthorized message
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h3>Unauthorized Access</h3>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return children;
}
