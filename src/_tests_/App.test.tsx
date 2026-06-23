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
  it('renders login page from root route', () => {
    renderApp('/');

    expect(screen.getByRole('heading', { name: 'Bon retour' })).toBeInTheDocument();
  });

  it('navigates to dashboard on valid login submit', async () => {
    const user = renderApp('/login');

    await user.type(screen.getByLabelText('Adresse email'), 'user@example.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Se connecter' }));

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Tableau de bord de demonstration' }),
      ).toBeInTheDocument();
    });
  });

  it('renders signup and forgot password routes', () => {
    renderApp('/signup');
    expect(screen.getByRole('heading', { name: 'Creer votre compte' })).toBeInTheDocument();

    renderApp('/forgot-password');
    expect(screen.getByRole('heading', { name: "Recuperer l'acces" })).toBeInTheDocument();
  });
});
