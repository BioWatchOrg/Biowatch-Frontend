import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

function renderApp(initialPath: string): void {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App smoke', () => {
  it('renders the landing page from the root route', () => {
    renderApp('/');

    expect(
      screen.getByRole('heading', { level: 1, name: /Surveillez vos ecosystemes/i }),
    ).toBeInTheDocument();
  });

  it('renders the login page from the login route', () => {
    renderApp('/login');

    expect(screen.getByRole('heading', { name: 'Bon retour' })).toBeInTheDocument();
  });

  it('renders a legal placeholder page from a legal route', () => {
    renderApp('/confidentialite');

    expect(screen.getByRole('heading', { level: 1, name: 'Confidentialite' })).toBeInTheDocument();
  });
});
