# BioWatch API Specification - Frontend

**Version**: 1.0  
**Date**: April 2, 2026  
**Author**: BioWatch Frontend Team

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication & Authorization](#1-authentication--authorization)
3. [User Management](#2-user-management)
4. [Geospatial Data](#3-geospatial-data)
5. [Analysis & Indicators](#4-analysis--indicators)
6. [Dashboard & KPIs](#5-dashboard--kpis)
7. [AI Projections (Premium)](#6-ai-projections-premium)
8. [Data Export](#7-data-export)
9. [Notifications & Alerts](#8-notifications--alerts)
10. [Error Codes](#error-codes)

---

## Overview

### Base URL

```
Production: https://api.biowatch.fr/v1
Development: https://api-dev.biowatch.fr/v1
```

### Response Format

All responses are in JSON format with UTF-8 encoding.

### Authentication

Most endpoints require a JWT token in the header:

```
Authorization: Bearer {token}
```

### Access Levels

- **Free**: Limited access to basic features
- **Premium**: Full access to analyses, AI projections, exports
- **Admin**: User management and system configuration

---

## 1. Authentication & Authorization

### 1.1 Register

**POST** `/auth/register`

Creates a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "language": "en"
}
```

**Response:** `201 Created`

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
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

### 1.2 Login

**POST** `/auth/login`

Authenticates an existing user.

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
    "firstName": "John",
    "lastName": "Doe",
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

### 1.3 Refresh Token

**POST** `/auth/refresh`

Obtains a new access token using the refresh token.

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

### 1.4 Logout

**POST** `/auth/logout`

Invalidates user tokens.

**Headers:** `Authorization: Bearer {token}`

**Response:** `204 No Content`

---

### 1.5 Forgot Password

**POST** `/auth/forgot-password`

Sends a password reset email.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`

```json
{
  "message": "Password reset email sent"
}
```

---

### 1.6 Reset Password

**POST** `/auth/reset-password`

Resets password using the token from email.

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
  "message": "Password reset successfully"
}
```

---

### 1.7 Check Permissions

**GET** `/auth/permissions`

Returns the logged-in user's permissions.

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

## 2. User Management

### 2.1 Get Profile

**GET** `/users/me`

Returns the logged-in user's profile.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "premium",
  "language": "en",
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

### 2.2 Update Profile

**PATCH** `/users/me`

Updates user profile.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "language": "en"
}
```

**Response:** `200 OK`

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "language": "en"
}
```

---

### 2.3 Update Preferences

**PATCH** `/users/me/preferences`

Updates user preferences.

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

### 2.4 Get Usage Statistics

**GET** `/users/me/usage`

Returns usage statistics for the user.

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

### 2.5 Subscription Management

**GET** `/users/me/subscription`

Gets subscription details.

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

## 3. Geospatial Data

### 3.1 Get H3 Zones by BBox

**GET** `/geo/zones`

Returns H3 hexagonal zones within a geographic area (bounding box).

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `bbox` (required): `minLng,minLat,maxLng,maxLat` (e.g., `2.2,48.8,2.5,48.9`)
- `resolution` (optional): H3 resolution (default: 8)
- `includeScores` (optional): Include stress scores (default: false)
- `period` (optional): Time period (format: `YYYY-MM`, default: most recent)

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

### 3.2 Get Zone Details

**GET** `/geo/zones/{zone_id}`

Returns detailed information for a specific H3 zone.

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**

- `zone_id`: H3 zone identifier

**Query Parameters:**

- `period` (optional): Period (default: most recent)
- `includeHistory` (optional): Include history (default: false)

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

### 3.3 Get Layer Data

**GET** `/geo/layers/{layer_type}`

Returns data for a specific layer for a given area.

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**

- `layer_type`: Layer type (`ndvi`, `ndbi`, `ndwi`, `osm-roads`, `osm-buildings`, `protected-areas`, `species`)

**Query Parameters:**

- `bbox` (required): Bounding box
- `period` (optional): Time period
- `resolution` (optional): H3 resolution

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

- Free users: Limited resolution, watermark on some layers
- Premium: Full access, high resolution

---

### 3.4 Get Map Tiles (TMS)

**GET** `/geo/tiles/{layer}/{z}/{x}/{y}.png`

Returns a map tile in PNG format for display in Mapbox.

**Path Parameters:**

- `layer`: Layer type (`ndvi`, `ndbi`, `ndwi`, `satellite`)
- `z`: Zoom level
- `x`, `y`: Tile coordinates

**Query Parameters:**

- `period` (optional): Time period
- `colormap` (optional): Color palette (`viridis`, `rdylgn`, `spectral`)

**Response:** `200 OK` (PNG Image)

**🔐 Restrictions:**

- Free users: Low resolution, watermark
- Premium: High resolution, no watermark

---

### 3.5 Search Location

**GET** `/geo/search`

Geographic search by place name.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `query` (required): Search text (e.g., "Paris", "Seine-et-Marne")
- `limit` (optional): Max number of results (default: 10)

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

## 4. Analysis & Indicators

### 4.1 Create Analysis

**POST** `/analyses`

Creates a new analysis for a specific zone.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "name": "Fontainebleau Forest Analysis",
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
  "name": "Fontainebleau Forest Analysis",
  "status": "processing",
  "created_at": "2026-04-02T10:00:00Z",
  "zone_count": 2,
  "estimated_completion": "2026-04-02T10:01:00Z"
}
```

**🔐 Restrictions:**

- Free users: 3 analyses/month, max 2 zones
- Premium: Unlimited analyses, unlimited zones

---

### 4.2 Get Analysis Results

**GET** `/analyses/{analysis_id}`

Returns analysis results.

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**

- `analysis_id`: Analysis ID

**Response:** `200 OK`

```json
{
  "id": "analysis-uuid",
  "name": "Fontainebleau Forest Analysis",
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
      "name": "Vegetation Index",
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

### 4.3 List Analyses

**GET** `/analyses`

Lists all user analyses.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `status` (optional): Filter by status (`processing`, `completed`, `failed`)
- `limit` (optional): Max number of results (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:** `200 OK`

```json
{
  "total": 15,
  "limit": 20,
  "offset": 0,
  "analyses": [
    {
      "id": "analysis-uuid",
      "name": "Fontainebleau Forest Analysis",
      "status": "completed",
      "created_at": "2026-04-02T10:00:00Z",
      "zone_count": 2
    }
  ]
}
```

---

### 4.4 Delete Analysis

**DELETE** `/analyses/{analysis_id}`

Deletes a saved analysis.

**Headers:** `Authorization: Bearer {token}`

**Response:** `204 No Content`

---

### 4.5 Compare Zones

**POST** `/analyses/compare`

Compares multiple geographic zones.

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

- Free users: Maximum 2 zones
- Premium: Unlimited

---

### 4.6 Get Available Indicators

**GET** `/analyses/indicators`

Lists all available indicators.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

```json
{
  "indicators": [
    {
      "id": "ndvi",
      "name": "Vegetation Index",
      "description": "Measure of vegetation health",
      "unit": "index",
      "range": [0, 1],
      "premium": false
    },
    {
      "id": "species_sensitivity",
      "name": "Species Sensitivity",
      "description": "Presence of vulnerable species",
      "unit": "score",
      "range": [0, 100],
      "premium": true
    }
  ]
}
```

---

## 5. Dashboard & KPIs

### 5.1 Get Dashboard KPIs

**GET** `/dashboard/kpis`

Returns key performance indicators for the dashboard.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `region` (optional): Filter by region
- `period` (optional): Period (default: current)

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

### 5.2 Get Recent Activity

**GET** `/dashboard/activity`

Returns recent activity and significant changes.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `limit` (optional): Number of events (default: 10)

**Response:** `200 OK`

```json
{
  "events": [
    {
      "id": "event-uuid",
      "type": "score_change",
      "severity": "high",
      "zone_id": "881f1a4a9bfffff",
      "zone_name": "Fontainebleau Forest - North Sector",
      "message": "Stress score increased by 12 points",
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
      "message": "New sensitive zone detected",
      "timestamp": "2026-03-30T09:15:00Z"
    }
  ]
}
```

---

### 5.3 Get Critical Zones

**GET** `/dashboard/critical-zones`

Lists zones requiring special attention.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `severity` (optional): Filter by severity (`low`, `medium`, `high`, `critical`)
- `limit` (optional): Number of zones (default: 10)

**Response:** `200 OK`

```json
{
  "zones": [
    {
      "zone_id": "881f1a4a9bfffff",
      "name": "Fontainebleau Forest - North Sector",
      "stress_score": 85,
      "severity": "critical",
      "trend": "increasing",
      "main_issues": [
        "Significant vegetation decline",
        "Increased urbanization",
        "Presence of vulnerable species"
      ],
      "priority": 1,
      "last_updated": "2026-04-01T00:00:00Z"
    }
  ]
}
```

**🔐 Restrictions:**

- Free users: Top 10 only
- Premium: Full list

---

### 5.4 Get Map Summary

**GET** `/dashboard/map-summary`

Returns a map summary for the dashboard mini-map.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `region` (optional): Region to display

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

## 6. AI Projections (Premium)

### 6.1 Get Projections

**GET** `/predictions/zones/{zone_id}`

Returns AI projections for a specific zone.

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**

- `zone_id`: H3 zone identifier

**Query Parameters:**

- `months_ahead` (optional): Number of months to project (default: 12, max: 36)
- `scenarios` (optional): Scenario types (`baseline`, `optimistic`, `pessimistic`)

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

**🔐 Premium only**

---

### 6.2 Compare Scenarios

**POST** `/predictions/compare-scenarios`

Compares different projection scenarios for one or more zones.

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
    "recommendation": "Conservation actions recommended to avoid pessimistic scenario"
  }
}
```

**🔐 Premium only**

---

### 6.3 Get AI Recommendations

**GET** `/predictions/recommendations/{zone_id}`

Gets recommendations based on AI projections.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

```json
{
  "zone_id": "881f1a4a9bfffff",
  "recommendations": [
    {
      "priority": "high",
      "category": "vegetation",
      "title": "Restore vegetation cover",
      "description": "The model predicts continued vegetation degradation. Reforestation actions recommended.",
      "impact": {
        "score_improvement": -8,
        "confidence": 0.82
      }
    }
  ]
}
```

**🔐 Premium only**

---

## 7. Data Export

### 7.1 Export Analysis (PDF)

**POST** `/exports/analysis/{analysis_id}/pdf`

Generates a PDF analysis report.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "language": "en",
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

**🔐 Premium only**

---

### 7.2 Export Data (CSV)

**POST** `/exports/data/csv`

Exports raw data in CSV format.

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

**🔐 Premium only**

---

### 7.3 Check Export Status

**GET** `/exports/{export_id}`

Checks export status.

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

### 7.4 Download Export

**GET** `/exports/{export_id}/download`

Downloads exported file.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK` (PDF/CSV File)

**🔐 Premium only**

---

## 8. Notifications & Alerts

### 8.1 Get Alerts

**GET** `/notifications/alerts`

Lists active alerts.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `severity` (optional): Filter by severity
- `read` (optional): Filter by read status (true/false)
- `limit` (optional): Number of alerts (default: 20)

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
      "zone_name": "Fontainebleau Forest",
      "title": "Significant degradation detected",
      "message": "Stress score increased by 15 points in 2 months",
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

### 8.2 Mark Alert as Read

**PATCH** `/notifications/alerts/{alert_id}`

Marks an alert as read.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "read": true
}
```

**Response:** `200 OK`

---

### 8.3 Configure Notification Preferences

**PATCH** `/notifications/preferences`

Configures notification preferences.

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

**🔐 Push notifications for Premium only**

---

## 9. Saved Zones

### 9.1 Save Zone

**POST** `/zones/saved`

Saves a zone for monitoring.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "zone_ids": ["881f1a4a9bfffff"],
  "name": "Fontainebleau Forest - Monitoring",
  "alert_enabled": true,
  "alert_threshold": 75
}
```

**Response:** `201 Created`

```json
{
  "id": "saved-zone-uuid",
  "name": "Fontainebleau Forest - Monitoring",
  "zone_ids": ["881f1a4a9bfffff"],
  "alert_enabled": true,
  "created_at": "2026-04-02T10:00:00Z"
}
```

**🔐 Restrictions:**

- Free users: Maximum 5 zones
- Premium: Unlimited

---

### 9.2 List Saved Zones

**GET** `/zones/saved`

Lists all saved zones.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

```json
{
  "total": 8,
  "zones": [
    {
      "id": "saved-zone-uuid",
      "name": "Fontainebleau Forest - Monitoring",
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

### 9.3 Delete Saved Zone

**DELETE** `/zones/saved/{saved_zone_id}`

Deletes a saved zone.

**Headers:** `Authorization: Bearer {token}`

**Response:** `204 No Content`

---

## Error Codes

### Error Format

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "details": {}
  }
}
```

### HTTP Status Codes

| Code | Meaning               | Usage                                     |
| ---- | --------------------- | ----------------------------------------- |
| 200  | OK                    | Successful request                        |
| 201  | Created               | Resource created                          |
| 202  | Accepted              | Request accepted, asynchronous processing |
| 204  | No Content            | Success with no response content          |
| 400  | Bad Request           | Invalid request data                      |
| 401  | Unauthorized          | Authentication required or invalid token  |
| 403  | Forbidden             | Insufficient permissions                  |
| 404  | Not Found             | Resource not found                        |
| 409  | Conflict              | Conflict (e.g., email already used)       |
| 422  | Unprocessable Entity  | Validation failed                         |
| 429  | Too Many Requests     | Rate limit exceeded                       |
| 500  | Internal Server Error | Server error                              |
| 503  | Service Unavailable   | Service temporarily unavailable           |

### Business Error Codes

| Code                       | Description                                  |
| -------------------------- | -------------------------------------------- |
| `INVALID_CREDENTIALS`      | Invalid email or password                    |
| `EMAIL_ALREADY_EXISTS`     | Email already registered                     |
| `INVALID_TOKEN`            | Invalid or expired token                     |
| `INSUFFICIENT_PERMISSIONS` | Insufficient permissions for this action     |
| `QUOTA_EXCEEDED`           | Quota exceeded (analyses, saved zones, etc.) |
| `PREMIUM_REQUIRED`         | Feature reserved for Premium subscribers     |
| `ZONE_NOT_FOUND`           | H3 zone not found                            |
| `INVALID_BBOX`             | Invalid bounding box                         |
| `ANALYSIS_NOT_FOUND`       | Analysis not found                           |
| `EXPORT_FAILED`            | Export failed                                |
| `INVALID_PERIOD`           | Invalid time period                          |
| `DATA_NOT_AVAILABLE`       | Data not available for requested period      |
| `ZONE_TOO_LARGE`           | Zone too large for this operation            |
| `TOO_MANY_ZONES`           | Too many zones in request                    |

---

## Implementation Notes

### Pagination

Endpoints returning lists support pagination via `limit` and `offset`.

### Rate Limiting

- Free users: 100 requests/hour
- Premium: 1000 requests/hour
- Admin: Unlimited

### Caching

- Geospatial data is cached server-side
- `Cache-Control` header indicates validity duration
- `ETag` header for cache validation

### Versioning

The API uses URL versioning (`/v1/`). Breaking changes require a new version.

### WebSocket (Future)

For real-time notifications, a WebSocket endpoint will be available:

```
wss://api.biowatch.fr/v1/ws
```

---

**End of API Specification**
