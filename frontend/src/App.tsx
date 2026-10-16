/**
 * App — Root Router Configuration
 * Member 1 (Frontend & UI/UX) — Sprint 1
 *
 * Route map:
 *   /              → Redirect to /dashboard (if auth) or /login
 *   /login         → LoginPage (public)
 *   /register      → RegisterPage (public)
 *   /dashboard     → DashboardPage (protected)
 *   /groups        → GroupListPage (protected)
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GroupListPage from './pages/GroupListPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes wrapped in AppLayout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/groups" element={
              <ProtectedRoute><GroupListPage /></ProtectedRoute>
            } />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
