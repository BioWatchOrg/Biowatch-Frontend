import { useEffect } from 'react';
import { useMapStore } from '../../store/mapStore';
import { useMapInstance } from '../hooks/useMapInstance';
import { useZoneSelection } from '../hooks/useZoneSelection';
import { useZonesInView } from '../hooks/useZonesInView';
import {
  addStressScoreLayer,
  setSelectedZone,
  setStressScoreData,
} from '../layers/stressScoreLayer';
import { zonesToFeatureCollection } from '../utils/geojson';
import MapStatus from './MapStatus';
import ScoreLegend from './ScoreLegend';
// Le CSS de MapLibre d'abord : `.maplibregl-map` impose sa propre position et
// écraserait nos règles s'il était chargé après.
import 'maplibre-gl/dist/maplibre-gl.css';
import '../map.css';

/**
 * Carte principale : fond MapLibre, cellules colorées par score, rechargées à chaque
 * déplacement de la vue. Un clic sur une cellule la sélectionne dans `useMapStore`.
 */
function StressScoreMap() {
  const { containerRef, map, styleError } = useMapInstance();
  const { zones, status, error, retry } = useZonesInView(map);
  const selectedZoneId = useMapStore((state) => state.selectedZoneId);
  useZoneSelection(map);

  useEffect(() => {
    if (!map) return;
    addStressScoreLayer(map);
  }, [map]);

  useEffect(() => {
    if (!map) return;
    setStressScoreData(map, zonesToFeatureCollection(zones));
  }, [map, zones]);

  useEffect(() => {
    if (!map) return;
    setSelectedZone(map, selectedZoneId);
  }, [map, selectedZoneId]);

  return (
    <div className="map-shell">
      <div ref={containerRef} className="map-canvas" data-testid="map-canvas" />
      <MapStatus
        status={styleError ? 'error' : status}
        error={styleError ?? error}
        onRetry={retry}
      />
      <ScoreLegend />
    </div>
  );
}

export default StressScoreMap;
