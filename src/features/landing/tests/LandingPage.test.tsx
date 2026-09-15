import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';

function renderLanding(): void {
  render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  );
}

describe('LandingPage', () => {
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

  it('points the primary CTAs to signup, demo and login', () => {
    renderLanding();

    expect(screen.getByRole('link', { name: /Commencer gratuitement/i })).toHaveAttribute(
      'href',
      '/signup',
    );
    expect(screen.getByRole('link', { name: /Voir la demo/i })).toHaveAttribute(
      'href',
      '/dashboard',
    );
    expect(screen.getByRole('link', { name: /Demarrer maintenant/i })).toHaveAttribute(
      'href',
      '/signup',
    );

    const loginLinks = screen.getAllByRole('link', { name: /Se connecter/i });
    expect(loginLinks.length).toBeGreaterThan(0);
    loginLinks.forEach((link) => expect(link).toHaveAttribute('href', '/login'));
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
