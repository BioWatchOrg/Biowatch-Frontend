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
});
