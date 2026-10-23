import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { useUserStore } from '../store/userStore';

function renderApp(initialPath: string): void {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App smoke', () => {
  beforeEach(() => useUserStore.setState({ isAuthenticated: false }));

  it('renders the landing page from the root route', () => {
    renderApp('/');

    expect(
      screen.getByRole('heading', { level: 1, name: /Surveillez vos ecosystemes/i }),
    ).toBeInTheDocument();
  });

  it('redirects the dashboard route to the landing page when signed out', () => {
    renderApp('/dashboard');

    expect(screen.getByRole('heading', { level: 1, name: /Surveillez vos/i })).toBeInTheDocument();
  });

  it('renders the dashboard route when signed in', () => {
    useUserStore.setState({ isAuthenticated: true });
    renderApp('/dashboard');

    expect(screen.getByRole('heading', { level: 1, name: /Tableau de bord/i })).toBeInTheDocument();
  });

  it('redirects unknown routes to the landing page', () => {
    renderApp('/route-inconnue');

    expect(screen.getByRole('heading', { level: 1, name: /Surveillez vos/i })).toBeInTheDocument();
  });

  it('renders a legal placeholder page from a legal route', () => {
    renderApp('/confidentialite');

    expect(screen.getByRole('heading', { level: 1, name: 'Confidentialite' })).toBeInTheDocument();
  });
});
