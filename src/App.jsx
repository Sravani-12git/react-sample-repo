import { Navigate, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function requireAdminAuth() {
  return !!localStorage.getItem('adminLoggedIn');
}

function ProtectedRoute({ children }) {
  return requireAdminAuth() ? children : <Navigate to="/admin" replace />;
}

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
