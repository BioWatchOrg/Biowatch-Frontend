import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { isAuthSessionActive, persistAuthSession } from '../features/auth/services/authSession';
import DashboardPage from '../pages/DashboardPage';
import LegalPlaceholderPage from '../pages/LegalPlaceholderPage';

describe('DashboardPage', () => {
  beforeEach(() => window.localStorage.clear());

  it('logs out and returns to the login page', async () => {
    persistAuthSession('marie@bordeaux.fr');
    expect(isAuthSessionActive()).toBe(true);

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<p>login page</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: /Tableau de bord/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('link', { name: /Se deconnecter/i }));

    expect(isAuthSessionActive()).toBe(false);
    expect(screen.getByText('login page')).toBeInTheDocument();
  });
});

describe('LegalPlaceholderPage', () => {
  it('shows its title and a link back to the home page', () => {
    render(
      <MemoryRouter>
        <LegalPlaceholderPage title="CGU" />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'CGU' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Retour a l'accueil/i })).toHaveAttribute('href', '/');
  });
});
