// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SendMoney from './pages/SendMoney';
import AddFunds from './pages/AddFunds';
import RequestByForm from './pages/RequestByForm';
import RequestByQR from './pages/RequestByQR';


import ProtectedRoute from './components/ProtectedRoute';


export default function App() {
  // The token state is still useful for forcing re-renders on login/logout
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleSetToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        {/* These routes are accessible to everyone */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={handleSetToken} />} />
        <Route path="/register" element={<Register setToken={handleSetToken} />} />

        {/* --- Protected Routes --- */}
        {/* These routes are wrapped by our ProtectedRoute component */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard setToken={handleSetToken} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/send-money" 
          element={
            <ProtectedRoute>
              <SendMoney />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-funds" 
          element={
            <ProtectedRoute>
              <AddFunds />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/request-by-form" 
          element={
            <ProtectedRoute>
              <RequestByForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/request-by-qr" 
          element={
            <ProtectedRoute>
              <RequestByQR />
            </ProtectedRoute>
          } 
        />

        {/* --- Fallback Route --- */}
        {/* Redirects any other path to the home page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
