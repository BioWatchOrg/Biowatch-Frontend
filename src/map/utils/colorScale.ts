/**
 * Échelle de couleur du score de stress écologique, du plus faible au plus fort.
 *
 * La légende et la couche MapLibre lisent les mêmes paliers : une seule source de vérité,
 * donc pas de dérive entre ce que la carte affiche et ce que la légende annonce.
 *
 * Les couleurs elles-mêmes vivent dans `src/index.css` (variables `--score-*`, ADR-003) :
 * ce fichier ne connaît que le nom des variables, jamais une valeur.
 */
export interface ScoreStop {
  /** Score à partir duquel la couleur s'applique. */
  readonly from: number;
  /** Variable CSS qui porte la couleur du palier. */
  readonly token: string;
  readonly label: string;
}

export const SCORE_STOPS: readonly ScoreStop[] = [
  { from: 0, token: '--score-low', label: 'Faible' },
  { from: 40, token: '--score-moderate', label: 'Modéré' },
  { from: 60, token: '--score-vigilance', label: 'Vigilance' },
  { from: 80, token: '--score-high', label: 'Élevé' },
];

/** Contour des cellules : la couleur de texte de l'application. */
export const ZONE_OUTLINE_TOKEN = '--color-navy';

/** Palier atteint par un score connu. */
export const stopForScore = (score: number): ScoreStop => {
  let match = SCORE_STOPS[0];
  for (const stop of SCORE_STOPS) {
    if (score >= stop.from) {
      match = stop;
    }
  }
  return match;
};

/** Pour le DOM : une couleur CSS qui suit la variable, sans la recopier. */
export const tokenColor = (token: string): string => `var(${token})`;

export type TokenResolver = (token: string) => string;

/**
 * MapLibre peint en WebGL et ne comprend pas `var(...)` : on lit la valeur calculée.
 * Une variable absente veut dire que `index.css` n'est pas chargé — on échoue tout de suite
 * plutôt que de peindre la carte dans une couleur inventée.
 */
export const resolveCssToken: TokenResolver = (token) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  if (!value) {
    throw new Error(`Variable CSS ${token} introuvable : src/index.css est-il charge ?`);
  }
  return value;
};

/**
 * Même échelle, exprimée pour MapLibre : `step` reprend exactement les paliers ci-dessus.
 * Forme produite : ['step', ['get', 'score_global'], c0, s1, c1, s2, c2, …]
 */
export const scoreColorExpression = (resolve: TokenResolver = resolveCssToken): unknown[] => {
  const [first, ...rest] = SCORE_STOPS;
  return [
    'step',
    ['get', 'score_global'],
    resolve(first.token),
    ...rest.flatMap((stop) => [stop.from, resolve(stop.token)]),
  ];
};
