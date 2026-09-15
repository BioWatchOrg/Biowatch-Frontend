## 🔗 Linked issue

Closes #<issue-number>

## 📋 What does this PR do?

## 🧪 How to test it?

## ✅ Definition of Done

### 🤖 Review automatisée

- [ ] Label `run-review` appliqué sur le dernier commit (relancer si de nouveaux commits ont été poussés depuis)

### 🧠 Code & qualité

- [ ] Code lisible et structuré (nommage, structure)
- [ ] TypeScript strict, pas de `any` à la chaîne
- [ ] Aucun `console.log` en production, aucun warning critique lint

### 🧩 Séparation des responsabilités

- [ ] Pas de mélange UI / transport / état dans un même fichier
- [ ] Aucun appel HTTP direct dans un composant (`src/api/` ou `src/services/` uniquement)
- [ ] Code Mapbox sous `src/map/` uniquement
- [ ] État partagé via les stores Zustand par domaine, pas de duplication locale

### 🧪 Tests

- [ ] Tous les tests passent
- [ ] Coverage maintenu ou amélioré
- [ ] Vitest sur helpers/formatters/hooks/store touchés ; Playwright sur les flux critiques si pertinent

### 📉 Donnée manquante

- [ ] Si l'API ne renvoie pas un sous-indice, état "donnée manquante" affiché (pas de valeur par défaut inventée)

### ♿ Accessibilité

- [ ] Contraste suffisant, navigation clavier, ARIA sur les composants interactifs ajoutés/modifiés

### 🔐 Secrets & config

- [ ] Aucun secret dans le repo
- [ ] `.env.example` à jour, seules les variables `VITE_*` explicitement publiques sont exposées

### 📚 Documentation

- [ ] Documentation créée ou mise à jour (Notion)
- [ ] Respect du template : description (2 phrases) · structure · exemple/workflow · requirements (si utile)
