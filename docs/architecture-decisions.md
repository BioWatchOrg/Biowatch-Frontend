# Décisions d'architecture

Historique des choix d'architecture non triviaux, avec leur raisonnement. Objectif : éviter
de rouvrir un débat déjà tranché sans repartir des mêmes arguments. Une décision reste valable
tant que son contexte ne change pas — voir la section "Remise en cause" de chaque entrée.

Copie miroir du fichier maintenu dans `Biowatch-BackEnd/docs/architecture-decisions.md` (source
de vérité, car ces décisions touchent l'architecture globale, pas seulement le frontend). En cas
de divergence entre les deux copies, celle du backend fait foi — mettre celle-ci à jour en
conséquence.

---

## ADR-001 — Frontend → Firestore en direct pour les données utilisateur non sensibles

**Statut** : actif

**Contexte**

Une partie des besoins produit ne concerne pas la donnée géospatiale calculée (PostGIS) mais
des données propres à chaque utilisateur : préférences d'affichage, layout de dashboard, feed
d'activité, quotas d'abonnement. L'API backend est dédiée à la lecture de PostGIS — la question
était de savoir si ces données utilisateur devaient transiter par le backend (frontend → back →
Firestore) ou si le frontend pouvait écrire/lire Firestore directement via le SDK client
(frontend → Firestore).

**Décision**

Le frontend accède à Firestore directement pour toute donnée dont la falsification par
l'utilisateur n'a aucune conséquence (préférences, layout). Le contrôle d'accès est fait par
`firestore.rules`, pas par du code backend. L'API ne sert jamais de proxy vers Firestore.

Les opérations qui nécessitent une garantie de confiance (attribution de rôle, décompte de
quota) ne passent ni par le frontend en direct, ni par l'API backend : elles sont isolées dans
des Cloud Functions dédiées (Admin SDK, qui contourne `firestore.rules`). Voir la doc Notion
[Accès Firebase direct (frontend) & rôles via Firestore Rules](https://app.notion.com/p/3e450bea018d80d38d1bf719d5d2c0ac)
et la page WBS [🌐 cloud function (gcp)](https://app.notion.com/p/3e450bea018d80369f1fd889a2b3038c)
pour le détail des tickets.

**Pourquoi**

- `firestore.rules` fait déjà, de façon déclarative, exactement ce qu'un endpoint backend ferait
  pour ce type de contrôle (vérifier l'identité/le rôle avant lecture/écriture). Ajouter le
  backend entre les deux ne rajoute aucune sécurité, juste une deuxième source de vérité à
  maintenir en synchronisation avec les rules.
- Firestore apporte du temps réel natif (listeners `onSnapshot`) gratuitement — recoder cette
  synchronisation côté backend (polling ou SSE fait main) serait une réimplémentation pure perte
  de temps pour un projet à capacité d'équipe limitée.
- Cohérent avec la séparation déjà actée dans `CLAUDE.md` : PostGIS pour la donnée géospatiale
  calculée par les jobs, Firebase pour la donnée client.

**Limite de la règle**

`firestore.rules` ne sait exprimer que des contrôles déclaratifs (identité, rôle, égalité de
champ). Dès qu'une opération a un état ou un effet de bord non trivial — décrément atomique
d'un compteur, vérification de signature d'un webhook externe — elle sort du domaine des rules
et doit passer par une Cloud Function avec l'Admin SDK, jamais par une écriture client directe.

**Remise en cause**

À revoir si un jour une donnée utilisateur a besoin d'être croisée avec une donnée PostGIS dans
une même réponse (aujourd'hui, aucun cas identifié) — dans ce cas, une agrégation côté backend
redeviendrait justifiée pour cette donnée précise.

---

## ADR-002 — Auth et données utilisateur : Firebase managé plutôt qu'auto-hébergé

**Statut** : actif

**Contexte**

L'authentification (login, register, reset de mot de passe, refresh de token) et le stockage
des données propres à chaque utilisateur pouvaient soit être auto-hébergés (table `users` dans
le PostgreSQL existant, JWT fait maison), soit délégués à un service managé (Firebase Auth +
Firestore).

**Décision**

Auth et données custom utilisateur sont déléguées à Firebase. Le backend ne gère aucune logique
d'authentification.

**Note pour le frontend** : `CLAUDE.md` (section Architecture) indique actuellement "le frontend
obtient un JWT, le backend le valide" — ce n'est plus exact en l'état du backlog actuel. Aucun
ticket backend ne valide de token Firebase pour l'instant (le ticket de middleware d'auth a été
retiré, faute d'endpoint qui en ait besoin aujourd'hui). Cette phrase de `CLAUDE.md` est à
corriger ou à confirmer avec l'équipe avant de s'appuyer dessus.

**Pourquoi**

- Rolling your own auth (hash de mot de passe, gestion de session, reset de mot de passe,
  protection brute-force, refresh de token) est une des zones à plus haut risque de sécurité qui
  existent (OWASP Top 10). Une équipe étudiante à capacité limitée qui code ça elle-même prend un
  risque réel pour une fonctionnalité qui n'est pas le cœur du produit (le score écologique, pas
  l'auth).
- Coût quasi nul au stade POC/MVP (palier gratuit Firebase), contre un coût de développement et
  de maintenance certain en auto-hébergé.
- Cohérent avec le principe d'organisation horizontale du projet (pas de dépendance à un expert
  unique) : Firebase Auth est standard et documenté, un système maison devient vite la
  spécialité d'une seule personne de l'équipe.

**Limites assumées**

- **Vendor lock-in** : migrer hors de Firebase plus tard impliquerait une vraie migration de
  données utilisateur, pas un simple changement de configuration.
- **Résidence des données / RGPD** : à vérifier explicitement avant toute mise en production
  réelle — Firestore permet de choisir une région de stockage européenne, mais certaines
  métadonnées Firebase Auth sont stockées par défaut aux États-Unis. Point de conformité
  pertinent si BioWatch vise des collectivités publiques.
- Complexité de fait à gérer deux bases de données dans le projet (PostGIS + Firestore), chacune
  avec son propre modèle mental pour l'équipe.

**Remise en cause**

À réévaluer si le projet dépasse le stade POC/MVP pour viser une mise en production commerciale
avec des exigences de conformité RGPD strictes — pas avant.
