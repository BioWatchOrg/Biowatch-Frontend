import { SCORE_STOPS } from '../utils/colorScale';

/**
 * Légende de l'échelle de score. Elle rend la carte lisible sans interprétation des couleurs,
 * et donne une lecture textuelle des paliers aux lecteurs d'écran.
 */
function ScoreLegend() {
  return (
    <section className="map-legend" aria-label="Echelle du score de stress ecologique">
      <h2 className="map-legend-title">Score de stress</h2>
      <ul className="map-legend-items">
        {SCORE_STOPS.map((stop, index) => {
          const next = SCORE_STOPS[index + 1];
          const range = next ? `${stop.from} a ${next.from}` : `${stop.from} et plus`;
          return (
            <li key={stop.from} className="map-legend-item">
              <span
                className="map-legend-swatch"
                style={{ backgroundColor: stop.color }}
                aria-hidden="true"
              />
              <span>
                {stop.label} <span className="map-legend-range">({range})</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default ScoreLegend;
