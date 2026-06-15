# BioWatch frontend — agent context

## Vision

BioWatch détecte automatiquement les zones où les activités humaines mettent en danger la biodiversité locale. La plateforme fusionne données satellites, données géospatiales, open data environnementales, données de biodiversité et indicateurs de pression humaine pour produire un **score synthétique de stress écologique par zone**, affiché dans une carte interactive.

Cibles : collectivités locales, communes, acteurs publics de l'aménagement, associations environnementales.

BioWatch ne cherche pas à produire plus de données — il **transforme des données complexes en information simple, exploitable, compréhensible** sous la forme d'un score.

Le frontend est la **surface d'usage** du produit : c'est là que la donnée déjà calculée par le backend devient lisible, navigable et actionnable pour l'utilisateur.

## Tâches dans Notion

Toutes les tâches sont trackées dans Notion, pas dans le repo. Chaque page de tâche contient les détails d'implémentation, la **Definition of Ready (DoR)** et la **Definition of Done (DoD)**.

**Avant d'implémenter une tâche**, utiliser les tools MCP du serveur `biowatch-notion` (auto-chargés via `.mcp.json`, namespace `mcp__biowatch-notion__*`) :

1. `notion_get_subpages` — index récursif des tâches, retrouver l'ID par titre.
2. `notion_get_page_content` — corps de la page (détails, DoR, DoD).

Lire la DoR/DoD depuis la page. **Ne pas inventer de critères d'acceptation.**

### Setup par membre (une fois)

Le serveur MCP est écrit en JavaScript (Node, ESM) et vit dans `.claude/notion.mjs`. Il lit `NOTION_TOKEN` depuis le `.env` à la racine (gitignored). Chaque membre doit :

1. Demander un token au propriétaire du projet **ou** créer une intégration sur https://www.notion.so/my-integrations et faire partager la racine BioWatch avec.
2. Ajouter `NOTION_TOKEN=ntn_...` (ou `secret_...`) dans son `.env` local à la racine du repo.
3. Installer les dépendances du serveur MCP : `cd .claude && npm install` (une seule fois).
4. Relancer Claude Code.

Pré-requis : **Node 20+** (la version 22 LTS est recommandée — `fetch` natif, ESM stable).

## Principes de conception

- Solutions simples, robustes, réalistes. Pas d'architecture inutilement complexe.
- Séparation claire : UI / état / appels API / logique d'affichage. Pas de logique métier côté front.
- Modularité — features auto-suffisantes, hooks réutilisables, composants découplés du transport.
- Contraintes de coût et de perf en tête, pas de dépendance non justifiée.
- Compatible avec un projet étudiant ambitieux mais limité dans le temps.

Si une proposition est fragile, surdimensionnée, ou contredit l'architecture : **le dire clairement** et proposer une alternative. Ne pas être complaisant.

## Architecture (vue d'ensemble)

- **Backend** : Python + FastAPI (API de lecture) + jobs Python sur VPS. L'API expose uniquement des résultats déjà calculés.
- **Frontend** : React + Vite + TypeScript + Mapbox. Calcul de bbox, appels API, affichage carto, interactions, animations.
- **DB** : PostgreSQL + PostGIS. Agrégations par zones **H3**. Le frontend ne parle jamais à la DB.
- **Auth** : déléguée (Cognito ou Firebase Auth). Le frontend obtient un JWT, le backend le valide.
- **Monitoring** : logs VPS via **Logdy**, KPI front via **Umami**.

**Règle forte** : le frontend ne recalcule pas, ne réimplémente pas, et ne contourne pas l'API.

## Infra VPS (rappel)

- **VPS 1** sert le frontend (build statique via Nginx), expose l'API via reverse proxy, héberge la DB.
- Le frontend peut être exposé publiquement. L'API et la DB **ne le sont pas** directement.
- Dev local : tunnel SSH pour accéder à l'API si besoin contre l'environnement distant.

**Secrets côté front** : seuls les secrets explicitement publics (`VITE_*`) sont embarqués dans le bundle. Tout secret sensible reste côté backend.

## Stack & structure logicielle

- **Node 20+** (recommandé : 22 LTS), gestionnaire **npm** (ou yarn / pnpm — décision unique à figer).
- **React 18** + **Vite** + **TypeScript** (strict).
- **Tailwind CSS** pour le styling.
- **Zustand** pour l'état global, séparé par domaine (map, user, territory, alert, filter).
- **Mapbox GL JS** pour la carto. Tout ce qui touche à la carte vit sous `src/map/`.
- **D3.js** pour les visualisations 2D, **Three.js** pour la 3D (optionnel et différé).
- **GSAP** pour les transitions / animations avancées.
- **Axios** pour les appels HTTP (clients API typés, intercepteurs centralisés).
- **Vitest** (unit) + **Playwright** (e2e).
- **ESLint** + **Prettier** + **SonarQube**.

Layout (voir README pour le détail) — règles :

- `src/components/` : composants UI réutilisables et **sans logique métier**.
- `src/features/<domain>/` : modules fonctionnels auto-suffisants (`components/`, `hooks/`, `services/`, `store/`).
- `src/map/` : tout le code Mapbox (composants, layers, markers, hooks, utils).
- `src/services/` et `src/api/` : appels HTTP, configuration Axios, endpoints.
- `src/store/` : stores Zustand par domaine.
- `src/models/` et `src/types/` : interfaces TypeScript des entités métier.
- `src/utils/` : helpers purs, formatters, validators, transformers.
- `src/visualizations/` : D3 / Three / GSAP — animations isolées, jamais dans `src/components/common/`.
- `src/pages/` et `src/routes/` : composition haut niveau, pas de logique d'appel.

**Règle forte** : pas de mélange affichage / appels API / logique métier dans un même fichier. Un composant qui fait `axios.get(...)` directement est un bug d'architecture.

## Philosophie de la donnée

Le frontend ne décide jamais quelle donnée existe : il consomme ce que l'API expose. Si une donnée manque ou n'est pas calculée, c'est une discussion **backend / scoring**, pas un contournement front. Toute proposition de "récupérer telle source directement depuis le navigateur" est **refusée** par défaut.

## Modèle de données & vocabulaire métier (référence)

Pour comprendre les réponses de l'API, garder en tête le modèle backend :

| Table | Rôle | À quoi ça sert côté front |
| --- | --- | --- |
| `zones_hex` | Référence géo (H3) | identifiant spatial, géométrie GeoJSON pour Mapbox |
| `satellite_features_by_zone` | NDVI/NDWI/NDBI/SWIR par période | couches thématiques |
| `osm_features_by_zone` | Pression humaine | couches pression / urbanisation |
| `protected_areas_by_zone` | Aires protégées | layer dédié, filtres |
| `species_features_by_zone` | Biodiversité | indicateurs, popups |
| `stress_score_by_zone` | **Score écologique** | rendu principal de la carte |
| `job_runs` | Traçabilité d'exécution | UI admin / état des données |

`zone_id` = cellule H3. `bucket_id` / `period` = clé temporelle. Le frontend respecte ces noms tels quels dans les types et services.

## Score écologique (référence)

Cœur du produit. C'est le **rendu principal** de la carte. Sous-indices possibles : pression humaine, état de la végétation, biodiversité sensible, dynamique temporelle, protection environnementale.

Le score est **contextualisé** (métropole dense vs zone agricole vs forestière) : ne pas afficher un score "brut" comme s'il était comparable d'une zone à l'autre sans le contexte. La UI doit rendre lisible la **catégorie de territoire** + le score normalisé, pas un nombre désincarné.

**Règle forte** : si l'API ne renvoie pas un sous-indice, ne pas l'inventer dans la UI. Afficher un état "donnée manquante" plutôt qu'une valeur par défaut trompeuse.

## Exigences de qualité

**Code** : TypeScript strict, lisible, typé sur toute la logique métier et les réponses API. Pas de `any` à la chaîne. Pas de mélange UI / transport / store.

**Tests** :
- Vitest pour les helpers, formatters, transformers, hooks isolés, et la logique des stores.
- Playwright pour les flux critiques (auth, navigation carto, sélection de zone).
- Coverage maintenu ou amélioré.

**Logs** :
- Pas de `console.log` en production. Utiliser un logger (ou un wrapper conditionné par `import.meta.env.MODE`).
- Erreurs réseau / runtime remontées à un système d'observabilité (Sentry envisageable) — pas avalées silencieusement.

**Secrets** :
- Aucun secret dans le dépôt.
- `.env.example` à jour. Variables exposées côté client : préfixe `VITE_` uniquement. Tout ce qui est sensible reste backend.

**Accessibilité** :
- Contraste suffisant, navigation clavier, ARIA sur les composants interactifs.
- La carte ne doit pas être la seule façon d'accéder aux données — prévoir des listes / tableaux pour les lecteurs d'écran quand pertinent.

**Performance** :
- Bundle size surveillé (`vite build --report` ou équivalent).
- Lazy loading des routes lourdes et des visualisations 3D.
- Pas d'animations bloquantes sur le main thread.

**Documentation** : toute feature met à jour la doc existante ou en ajoute une (description courte, composants/hooks exposés, exemple).

## Rôle de l'API (contrat consommé par le frontend)

L'API expose uniquement des données **déjà calculées**. Le frontend en consomme :

- géométries et features par zone (GeoJSON, filtrées par bbox / date / résolution),
- scores et sous-indices (`stress_score_by_zone`),
- métadonnées utilisateur,
- état des jobs (pour information).

**Interdits côté front** :
- relancer un pipeline,
- recalculer un score,
- contourner l'API pour parler à la DB ou aux sources externes,
- dupliquer la logique de scoring.

Si une route manque ou est mal modélisée pour un besoin UI : **demander l'ajout côté backend**, pas bricoler côté front.

Routes protégées via le provider d'auth, JWT validé côté backend. Côté front, on stocke le token de façon sûre (httpOnly cookie si possible, sinon mémoire — pas localStorage en clair pour un usage prolongé) et on l'attache via un intercepteur Axios.

## Rôle du frontend

Rendre l'analyse écologique **lisible et exploitable**.

**Doit faire** :
- Auth (login, refresh, logout).
- Carte interactive Mapbox : layers thématiques (végétation, anomalies, biodiversité, zones protégées, heatmap), markers, popups.
- Sélection de zones, navigation temporelle (bucket / période).
- Vues détaillées par territoire (score, sous-indices, séries temporelles).
- Filtres, recherche, comparaison entre zones.
- Calcul de bbox côté client pour requêter l'API efficacement.
- Transformations d'affichage légères (formatage, regroupements purement visuels).
- Internationalisation fr / en (`src/i18n/`).
- Adaptation mobile / responsive en bonus.

**Ne doit pas faire** :
- Recalculer un score, rejouer un pipeline, réimplémenter la logique métier.
- Stocker de la donnée métier en local au-delà du strict nécessaire (cache UI ≠ source de vérité).
- Coupler l'UI au transport (un composant ne fait jamais d'appel HTTP direct).

**Animations, 3D, visualisations avancées** ne doivent **jamais** dégrader lisibilité, performances, maintenabilité ou accessibilité. Si une animation casse la fluidité d'interaction avec la carte, elle saute.

## Place de l'IA

L'IA est une couche d'**amélioration progressive** côté backend, pas une dépendance du frontend. Côté front, on consomme les résultats (scores enrichis, prédictions, classifications) **exactement comme on consomme les autres données** : via l'API, déjà calculées. Aucune inférence ML dans le navigateur dans l'architecture actuelle.

## Organisation & workflow git

Organisation horizontale : responsabilités partagées, montée en compétence collective, décisions collégiales, relecture croisée, documentation obligatoire pour la reprise. Éviter les solutions qui dépendent d'un expert unique ou les architectures incompréhensibles pour une équipe étudiante.

**Workflow**
- Sprint de 2 semaines. Réunion sprint chaque lundi (QA avant la réunion). Travail async le reste du temps.
- Une branche par tâche. Convention : `ticketNumber_Type_short-description` (ex. `42_Feature_user-login`, `17_Fix_broken-navbar`).
- Branches : `main` (prod, PR depuis `development` uniquement), `development` (intégration), feature/fix (travail quotidien).
- Merge uniquement via PR, **≥ 2 reviews**. PR vers `development`, puis `main` après QA.
- Commits au format `<type>: description`. Types autorisés : `feat`, `fix`, `style`, `refactor`, `docs`, `chore`.

## Comment raisonner avant de proposer

Avant tout code ou architecture, identifier explicitement :
- phase du projet,
- module concerné (`src/features/*`, `src/map/*`, `src/components/*`, etc.),
- entrées (props / store / API) / sorties (rendu / événements) attendues,
- dépendances existantes (stores, hooks, services API déjà en place),
- impacts sur l'architecture (nouveau store ? nouveau service API ? nouveau type partagé ?).

Toute solution doit être cohérente **simultanément** avec : stack retenue (React/Vite/TS/Mapbox/Zustand) • séparation UI / état / API • contrat de l'API backend • phase actuelle • capacité d'implémentation de l'équipe.

Si une demande est floue : raisonner dans l'archi BioWatch existante, ne pas inventer une nouvelle organisation. Si une solution est théoriquement bonne mais trop complexe, coûteuse, fragile ou éloignée du cadre : la refuser et proposer une alternative réaliste.

**Style de réponse attendu** : direct, clair, exigeant techniquement. Dire explicitement quand une idée est mauvaise ou incohérente. Pas de complexité gratuite, pas de logique métier déplacée vers le front, pas de dépendance ajoutée "au cas où". Quand pertinent, structurer en : objectif • proposition • avantages • limites • recommandation.
