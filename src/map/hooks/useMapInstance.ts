import { useEffect, useRef, useState } from 'react';
import { Map as MapLibreMap, NavigationControl, ScaleControl, setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';

// MapLibre 6 charge son worker depuis un fichier séparé. Son URL relative ne survit pas au
// pré-bundling de Vite (« Worker failed to load »), donc on la lui donne explicitement :
// `?url` laisse Vite émettre le fichier et en résoudre l'adresse, en dev comme en production.
setWorkerUrl(workerUrl);

/** Vue initiale : agglomération parisienne, zone pilote du MVP. */
export const INITIAL_VIEW = {
  center: [2.3488, 48.8534] as [number, number],
  zoom: 11,
};

/**
 * Fond de carte : style CARTO Positron, public et sans jeton d'accès — contrairement à
 * Mapbox, rien à facturer ni à stocker en secret. Fond volontairement clair et sobre pour
 * que la couleur porte le score, pas le décor. L'attribution CARTO/OpenStreetMap est fournie
 * par le style lui-même et affichée par le contrôle d'attribution.
 * `VITE_MAP_STYLE_URL` permet d'en changer sans retoucher le code.
 */
const DEFAULT_STYLE_URL = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

export interface MapInstance {
  containerRef: React.RefObject<HTMLDivElement | null>;
  map: MapLibreMap | null;
  /** Le style n'a pas pu être chargé (réseau, URL invalide) : la carte reste vide. */
  styleError: string | null;
}

/**
 * Crée l'instance MapLibre une seule fois et la détruit au démontage — sans ça, chaque
 * navigation vers la carte laisserait un contexte WebGL orphelin.
 */
export const useMapInstance = (): MapInstance => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [styleError, setStyleError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = new MapLibreMap({
      container: containerRef.current,
      style: import.meta.env.VITE_MAP_STYLE_URL ?? DEFAULT_STYLE_URL,
      center: INITIAL_VIEW.center,
      zoom: INITIAL_VIEW.zoom,
      attributionControl: { compact: true },
    });

    instance.addControl(new NavigationControl({ visualizePitch: false }), 'top-right');
    instance.addControl(new ScaleControl({ unit: 'metric' }), 'bottom-left');

    // Le conteneur peut encore avoir une taille nulle à la création (CSS de la route chargé
    // en différé) : sans ça, la carte garde un canvas de 300 px et n'affiche rien.
    const resizeObserver = new ResizeObserver(() => instance.resize());
    resizeObserver.observe(containerRef.current);

    const handleError = () => setStyleError('Le fond de carte est indisponible.');
    instance.on('error', handleError);
    instance.once('load', () => setMap(instance));

    return () => {
      resizeObserver.disconnect();
      instance.off('error', handleError);
      instance.remove();
      setMap(null);
    };
  }, []);

  return { containerRef, map, styleError };
};
