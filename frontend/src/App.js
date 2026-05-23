import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import Home from './pages/dashboard/Home';
import BVN from './pages/dashboard/BVN';
import NIN from './pages/dashboard/NIN';
import CAC from './pages/dashboard/CAC';
import History from './pages/dashboard/History';
import Wallet from './pages/dashboard/Wallet';
import Profile from './pages/dashboard/Profile';

// Admin Pages
import AdminHome from './pages/admin/AdminHome';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPricing from './pages/admin/AdminPricing';

// Sidebar
import Sidebar from './components/Sidebar';

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8faf9' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className="dashboard-main"
        style={{
          flex: 1,
          marginLeft: collapsed ? '64px' : '240px',
          padding: '40px',
          minHeight: '100vh',
          transition: 'margin-left 0.2s ease',
          maxWidth: '100%',
          overflowX: 'hidden'
        }}>
        {children}
      </main>
    </div>
  );
};
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              borderRadius: '10px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            },
            success: {
              iconTheme: { primary: '#0f5132', secondary: 'white' },
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout><Home /></DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/dashboard/bvn" element={
            <PrivateRoute>
              <DashboardLayout><BVN /></DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/dashboard/nin" element={
            <PrivateRoute>
              <DashboardLayout><NIN /></DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/dashboard/cac" element={
            <PrivateRoute>
              <DashboardLayout><CAC /></DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/dashboard/history" element={
            <PrivateRoute>
              <DashboardLayout><History /></DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/dashboard/wallet" element={
            <PrivateRoute>
              <DashboardLayout><Wallet /></DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/dashboard/profile" element={
            <PrivateRoute>
              <DashboardLayout><Profile /></DashboardLayout>
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <DashboardLayout><AdminHome /></DashboardLayout>
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <DashboardLayout><AdminUsers /></DashboardLayout>
            </AdminRoute>
          } />
          <Route path="/admin/pricing" element={
            <AdminRoute>
              <DashboardLayout><AdminPricing /></DashboardLayout>
            </AdminRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;