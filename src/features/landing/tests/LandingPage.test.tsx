import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useUserStore } from '../../../store/userStore';
import LandingPage from '../pages/LandingPage';

function renderLanding(): void {
  render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  );
}

describe('LandingPage', () => {
  beforeEach(() => useUserStore.setState({ isAuthenticated: false }));

  it('renders a single top-level h1 with the hero headline', () => {
    renderLanding();

    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(/Surveillez vos ecosystemes en temps reel/i);
  });

  it('exposes the main landmark and the section headings', () => {
    renderLanding();

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /Tout ce dont vous avez besoin/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /Pret a proteger votre territoire/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /Chiffres cles/i })).toBeInTheDocument();
  });

  it.each([['Commencer gratuitement'], ['Voir la demo'], ['Demarrer maintenant']])(
    'signs in and opens the dashboard from "%s"',
    async (name) => {
      render(
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<p>dashboard page</p>} />
          </Routes>
        </MemoryRouter>,
      );

      await userEvent.click(screen.getByRole('button', { name: new RegExp(name, 'i') }));

      expect(useUserStore.getState().isAuthenticated).toBe(true);
      expect(screen.getByText('dashboard page')).toBeInTheDocument();
    },
  );

  it('exposes the "Se connecter" button in the navbar and the CTA section', () => {
    renderLanding();

    expect(screen.getAllByRole('button', { name: /Se connecter/i })).toHaveLength(2);
  });

  it('renders the three feature cards', () => {
    renderLanding();

    expect(
      screen.getByRole('heading', { level: 3, name: /Donnees satellites/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Biodiversite/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: /Detection d'anomalies/i }),
    ).toBeInTheDocument();
  });

  it('exposes legal links in the footer', () => {
    renderLanding();

    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByRole('link', { name: 'Confidentialite' })).toHaveAttribute(
      'href',
      '/confidentialite',
    );
    expect(within(footer).getByRole('link', { name: 'CGU' })).toHaveAttribute('href', '/cgu');
    expect(within(footer).getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '/contact',
    );
  });
});
