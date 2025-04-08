import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import StudentDashboard from './pages/StudentDashboard';
import ViewResults from './pages/ViewResults';
import UploadResults from './pages/UploadResults';
import Analytics from './pages/Analytics';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/' element={<Register/>} /> 
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/results" element={<ViewResults />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/upload" element={<UploadResults />} />
          <Route path="/admin/analytics" element={<Analytics />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;