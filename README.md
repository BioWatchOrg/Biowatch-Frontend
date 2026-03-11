# BioWatch Frontend

## 🌍 À propos du projet / About the Project

**BioWatch** est une application de visualisation de données géographiques qui aide à détecter et anticiper les tensions écologiques locales grâce à la fusion de données satellites, open data et IA. Elle permet d'analyser l'état écologique d'un territoire, détecter des anomalies environnementales et identifier les zones sensibles à travers une interface cartographique interactive.

**BioWatch** is a geographical data visualization application that helps detect and anticipate local ecological tensions through the fusion of satellite data, open data, and AI. It enables analysis of a territory's ecological state, detects environmental anomalies, and identifies sensitive areas through an interactive map interface.

---

## 🛠️ Stack Technique / Tech Stack

- **Framework:** React 18+ avec Vite / React 18+ with Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Cartographie / Maps:** Mapbox GL JS
- **Visualisation de données / Data Visualization:** D3.js, Three.js (optionnel / optional)
- **Animations:** GSAP
- **HTTP Client:** Axios
- **Langage / Language:** TypeScript
- **Tests:** Vitest (unit), Playwright (e2e)
- **Qualité du code / Code Quality:** ESLint, Prettier, SonarQube

---

## 📁 Architecture du Projet / Project Architecture

```
/biowatch-frontend
  /public                           # Ressources statiques / Static assets
    /images                         # Images, logos
    /icons                          # Icônes UI / UI icons
      /map-markers                  # Marqueurs de carte personnalisés / Custom map markers
    /fonts                          # Polices personnalisées / Custom fonts
    /geojson                        # Fichiers GeoJSON statiques / Static GeoJSON files
    /data                           # Données mockées ou statiques / Mock or static data
    favicon.ico

  /src
    /@types                         # Déclarations TypeScript globales / Global TypeScript declarations
      global.d.ts
      mapbox-gl.d.ts

    /api                            # Configuration et clients API / API configuration and clients
      axiosConfig.ts
      endpoints.ts
      interceptors.ts

    /assets                         # Assets importés dynamiquement / Dynamically imported assets
      /images
      /styles

    /components                     # Composants UI réutilisables / Reusable UI components
      /common                       # Composants génériques / Generic components
        Button.tsx
        Card.tsx
        Modal.tsx
        Loader.tsx
        ErrorBoundary.tsx
        index.ts
      /forms                        # Composants de formulaire / Form components
        Input.tsx
        Select.tsx
        Checkbox.tsx
        index.ts
      /layout                       # Composants de mise en page / Layout components
        Header.tsx
        Footer.tsx
        Sidebar.tsx
        index.ts
      /charts                       # Graphiques et visualisations 2D / Charts and 2D visualizations
        BarChart.tsx
        LineChart.tsx
        PieChart.tsx
        index.ts

    /config                         # Fichiers de configuration / Configuration files
      mapbox.config.ts              # Configuration Mapbox
      app.config.ts                 # Configuration générale de l'app / General app config
      theme.config.ts               # Configuration du thème / Theme configuration

    /constants                      # Constantes statiques / Static constants
      colors.ts                     # Couleurs écologiques / Ecological colors
      mapStyles.ts                  # Styles de carte / Map styles
      layers.ts                     # Définitions des couches / Layer definitions
      api.ts                        # URLs et endpoints API / API URLs and endpoints
      ecological-thresholds.ts      # Seuils écologiques / Ecological thresholds

    /features                       # Modules fonctionnels / Feature modules
      /auth                         # Authentification / Authentication
        /components
          LoginForm.tsx
          RegisterForm.tsx
        /hooks
          useAuth.ts
        /services
          authService.ts
        /store
          authStore.ts
        index.ts

      /dashboard                    # Tableau de bord / Dashboard
        /components
          DashboardStats.tsx
          RecentAlerts.tsx
        /hooks
          useDashboardData.ts
        index.ts

      /ecological-analysis          # Analyse écologique / Ecological analysis
        /components
          EcologicalScoreCard.tsx
          TerritoryAnalysis.tsx
          AnomalyDetection.tsx
        /hooks
          useEcologicalData.ts
        /services
          analysisService.ts
        /store
          analysisStore.ts
        index.ts

      /biodiversity                 # Module biodiversité / Biodiversity module
        /components
          SpeciesList.tsx
          ProtectedZones.tsx
          BiodiversityIndicators.tsx
        /services
          biodiversityService.ts
        index.ts

    /hooks                          # Hooks React personnalisés / Custom React hooks
      useDebounce.ts
      useLocalStorage.ts
      useMediaQuery.ts
      useIntersectionObserver.ts
      index.ts

    /i18n                           # Internationalisation / Internationalization
      /locales
        /fr
          common.json
          map.json
          ecological.json
        /en
          common.json
          map.json
          ecological.json
      config.ts
      index.ts

    /layouts                        # Layouts de page / Page layouts
      /MainLayout
        MainLayout.tsx
        index.ts
      /MapLayout
        MapLayout.tsx
        index.ts
      /AuthLayout
        AuthLayout.tsx
        index.ts

    /map                            # Composants cartographiques Mapbox / Mapbox components
      /components
        Map.tsx                     # Composant carte principal / Main map component
        MapControls.tsx             # Contrôles de carte / Map controls
        ZoomControl.tsx
        LayerControl.tsx
        GeolocateControl.tsx
        index.ts
      /layers                       # Couches de carte / Map layers
        VegetationLayer.tsx
        AnomalyLayer.tsx
        BiodiversityLayer.tsx
        ProtectedZonesLayer.tsx
        HeatmapLayer.tsx
        index.ts
      /markers                      # Marqueurs et popups / Markers and popups
        CustomMarker.tsx
        AlertMarker.tsx
        EcologicalMarkerPopup.tsx
        index.ts
      /hooks
        useMapInstance.ts
        useMapLayers.ts
        useMapInteraction.ts
        useGeolocation.ts
        index.ts
      /utils
        mapHelpers.ts
        coordinateUtils.ts
        geoJsonUtils.ts
        index.ts

    /models                         # Modèles de données TypeScript / TypeScript data models
      Territory.ts
      EcologicalScore.ts
      Anomaly.ts
      BiodiversityData.ts
      SatelliteImage.ts
      User.ts
      index.ts

    /pages                          # Composants de page / Page components
      Dashboard.tsx
      MapView.tsx
      TerritoryDetails.tsx
      Analysis.tsx
      Alerts.tsx
      Reports.tsx
      Login.tsx
      Register.tsx
      NotFound.tsx
      index.ts

    /routes                         # Définitions des routes / Route definitions
      AppRoutes.tsx
      ProtectedRoute.tsx
      PublicRoute.tsx
      routes.config.ts
      index.ts

    /services                       # Services API / API services
      mapService.ts                 # Services liés à la carte / Map-related services
      satelliteService.ts           # Données satellites / Satellite data
      territoryService.ts           # Données territoriales / Territory data
      alertService.ts               # Système d'alertes / Alert system
      reportService.ts              # Génération de rapports / Report generation
      index.ts

    /store                          # Gestion d'état Zustand / Zustand state management
      mapStore.ts                   # État de la carte / Map state
      userStore.ts                  # État utilisateur / User state
      territoryStore.ts             # État territorial / Territory state
      alertStore.ts                 # État des alertes / Alert state
      filterStore.ts                # État des filtres / Filter state
      index.ts

    /styles                         # Styles globaux / Global styles
      index.css
      tailwind.css
      mapbox-overrides.css
      animations.css

    /types                          # Types TypeScript partagés / Shared TypeScript types
      api.types.ts
      map.types.ts
      ecological.types.ts
      shared.types.ts
      index.ts

    /utils                          # Fonctions utilitaires / Utility functions
      /formatters
        dateFormatter.ts
        numberFormatter.ts
        coordinateFormatter.ts
        scoreFormatter.ts
        index.ts
      /helpers
        arrayHelpers.ts
        stringHelpers.ts
        colorHelpers.ts
        index.ts
      /validators
        emailValidator.ts
        coordinateValidator.ts
        formValidators.ts
        index.ts
      /transformers
        geoDataTransformer.ts
        apiDataTransformer.ts
        index.ts

    /visualizations                 # Visualisations 3D et animations / 3D visualizations and animations
      /d3
        TerrainVisualization.tsx
        DataFlowAnimation.tsx
        index.ts
      /three
        ThreeDMap.tsx
        TerrainModel.tsx
        index.ts
      /gsap
        TransitionAnimations.ts
        ScrollAnimations.ts
        index.ts

    App.tsx                         # Composant racine / Root component
    main.tsx                        # Point d'entrée / Entry point
    vite-env.d.ts

  /__tests__                        # Tests unitaires Vitest / Vitest unit tests
    /components
    /hooks
    /utils
    /store
    setup.ts

  /e2e                              # Tests end-to-end Playwright / Playwright e2e tests
    /tests
      auth.spec.ts
      map-interaction.spec.ts
      dashboard.spec.ts
    playwright.config.ts

  .env                              # Variables d'environnement / Environment variables
  .env.example
  .env.development
  .env.production

  .eslintrc.cjs                     # Configuration ESLint
  .prettierrc                       # Configuration Prettier
  .gitignore

  tailwind.config.js                # Configuration Tailwind CSS
  tsconfig.json                     # Configuration TypeScript de base / Base TypeScript config
  tsconfig.node.json                # Configuration étendue pour les outils / Extended config for tools
  vite.config.ts                    # Configuration Vite
  vitest.config.ts                  # Configuration Vitest

  package.json
  yarn.lock / package-lock.json

  Dockerfile                        # Configuration Docker
  docker-compose.dev.yml            # Services Docker pour dev / Docker services for dev
  docker-compose.prod.yml

  README.md
  CONTRIBUTING.md
```

---

## 🎯 Améliorations Clés / Key Improvements

### 1. **Structure Cartographique Dédiée / Dedicated Map Structure**

- Dossier `/map` organisé avec composants, couches, marqueurs et hooks spécifiques à Mapbox
- Dedicated `/map` folder with Mapbox-specific components, layers, markers, and hooks

### 2. **Module de Visualisations / Visualizations Module**

- Dossier `/visualizations` séparé pour D3.js, Three.js et GSAP
- Separate `/visualizations` folder for D3.js, Three.js, and GSAP

### 3. **Architecture Feature-Based / Feature-Based Architecture**

- Modules auto-suffisants pour l'authentification, analyse écologique, biodiversité
- Self-contained modules for auth, ecological analysis, biodiversity

### 4. **Modèles de Données / Data Models**

- Dossier `/models` pour les interfaces TypeScript liées aux données écologiques
- `/models` folder for TypeScript interfaces related to ecological data

### 5. **Configuration Centralisée / Centralized Configuration**

- Dossier `/config` pour Mapbox, thèmes et configurations d'application
- `/config` folder for Mapbox, themes, and application configurations

### 6. **Assets Organisés / Organized Assets**

- Structure `/public` claire avec sous-dossiers pour marqueurs de carte, GeoJSON, etc.
- Clear `/public` structure with subfolders for map markers, GeoJSON, etc.

### 7. **Tests Structurés / Structured Testing**

- Séparation claire entre tests unitaires (`__tests__`) et e2e (`/e2e`)
- Clear separation between unit tests (`__tests__`) and e2e tests (`/e2e`)

### 8. **Services API Spécialisés / Specialized API Services**

- Services dédiés pour satellites, territoires, alertes et rapports
- Dedicated services for satellites, territories, alerts, and reports

---

## 🚀 Démarrage / Getting Started

```bash
# Installation des dépendances / Install dependencies
npm install
# ou / or
yarn install

# Lancer le serveur de développement / Start development server
npm run dev
# ou / or
yarn dev

# Lancer les tests / Run tests
npm run test
# ou / or
yarn test

# Tests e2e / e2e tests
npm run test:e2e
# ou / or
yarn test:e2e

# Build pour la production / Build for production
npm run build
# ou / or
yarn build
```

---

## 📝 Variables d'Environnement / Environment Variables

```env
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token
VITE_API_BASE_URL=your_api_url
VITE_SATELLITE_API_KEY=your_satellite_api_key
VITE_ENV=development
```

---

## 📚 Ressources / Resources

- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [D3.js Documentation](https://d3js.org/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
