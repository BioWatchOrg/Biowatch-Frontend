import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

function renderApp(initialPath: string): ReturnType<typeof userEvent.setup> {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  );

  return user;
}

describe('Auth pages', () => {
  it('renders login page with email/password fields', () => {
    renderApp('/login');

    expect(screen.getByRole('heading', { name: 'Bon retour' })).toBeInTheDocument();
    expect(screen.getByLabelText('Adresse email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
  });

  it('blocks invalid login submit and shows inline validation', async () => {
    const user = renderApp('/login');

    await user.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(screen.getByText("L'email est requis.")).toBeInTheDocument();
    expect(screen.getByText('Le mot de passe est requis.')).toBeInTheDocument();
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
