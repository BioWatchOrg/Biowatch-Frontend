import { Navigate, Route, Routes } from 'react-router-dom';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import LoginPage from '../features/auth/pages/LoginPage';
import SignupPage from '../features/auth/pages/SignupPage';
import LandingPage from '../features/landing/pages/LandingPage';
import DashboardPage from '../pages/DashboardPage';
import LegalPlaceholderPage from '../pages/LegalPlaceholderPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/confidentialite" element={<LegalPlaceholderPage title="Confidentialite" />} />
      <Route
        path="/cgu"
        element={<LegalPlaceholderPage title="Conditions generales d'utilisation" />}
      />
      <Route path="/contact" element={<LegalPlaceholderPage title="Contact" />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
