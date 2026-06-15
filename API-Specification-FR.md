# Spécification API BioWatch - Frontend

**Version**: 1.0  
**Date**: 2 avril 2026  
**Auteur**: Équipe Frontend BioWatch

---

## Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Authentification & Autorisation](#1-authentification--autorisation)
3. [Gestion Utilisateur](#2-gestion-utilisateur)
4. [Données Géospatiales](#3-données-géospatiales)
5. [Analyses & Indicateurs](#4-analyses--indicateurs)
6. [Dashboard & KPIs](#5-dashboard--kpis)
7. [Projections IA (Premium)](#6-projections-ia-premium)
8. [Export de Données](#7-export-de-données)
9. [Notifications & Alertes](#8-notifications--alertes)
10. [Codes d'Erreur](#codes-derreur)

---

## Vue d'ensemble

### Base URL

```
Production: https://api.biowatch.fr/v1
Développement: https://api-dev.biowatch.fr/v1
```

### Format des Réponses

Toutes les réponses sont au format JSON avec UTF-8 encoding.

### Authentification

La plupart des endpoints nécessitent un token JWT dans le header:

```
Authorization: Bearer {token}
```

### Niveaux d'Accès

- **Gratuit**: Accès limité aux fonctionnalités de base
- **Premium**: Accès complet aux analyses, projections IA, exports
- **Admin**: Gestion des utilisateurs et configuration système

---

## 1. Authentification & Autorisation

### 1.1 Inscription

**POST** `/auth/register`

Crée un nouveau compte utilisateur.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "Jean",
  "lastName": "Dupont",
  "language": "fr"
}
```

**Response:** `201 Created`

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "free",
    "createdAt": "2026-04-02T10:00:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

---

### 1.2 Connexion

**POST** `/auth/login`

Authentifie un utilisateur existant.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "premium",
    "subscription": {
      "plan": "premium",
      "status": "active",
      "expiresAt": "2027-04-02T10:00:00Z"
    }
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

---

### 1.3 Rafraîchir le Token

**POST** `/auth/refresh`

Obtient un nouveau access token avec le refresh token.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:** `200 OK`

```json
{
  "accessToken": "eyJhbGc...",
  "expiresIn": 3600
}
```

---

### 1.4 Déconnexion

**POST** `/auth/logout`

Invalide les tokens de l'utilisateur.

**Headers:** `Authorization: Bearer {token}`

**Response:** `204 No Content`

---

### 1.5 Demande de Réinitialisation de Mot de Passe

**POST** `/auth/forgot-password`

Envoie un email avec un lien de réinitialisation.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`

```json
{
  "message": "Email de réinitialisation envoyé"
}
```

---

### 1.6 Réinitialisation de Mot de Passe

**POST** `/auth/reset-password`

Réinitialise le mot de passe avec le token reçu par email.

**Request Body:**

```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass123!"
}
```

**Response:** `200 OK`

```json
{
  "message": "Mot de passe réinitialisé avec succès"
}
```

---

### 1.7 Vérifier les Permissions

**GET** `/auth/permissions`

Retourne les permissions de l'utilisateur connecté.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

```json
{
  "userId": "uuid",
  "role": "premium",
  "permissions": {
    "features": {
      "advancedLayers": true,
      "aiProjections": true,
      "unlimitedAnalyses": true,
      "dataExport": true,
      "pushNotifications": true,
      "fullHistoricalData": true,
      "multiZoneComparison": true
    },
    "quotas": {
      "analysesPerMonth": -1,
      "savedZones": -1,
      "historicalMonths": -1
    }
  }
}
```

---

## 2. Gestion Utilisateur

### 2.1 Obtenir le Profil

**GET** `/users/me`

Retourne le profil de l'utilisateur connecté.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "Jean",
  "lastName": "Dupont",
  "role": "premium",
  "language": "fr",
  "preferences": {
    "theme": "dark",
    "mapDefaultZoom": 10,
    "mapDefaultCenter": [2.3522, 48.8566],
    "defaultLayers": ["ndvi", "protected-areas"]
  },
  "subscription": {
    "plan": "premium",
    "status": "active",
    "startDate": "2026-04-02T10:00:00Z",
    "expiresAt": "2027-04-02T10:00:00Z"
  },
  "usage": {
    "analysesThisMonth": 15,
    "savedZones": 8,
    "lastLogin": "2026-04-02T10:00:00Z"
  }
}
```

---

### 2.2 Mettre à Jour le Profil

**PATCH** `/users/me`

Met à jour le profil utilisateur.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "firstName": "Jean",
  "lastName": "Martin",
  "language": "en"
}
```

**Response:** `200 OK`

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "Jean",
  "lastName": "Martin",
  "language": "en"
}
```

---

### 2.3 Mettre à Jour les Préférences

**PATCH** `/users/me/preferences`

Met à jour les préférences utilisateur.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "theme": "light",
  "mapDefaultZoom": 12,
  "mapDefaultCenter": [2.3522, 48.8566],
  "defaultLayers": ["ndvi", "osm-roads", "species"]
}
```

**Response:** `200 OK`

```json
{
  "preferences": {
    "theme": "light",
    "mapDefaultZoom": 12,
    "mapDefaultCenter": [2.3522, 48.8566],
    "defaultLayers": ["ndvi", "osm-roads", "species"]
  }
}
```

---

### 2.4 Obtenir les Statistiques d'Utilisation

**GET** `/users/me/usage`

Retourne les statistiques d'utilisation pour l'utilisateur.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

```json
{
  "currentPeriod": {
    "startDate": "2026-04-01T00:00:00Z",
    "endDate": "2026-04-30T23:59:59Z",
    "analysesUsed": 15,
    "analysesLimit": -1,
    "analysesRemaining": "unlimited"
  },
  "savedZones": {
    "count": 8,
    "limit": -1
  },
  "history": {
    "totalAnalyses": 142,
    "totalSavedZones": 23,
    "memberSince": "2025-09-01T00:00:00Z"
  }
}
```

---

### 2.5 Gestion de l'Abonnement

**GET** `/users/me/subscription`

Obtient les détails de l'abonnement.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

```json
{
  "plan": "premium",
  "status": "active",
  "startDate": "2026-04-02T10:00:00Z",
  "expiresAt": "2027-04-02T10:00:00Z",
  "autoRenew": true,
  "paymentMethod": {
    "type": "card",
    "last4": "4242",
    "expiryMonth": 12,
    "expiryYear": 2028
  },
  "billing": {
    "amount": 19.99,
    "currency": "EUR",
    "interval": "monthly",
    "nextBillingDate": "2026-05-02T10:00:00Z"
  }
}
```

---

## 3. Données Géospatiales

### 3.1 Obtenir les Zones H3 par BBox

**GET** `/geo/zones`

Retourne les zones hexagonales H3 dans une zone géographique (bounding box).

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `bbox` (required): `minLng,minLat,maxLng,maxLat` (ex: `2.2,48.8,2.5,48.9`)
- `resolution` (optional): Résolution H3 (défaut: 8)
- `includeScores` (optional): Inclure les scores de stress (défaut: false)
- `period` (optional): Période temporelle (format: `YYYY-MM`, défaut: période la plus récente)

**Response:** `200 OK`

```json
{
  "type": "FeatureCollection",
  "metadata": {
    "bbox": [2.2, 48.8, 2.5, 48.9],
    "resolution": 8,
    "period": "2026-04",
    "zoneCount": 1247
  },
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[2.234, 48.856], [2.236, 48.858], ...]]
      },
      "properties": {
        "zone_id": "881f1a4a9bfffff",
        "stress_score": 68,
        "severity": "medium",
        "last_updated": "2026-04-01T00:00:00Z"
      }
    }
  ]
}
```

---

### 3.2 Obtenir les Détails d'une Zone

**GET** `/geo/zones/{zone_id}`

Retourne les informations détaillées d'une zone H3 spécifique.

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**

- `zone_id`: Identifiant H3 de la zone

**Query Parameters:**

- `period` (optional): Période (défaut: la plus récente)
- `includeHistory` (optional): Inclure l'historique (défaut: false)

**Response:** `200 OK`

```json
{
  "zone_id": "881f1a4a9bfffff",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[2.234, 48.856], [2.236, 48.858], ...]]
  },
  "current": {
    "period": "2026-04",
    "stress_score": 68,
    "severity": "medium",
    "sub_indices": {
      "vegetation": 72,
      "human_pressure": 65,
      "species_sensitivity": 58,
      "temporal_dynamics": 70
    },
    "features": {
      "ndvi_mean": 0.45,
      "ndbi_mean": 0.32,
      "ndwi_mean": 0.18,
      "osm_road_density": 2.4,
      "osm_building_count": 145,
      "protected_areas": ["Natura2000"],
      "vulnerable_species_count": 7
    },
    "last_updated": "2026-04-01T00:00:00Z"
  },
  "history": [
    {
      "period": "2026-02",
      "stress_score": 65,
      "sub_indices": {...}
    }
  ]
}
```

---

### 3.3 Obtenir les Données d'un Layer

**GET** `/geo/layers/{layer_type}`

Retourne les données d'un layer spécifique pour une zone donnée.

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**

- `layer_type`: Type de layer (`ndvi`, `ndbi`, `ndwi`, `osm-roads`, `osm-buildings`, `protected-areas`, `species`)

**Query Parameters:**

- `bbox` (required): Bounding box
- `period` (optional): Période temporelle
- `resolution` (optional): Résolution H3

**Response:** `200 OK`

```json
{
  "type": "FeatureCollection",
  "layer": "ndvi",
  "period": "2026-04",
  "metadata": {
    "min": 0.12,
    "max": 0.89,
    "mean": 0.52,
    "unit": "index",
    "colormap": "viridis"
  },
  "features": [
    {
      "type": "Feature",
      "geometry": {...},
      "properties": {
        "zone_id": "881f1a4a9bfffff",
        "value": 0.45,
        "color": "#5cb85c"
      }
    }
  ]
}
```

**🔐 Restrictions:**

- Utilisateurs gratuits: Résolution limitée, watermark sur certains layers
- Premium: Accès complet, haute résolution

---

### 3.4 Obtenir les Tuiles de Carte (TMS)

**GET** `/geo/tiles/{layer}/{z}/{x}/{y}.png`

Retourne une tuile de carte au format PNG pour affichage dans Mapbox.

**Path Parameters:**

- `layer`: Type de layer (`ndvi`, `ndbi`, `ndwi`, `satellite`)
- `z`: Niveau de zoom
- `x`, `y`: Coordonnées de tuile

**Query Parameters:**

- `period` (optional): Période temporelle
- `colormap` (optional): Palette de couleurs (`viridis`, `rdylgn`, `spectral`)

**Response:** `200 OK` (Image PNG)

**🔐 Restrictions:**

- Utilisateurs gratuits: Basse résolution, watermark
- Premium: Haute résolution, sans watermark

---

### 3.5 Rechercher un Lieu

**GET** `/geo/search`

Recherche géographique par nom de lieu.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `query` (required): Texte à rechercher (ex: "Paris", "Seine-et-Marne")
- `limit` (optional): Nombre max de résultats (défaut: 10)

**Response:** `200 OK`

```json
{
  "results": [
    {
      "id": "place:paris",
      "name": "Paris",
      "type": "city",
      "country": "France",
      "bbox": [2.2241, 48.8155, 2.4699, 48.9022],
      "center": [2.3522, 48.8566]
    },
    {
      "id": "place:ile-de-france",
      "name": "Île-de-France",
      "type": "region",
      "country": "France",
      "bbox": [1.4461, 48.1197, 3.5579, 49.2414],
      "center": [2.5015, 48.6805]
    }
  ]
}
```

---

## 4. Analyses & Indicateurs

### 4.1 Créer une Analyse

**POST** `/analyses`

Crée une nouvelle analyse pour une zone spécifique.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "name": "Analyse Forêt de Fontainebleau",
  "zone_ids": ["881f1a4a9bfffff", "881f1a4aabfffff"],
  "indicators": ["ndvi", "ndbi", "species_sensitivity"],
  "period_start": "2025-01",
  "period_end": "2026-04",
  "save": true
}
```

**Response:** `201 Created`

```json
{
  "id": "analysis-uuid",
  "name": "Analyse Forêt de Fontainebleau",
  "status": "processing",
  "created_at": "2026-04-02T10:00:00Z",
  "zone_count": 2,
  "estimated_completion": "2026-04-02T10:01:00Z"
}
```

**🔐 Restrictions:**

- Utilisateurs gratuits: 3 analyses/mois, max 2 zones
- Premium: Analyses illimitées, zones illimitées

---

### 4.2 Obtenir les Résultats d'Analyse

**GET** `/analyses/{analysis_id}`

Retourne les résultats d'une analyse.

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**

- `analysis_id`: ID de l'analyse

**Response:** `200 OK`

```json
{
  "id": "analysis-uuid",
  "name": "Analyse Forêt de Fontainebleau",
  "status": "completed",
  "created_at": "2026-04-02T10:00:00Z",
  "completed_at": "2026-04-02T10:00:45Z",
  "zones": [
    {
      "zone_id": "881f1a4a9bfffff",
      "name": "Zone 1",
      "current_score": 68,
      "trend": "stable",
      "change_percent": -2.1
    }
  ],
  "indicators": {
    "ndvi": {
      "name": "Indice de Végétation",
      "values": [
        {"period": "2025-01", "value": 0.52, "zones": [...]},
        {"period": "2026-04", "value": 0.45, "zones": [...]}
      ],
      "trend": "declining",
      "change_percent": -13.5
    }
  },
  "summary": {
    "overall_stress": 67,
    "trend": "stable",
    "critical_zones": 0,
    "improving_zones": 1,
    "declining_zones": 1
  }
}
```

---

### 4.3 Lister les Analyses

**GET** `/analyses`

Liste toutes les analyses de l'utilisateur.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `status` (optional): Filtrer par statut (`processing`, `completed`, `failed`)
- `limit` (optional): Nombre max de résultats (défaut: 20)
- `offset` (optional): Offset de pagination (défaut: 0)

**Response:** `200 OK`

```json
{
  "total": 15,
  "limit": 20,
  "offset": 0,
  "analyses": [
    {
      "id": "analysis-uuid",
      "name": "Analyse Forêt de Fontainebleau",
      "status": "completed",
      "created_at": "2026-04-02T10:00:00Z",
      "zone_count": 2
    }
  ]
}
```

---

### 4.4 Supprimer une Analyse

**DELETE** `/analyses/{analysis_id}`

Supprime une analyse sauvegardée.

**Headers:** `Authorization: Bearer {token}`

**Response:** `204 No Content`

---

### 4.5 Comparer des Zones

**POST** `/analyses/compare`

Compare plusieurs zones géographiques.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "zone_ids": ["881f1a4a9bfffff", "881f1a4aabfffff", "881f1a4aacfffff"],
  "indicators": ["stress_score", "ndvi", "species_sensitivity"],
  "period": "2026-04"
}
```

**Response:** `200 OK`

```json
{
  "period": "2026-04",
  "zones": [
    {
      "zone_id": "881f1a4a9bfffff",
      "stress_score": 68,
      "ndvi": 0.45,
      "species_sensitivity": 58
    },
    {
      "zone_id": "881f1a4aabfffff",
      "stress_score": 72,
      "ndvi": 0.38,
      "species_sensitivity": 65
    }
  ],
  "comparison": {
    "best_zone": "881f1a4a9bfffff",
    "worst_zone": "881f1a4aabfffff",
    "average_score": 70
  }
}
```

**🔐 Restrictions:**

- Utilisateurs gratuits: Maximum 2 zones
- Premium: Illimité

---

### 4.6 Obtenir les Indicateurs Disponibles

**GET** `/analyses/indicators`

Liste tous les indicateurs disponibles.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

```json
{
  "indicators": [
    {
      "id": "ndvi",
      "name": "Indice de Végétation",
      "description": "Mesure de la santé de la végétation",
      "unit": "index",
      "range": [0, 1],
      "premium": false
    },
    {
      "id": "species_sensitivity",
      "name": "Sensibilité des Espèces",
      "description": "Présence d'espèces vulnérables",
      "unit": "score",
      "range": [0, 100],
      "premium": true
    }
  ]
}
```

---

## 5. Dashboard & KPIs

### 5.1 Obtenir les KPIs du Dashboard

**GET** `/dashboard/kpis`

Retourne les indicateurs clés du dashboard.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `region` (optional): Filtrer par région
- `period` (optional): Période (défaut: actuelle)

**Response:** `200 OK`

```json
{
  "period": "2026-04",
  "global": {
    "average_stress_score": 62,
    "trend": "stable",
    "change_percent": -1.2,
    "total_zones": 1247,
    "critical_zones": 34,
    "improving_zones": 456,
    "declining_zones": 189
  },
  "user_zones": {
    "saved_zones": 8,
    "average_score": 58,
    "alerts_count": 2
  },
  "coverage": {
    "vegetation_coverage": 68.4,
    "urbanization_coverage": 23.1,
    "water_coverage": 8.5
  }
}
```

---

### 5.2 Obtenir l'Activité Récente

**GET** `/dashboard/activity`

Retourne l'activité récente et les changements significatifs.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `limit` (optional): Nombre d'événements (défaut: 10)

**Response:** `200 OK`

```json
{
  "events": [
    {
      "id": "event-uuid",
      "type": "score_change",
      "severity": "high",
      "zone_id": "881f1a4a9bfffff",
      "zone_name": "Forêt de Fontainebleau - Secteur Nord",
      "message": "Score de stress augmenté de 12 points",
      "timestamp": "2026-04-01T14:23:00Z",
      "data": {
        "old_score": 58,
        "new_score": 70,
        "change": 12
      }
    },
    {
      "id": "event-uuid-2",
      "type": "new_alert",
      "severity": "medium",
      "zone_id": "881f1a4aabfffff",
      "message": "Nouvelle zone sensible détectée",
      "timestamp": "2026-03-30T09:15:00Z"
    }
  ]
}
```

---

### 5.3 Obtenir les Zones Critiques

**GET** `/dashboard/critical-zones`

Liste les zones nécessitant une attention particulière.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `severity` (optional): Filtrer par sévérité (`low`, `medium`, `high`, `critical`)
- `limit` (optional): Nombre de zones (défaut: 10)

**Response:** `200 OK`

```json
{
  "zones": [
    {
      "zone_id": "881f1a4a9bfffff",
      "name": "Forêt de Fontainebleau - Secteur Nord",
      "stress_score": 85,
      "severity": "critical",
      "trend": "increasing",
      "main_issues": [
        "Déclin de végétation important",
        "Augmentation de l'urbanisation",
        "Présence d'espèces vulnérables"
      ],
      "priority": 1,
      "last_updated": "2026-04-01T00:00:00Z"
    }
  ]
}
```

**🔐 Restrictions:**

- Utilisateurs gratuits: Top 10 seulement
- Premium: Liste complète

---

### 5.4 Obtenir la Carte Récapitulative

**GET** `/dashboard/map-summary`

Retourne un résumé cartographique pour le mini-map du dashboard.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `region` (optional): Région à afficher

**Response:** `200 OK`

```json
{
  "center": [2.3522, 48.8566],
  "zoom": 10,
  "critical_zones": [
    {
      "zone_id": "881f1a4a9bfffff",
      "center": [2.25, 48.87],
      "severity": "critical",
      "score": 85
    }
  ],
  "stats": {
    "critical": 12,
    "high": 45,
    "medium": 178,
    "low": 891
  }
}
```

---

## 6. Projections IA (Premium)

### 6.1 Obtenir les Projections

**GET** `/predictions/zones/{zone_id}`

Retourne les projections IA pour une zone spécifique.

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**

- `zone_id`: Identifiant H3 de la zone

**Query Parameters:**

- `months_ahead` (optional): Nombre de mois de projection (défaut: 12, max: 36)
- `scenarios` (optional): Types de scénarios (`baseline`, `optimistic`, `pessimistic`)

**Response:** `200 OK`

```json
{
  "zone_id": "881f1a4a9bfffff",
  "current_score": 68,
  "current_period": "2026-04",
  "projections": [
    {
      "period": "2026-05",
      "baseline": {
        "stress_score": 69,
        "confidence_interval": [66, 72],
        "confidence": 0.85
      },
      "optimistic": {
        "stress_score": 65,
        "confidence_interval": [62, 68],
        "confidence": 0.75
      },
      "pessimistic": {
        "stress_score": 75,
        "confidence_interval": [72, 78],
        "confidence": 0.8
      }
    }
  ],
  "model_metadata": {
    "model_version": "v2.1.0",
    "trained_on": "2026-03-15",
    "accuracy": 0.87
  }
}
```

**🔐 Premium uniquement**

---

### 6.2 Comparer des Scénarios

**POST** `/predictions/compare-scenarios`

Compare différents scénarios de projection pour une ou plusieurs zones.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "zone_ids": ["881f1a4a9bfffff"],
  "scenarios": ["baseline", "optimistic", "pessimistic"],
  "months_ahead": 12
}
```

**Response:** `200 OK`

```json
{
  "comparison": {
    "zone_id": "881f1a4a9bfffff",
    "scenarios": {
      "baseline": {
        "final_score": 72,
        "trend": "increasing",
        "change_from_current": 4
      },
      "optimistic": {
        "final_score": 63,
        "trend": "decreasing",
        "change_from_current": -5
      },
      "pessimistic": {
        "final_score": 82,
        "trend": "increasing_rapidly",
        "change_from_current": 14
      }
    },
    "recommendation": "Actions de conservation recommandées pour éviter le scénario pessimiste"
  }
}
```

**🔐 Premium uniquement**

---

### 6.3 Obtenir les Recommandations IA

**GET** `/predictions/recommendations/{zone_id}`

Obtient des recommandations basées sur les projections IA.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

```json
{
  "zone_id": "881f1a4a9bfffff",
  "recommendations": [
    {
      "priority": "high",
      "category": "vegetation",
      "title": "Restauration de la couverture végétale",
      "description": "Le modèle prédit une dégradation continue de la végétation. Actions de reforestation recommandées.",
      "impact": {
        "score_improvement": -8,
        "confidence": 0.82
      }
    }
  ]
}
```

**🔐 Premium uniquement**

---

## 7. Export de Données

### 7.1 Exporter une Analyse (PDF)

**POST** `/exports/analysis/{analysis_id}/pdf`

Génère un rapport PDF d'analyse.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "language": "fr",
  "include_charts": true,
  "include_maps": true
}
```

**Response:** `202 Accepted`

```json
{
  "export_id": "export-uuid",
  "status": "processing",
  "estimated_completion": "2026-04-02T10:02:00Z"
}
```

**🔐 Premium uniquement**

---

### 7.2 Exporter des Données (CSV)

**POST** `/exports/data/csv`

Exporte des données brutes au format CSV.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "zone_ids": ["881f1a4a9bfffff", "881f1a4aabfffff"],
  "indicators": ["stress_score", "ndvi", "ndbi"],
  "period_start": "2025-01",
  "period_end": "2026-04",
  "format": "csv"
}
```

**Response:** `202 Accepted`

```json
{
  "export_id": "export-uuid",
  "status": "processing",
  "estimated_completion": "2026-04-02T10:01:30Z"
}
```

**🔐 Premium uniquement**

---

### 7.3 Vérifier le Statut d'Export

**GET** `/exports/{export_id}`

Vérifie le statut d'un export.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

```json
{
  "export_id": "export-uuid",
  "status": "completed",
  "type": "pdf",
  "created_at": "2026-04-02T10:00:00Z",
  "completed_at": "2026-04-02T10:01:45Z",
  "download_url": "https://api.biowatch.fr/v1/exports/export-uuid/download",
  "expires_at": "2026-04-09T10:01:45Z"
}
```

---

### 7.4 Télécharger un Export

**GET** `/exports/{export_id}/download`

Télécharge un fichier exporté.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK` (Fichier PDF/CSV)

**🔐 Premium uniquement**

---

## 8. Notifications & Alertes

### 8.1 Obtenir les Alertes

**GET** `/notifications/alerts`

Liste les alertes actives.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `severity` (optional): Filtrer par sévérité
- `read` (optional): Filtrer par état de lecture (true/false)
- `limit` (optional): Nombre d'alertes (défaut: 20)

**Response:** `200 OK`

```json
{
  "total": 5,
  "unread": 2,
  "alerts": [
    {
      "id": "alert-uuid",
      "type": "zone_deterioration",
      "severity": "high",
      "zone_id": "881f1a4a9bfffff",
      "zone_name": "Forêt de Fontainebleau",
      "title": "Dégradation importante détectée",
      "message": "Le score de stress a augmenté de 15 points en 2 mois",
      "created_at": "2026-04-01T08:00:00Z",
      "read": false,
      "data": {
        "old_score": 55,
        "new_score": 70,
        "change": 15
      }
    }
  ]
}
```

---

### 8.2 Marquer une Alerte comme Lue

**PATCH** `/notifications/alerts/{alert_id}`

Marque une alerte comme lue.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "read": true
}
```

**Response:** `200 OK`

---

### 8.3 Configurer les Préférences de Notification

**PATCH** `/notifications/preferences`

Configure les préférences de notification.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "email_notifications": true,
  "push_notifications": true,
  "alert_threshold": "medium",
  "digest_frequency": "weekly"
}
```

**Response:** `200 OK`

**🔐 Notifications push pour Premium uniquement**

---

## 9. Zones Sauvegardées

### 9.1 Sauvegarder une Zone

**POST** `/zones/saved`

Sauvegarde une zone pour suivi.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "zone_ids": ["881f1a4a9bfffff"],
  "name": "Forêt de Fontainebleau - Monitoring",
  "alert_enabled": true,
  "alert_threshold": 75
}
```

**Response:** `201 Created`

```json
{
  "id": "saved-zone-uuid",
  "name": "Forêt de Fontainebleau - Monitoring",
  "zone_ids": ["881f1a4a9bfffff"],
  "alert_enabled": true,
  "created_at": "2026-04-02T10:00:00Z"
}
```

**🔐 Restrictions:**

- Utilisateurs gratuits: Maximum 5 zones
- Premium: Illimité

---

### 9.2 Lister les Zones Sauvegardées

**GET** `/zones/saved`

Liste toutes les zones sauvegardées.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

```json
{
  "total": 8,
  "zones": [
    {
      "id": "saved-zone-uuid",
      "name": "Forêt de Fontainebleau - Monitoring",
      "zone_ids": ["881f1a4a9bfffff"],
      "current_score": 68,
      "trend": "stable",
      "alert_enabled": true,
      "created_at": "2026-04-02T10:00:00Z"
    }
  ]
}
```

---

### 9.3 Supprimer une Zone Sauvegardée

**DELETE** `/zones/saved/{saved_zone_id}`

Supprime une zone sauvegardée.

**Headers:** `Authorization: Bearer {token}`

**Response:** `204 No Content`

---

## Codes d'Erreur

### Format des Erreurs

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email ou mot de passe incorrect",
    "details": {}
  }
}
```

### Codes HTTP

| Code | Signification         | Utilisation                                |
| ---- | --------------------- | ------------------------------------------ |
| 200  | OK                    | Requête réussie                            |
| 201  | Created               | Ressource créée                            |
| 202  | Accepted              | Requête acceptée, traitement asynchrone    |
| 204  | No Content            | Succès sans contenu de réponse             |
| 400  | Bad Request           | Données de requête invalides               |
| 401  | Unauthorized          | Authentification requise ou token invalide |
| 403  | Forbidden             | Permissions insuffisantes                  |
| 404  | Not Found             | Ressource non trouvée                      |
| 409  | Conflict              | Conflit (ex: email déjà utilisé)           |
| 422  | Unprocessable Entity  | Validation échouée                         |
| 429  | Too Many Requests     | Limite de taux dépassée                    |
| 500  | Internal Server Error | Erreur serveur                             |
| 503  | Service Unavailable   | Service temporairement indisponible        |

### Codes d'Erreur Métier

| Code                       | Description                                        |
| -------------------------- | -------------------------------------------------- |
| `INVALID_CREDENTIALS`      | Email ou mot de passe incorrect                    |
| `EMAIL_ALREADY_EXISTS`     | Email déjà enregistré                              |
| `INVALID_TOKEN`            | Token invalide ou expiré                           |
| `INSUFFICIENT_PERMISSIONS` | Permissions insuffisantes pour cette action        |
| `QUOTA_EXCEEDED`           | Quota dépassé (analyses, zones sauvegardées, etc.) |
| `PREMIUM_REQUIRED`         | Fonctionnalité réservée aux abonnés Premium        |
| `ZONE_NOT_FOUND`           | Zone H3 non trouvée                                |
| `INVALID_BBOX`             | Bounding box invalide                              |
| `ANALYSIS_NOT_FOUND`       | Analyse non trouvée                                |
| `EXPORT_FAILED`            | Échec de l'export                                  |
| `INVALID_PERIOD`           | Période temporelle invalide                        |
| `DATA_NOT_AVAILABLE`       | Données non disponibles pour la période demandée   |
| `ZONE_TOO_LARGE`           | Zone trop grande pour cette opération              |
| `TOO_MANY_ZONES`           | Trop de zones dans la requête                      |

---

## Notes d'Implémentation

### Pagination

Les endpoints qui retournent des listes supportent la pagination via `limit` et `offset`.

### Rate Limiting

- Utilisateurs gratuits: 100 requêtes/heure
- Premium: 1000 requêtes/heure
- Admin: Illimité

### Gestion du Cache

- Les données géospatiales sont mises en cache côté serveur
- Header `Cache-Control` indique la durée de validité
- Header `ETag` pour validation de cache

### Versioning

L'API utilise le versioning par URL (`/v1/`). Les changements breaking nécessitent une nouvelle version.

### WebSocket (Futur)

Pour les notifications en temps réel, un endpoint WebSocket sera disponible:

```
wss://api.biowatch.fr/v1/ws
```

---

**Fin de la Spécification API**
