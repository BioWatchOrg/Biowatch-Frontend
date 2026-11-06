import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RequireAuth from '../routes/RequireAuth';
import { useUserStore } from '../store/userStore';

function renderGuarded(): void {
  render(
    <MemoryRouter initialEntries={['/private']}>
      <Routes>
        <Route path="/" element={<p>landing page</p>} />
        <Route
          path="/private"
          element={
            <RequireAuth>
              <p>private page</p>
            </RequireAuth>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RequireAuth', () => {
  it('redirects to the landing page when signed out', () => {
    useUserStore.setState({ isAuthenticated: false });
    renderGuarded();

    expect(screen.getByText('landing page')).toBeInTheDocument();
    expect(screen.queryByText('private page')).not.toBeInTheDocument();
  });

  it('renders its children when signed in', () => {
    useUserStore.setState({ isAuthenticated: true });
    renderGuarded();

    expect(screen.getByText('private page')).toBeInTheDocument();
  });
});
