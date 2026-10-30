import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import LoginPage from '../features/auth/pages/LoginPage';
import SignupPage from '../features/auth/pages/SignupPage';
import LandingPage from '../features/landing/pages/LandingPage';
import DashboardPage from '../pages/DashboardPage';
import LegalPlaceholderPage from '../pages/LegalPlaceholderPage';

// MapLibre pèse à lui seul plus que tout le reste du bundle : la carte n'est
// téléchargée que par qui s'y rend.
const MapPage = lazy(() => import('../pages/MapPage'));

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route
        path="/carte"
        element={
          <Suspense fallback={<p role="status">Chargement de la carte...</p>}>
            <MapPage />
          </Suspense>
        }
      />
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
