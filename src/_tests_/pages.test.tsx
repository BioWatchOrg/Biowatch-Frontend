import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import LegalPlaceholderPage from '../pages/LegalPlaceholderPage';
import { useUserStore } from '../store/userStore';

describe('DashboardPage', () => {
  beforeEach(() => useUserStore.setState({ isAuthenticated: true }));

  it('signs out and returns to the landing page', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<p>landing page</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: /Tableau de bord/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Se deconnecter/i }));

    expect(useUserStore.getState().isAuthenticated).toBe(false);
    expect(screen.getByText('landing page')).toBeInTheDocument();
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
