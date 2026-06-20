import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the BioWatch heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Vite + React + TypeScript base is ready.',
    );
  });

  it('renders the BioWatch eyebrow label', () => {
    render(<App />);
    expect(screen.getByText('BioWatch Frontend')).toBeInTheDocument();
  });
});
