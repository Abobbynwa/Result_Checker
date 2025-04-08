import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Student Pages
import Login from './pages/Login';
import Register from './pages/StudentRegister';
import ForgotPassword from './pages/ForgotPassword';
import StudentDashboard from './pages/StudentDashboard';
import ViewResults from './pages/ViewResults';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import UploadResults from './pages/UploadResults';
import Analytics from './pages/Analytics';
import AddStudent from './pages/AddStudent';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Student */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/results" element={<ViewResults />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/upload" element={<UploadResults />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/add-student" element={<AddStudent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
