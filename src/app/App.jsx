import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './views/Login';

import OperatorLayout from './layouts/OperatorLayout';
import ClientsList from './views/operator/ClientsList';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['operator']}>
                <OperatorLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<ClientsList />} />
          </Route>
          {/* Default redirect based on auth status could be added later */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
