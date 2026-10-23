import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import MapStatus from '../components/MapStatus';
import ScoreLegend from '../components/ScoreLegend';
import { SCORE_STOPS } from '../utils/colorScale';

describe('MapStatus', () => {
  it('annonce le chargement aux lecteurs d ecran', () => {
    render(<MapStatus status="loading" error={null} onRetry={() => {}} />);
    expect(screen.getByRole('status')).toHaveTextContent('Chargement des zones');
  });

  it('affiche l erreur et declenche une nouvelle tentative', async () => {
    const onRetry = vi.fn();
    render(<MapStatus status="error" error="Zones indisponibles." onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Zones indisponibles.');
    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('n affiche rien quand les zones sont chargees', () => {
    const { container } = render(<MapStatus status="ready" error={null} onRetry={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('ScoreLegend', () => {
  it('donne une lecture textuelle de chaque palier', () => {
    render(<ScoreLegend />);

    const legend = screen.getByRole('region', {
      name: 'Échelle du score de stress écologique',
    });
    expect(legend).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(SCORE_STOPS.length);
    expect(screen.getByText(/Faible/)).toBeInTheDocument();
    expect(screen.getByText(/\(80 et plus\)/)).toBeInTheDocument();
    expect(screen.getByText(/\(40 à 60\)/)).toBeInTheDocument();
    expect(screen.getByText(/Élevé/)).toBeInTheDocument();
  });
});
