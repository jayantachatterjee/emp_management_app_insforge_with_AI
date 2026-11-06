import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminRoute } from './components/common/AdminRoute';
import { AppLayout } from './components/layout/AppLayout';

import { LoginPage } from './pages/LoginPage';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { EmployeeDirectory } from './pages/EmployeeDirectory';
import { EmployeeProfile } from './pages/EmployeeProfile';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminEmployeeManage } from './pages/AdminEmployeeManage';
import { AdminAuditLogs } from './pages/AdminAuditLogs';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Application Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<EmployeeDashboard />} />
            <Route path="/directory" element={<EmployeeDirectory />} />
            <Route path="/profile" element={<EmployeeProfile />} />

            {/* Role-Based Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/employees"
              element={
                <AdminRoute>
                  <AdminEmployeeManage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <AdminRoute>
                  <AdminAuditLogs />
                </AdminRoute>
              }
            />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
