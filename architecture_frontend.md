# Simple Architecture

## Core App Layer

- App
- Router
- Layouts: Main, Auth, Map
- Global providers: i18n, error boundary, query/store providers

### Dependency

App → Router → Layouts → Feature Pages

## Shared Foundation Layer

- UI components: Button, Card, Modal, Input, Select, Loader
- Shared hooks: debounce, local storage, media query
- Utilities: formatters, validators, transformers
- Global constants/config: theme, app config, map config, API config

### Dependency

All feature modules depend on this layer.

## API Communication Layer

- Axios client
- Auth interceptor for attaching the token
- Refresh interceptor for token renewal
- Error interceptor for mapping backend error codes to UI-friendly errors
- Endpoint modules:
  - auth API
  - user API
  - geo API
  - analysis API
  - dashboard API
  - prediction API
  - export API
  - notification API

### Dependency

Feature services → API client/interceptors → Backend endpoints

## State Layer (Zustand)

- auth store: user, token, session status
- permission store: feature flags, quotas, role
- map store: center, zoom, active layers, selected zones
- analysis store: running jobs, results, filters
- dashboard store: KPIs, activity, critical zones
- alert/notification store
- UI store: sidebar state, toasts, loading states

### Dependency

- Pages and smart components read from and write to stores
- Stores call services
- Services call the API layer

## Feature Modules (Simple V1)

### Auth Module

- Login page
- Register page
- Forgot/reset password
- useAuth hook
- ProtectedRoute and PublicRoute

Depends on:

- auth store
- auth service
- user service
- permission bootstrap

### Permissions Module

- FeatureGate component
- usePermissions hook
- QuotaBadge component for free and premium limits

Depends on:

- permission store
- auth store
- auth/permissions endpoint

### Map Module

- Map container
- Layer controls
- Geosearch
- Zone selection tools
- Marker/popup components
- Premium lock overlays for restricted layers

Depends on:

- map store
- geo service
- permission gate
- dashboard summary service

### Analysis Module

- Analysis builder form
- Results charts
- Compare zones panel
- Export buttons for premium users only

Depends on:

- analysis store
- analysis service
- export service
- permission gate

### Dashboard Module

- KPI cards
- Critical zones list
- Activity feed
- Mini map summary
- Optional AI projection widgets for premium users

Depends on:

- dashboard service
- prediction service
- notification service
- permission gate

### Notifications Module

- Alerts center
- Read/unread state
- Preferences panel

Depends on:

- notification store
- notification service
- permission gate for push features

## Simple Dependency Graph

Backend API → API client and interceptors → Feature services → Zustand stores → Hooks and feature containers → Presentational components → Pages and layouts → Router and app shell

### Cross-Cutting Concern

Auth and permissions affect Map, Analysis, Dashboard, Export, and Notifications.

## Minimum Component Set To Build First

Aligned with Phase 1A MVP:

- App shell + router + layouts
- Axios client + auth refresh interceptor
- Auth pages + auth store
- Permission bootstrap from auth/permissions endpoint
- ProtectedRoute + FeatureGate
- Map page with:
  - base map
  - 2 to 3 layers
  - one premium-gated layer
  - geosearch
- Basic dashboard page with:
  - KPI cards
  - critical zones list, top 10 for free users
- Basic analysis flow with:
  - create analysis
  - list analyses
  - view analysis results
- Error handling and loading UI states
- Initial unit tests for auth, permissions, and route protection

## How Components Depend on Each Other

- LoginForm depends on auth service and auth store.
- ProtectedRoute depends on auth store and permission store.
- FeatureGate depends on permission store and subscription plan data.
- MapView depends on map store, geo service, and FeatureGate.
- AnalysisPage depends on analysis store, analysis service, and export service.
- ExportButton depends on FeatureGate and export endpoint status polling.
- Dashboard widgets depend on dashboard service and shared chart components.
- Alerts panel depends on notification service and auth state.
