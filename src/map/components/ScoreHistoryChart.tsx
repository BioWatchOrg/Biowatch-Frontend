import type { ZoneHistoryPoint } from '../../api/types';

interface ScoreHistoryChartProps {
  history: ZoneHistoryPoint[];
}

const WIDTH = 280;
const HEIGHT = 120;
const PAD = 8;

/** Courbe de `score_global` dans le temps (échelle fixe 0–100). Les buckets sans score sont ignorés. */
function ScoreHistoryChart({ history }: ScoreHistoryChartProps) {
  const points = history.filter(
    (p): p is ZoneHistoryPoint & { score_global: number } => p.score_global !== null,
  );

  if (points.length < 2) {
    return <p className="zone-panel-missing">Historique indisponible.</p>;
  }

  const x = (i: number) => PAD + (i * (WIDTH - 2 * PAD)) / (points.length - 1);
  const y = (score: number) => HEIGHT - PAD - (score / 100) * (HEIGHT - 2 * PAD);
  const line = points.map((p, i) => `${x(i)},${y(p.score_global)}`).join(' ');
  const first = points[0].bucket_id;
  const last = points[points.length - 1].bucket_id;

  return (
    <figure className="zone-panel-chart">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`Évolution du score global de ${first} à ${last}`}
      >
        <polyline className="zone-panel-line" fill="none" points={line} />
        {points.map((p, i) => (
          <circle
            key={p.bucket_id}
            className="zone-panel-dot"
            cx={x(i)}
            cy={y(p.score_global)}
            r="2.5"
          >
            <title>{`${p.bucket_id} : ${p.score_global}`}</title>
          </circle>
        ))}
      </svg>
      <figcaption>
        {first} → {last}
      </figcaption>
    </figure>
  );
}

export default ScoreHistoryChart;
