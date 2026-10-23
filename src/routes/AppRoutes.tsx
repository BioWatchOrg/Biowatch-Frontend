import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from '../features/landing/pages/LandingPage';
import DashboardPage from '../pages/DashboardPage';
import LegalPlaceholderPage from '../pages/LegalPlaceholderPage';
import RequireAuth from './RequireAuth';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route path="/confidentialite" element={<LegalPlaceholderPage title="Confidentialite" />} />
      <Route
        path="/cgu"
        element={<LegalPlaceholderPage title="Conditions generales d'utilisation" />}
      />
      <Route path="/contact" element={<LegalPlaceholderPage title="Contact" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
