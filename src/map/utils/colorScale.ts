/**
 * Échelle de couleur du score de stress écologique, du plus faible au plus fort.
 *
 * La légende et la couche MapLibre lisent les mêmes paliers : une seule source de vérité,
 * donc pas de dérive entre ce que la carte affiche et ce que la légende annonce.
 */
export interface ScoreStop {
  /** Score à partir duquel la couleur s'applique. */
  readonly from: number;
  readonly color: string;
  readonly label: string;
}

export const SCORE_STOPS: readonly ScoreStop[] = [
  { from: 0, color: '#2aaa8a', label: 'Faible' },
  { from: 40, color: '#9ccb5a', label: 'Modere' },
  { from: 60, color: '#f5a42a', label: 'Vigilance' },
  { from: 80, color: '#d4542f', label: 'Eleve' },
];

/** Couleur d'une zone dont le score est connu. Utilisée par la légende et les tests. */
export const colorForScore = (score: number): string => {
  let match = SCORE_STOPS[0];
  for (const stop of SCORE_STOPS) {
    if (score >= stop.from) {
      match = stop;
    }
  }
  return match.color;
};

/**
 * Même échelle, exprimée pour MapLibre : `step` reprend exactement les paliers ci-dessus.
 * Forme produite : ['step', ['get', 'score_global'], c0, s1, c1, s2, c2, …]
 */
export const scoreColorExpression = (): unknown[] => {
  const [first, ...rest] = SCORE_STOPS;
  return [
    'step',
    ['get', 'score_global'],
    first.color,
    ...rest.flatMap((stop) => [stop.from, stop.color]),
  ];
};
