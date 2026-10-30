import { useEffect } from 'react';
import { useMapStore } from '../../store/mapStore';
import { ZONES_FILL_LAYER_ID } from '../layers/stressScoreLayer';

/** Événement MapLibre sur une couche : seules les propriétés de la feature nous intéressent. */
export interface ZoneLayerEvent {
  features?: Array<{ properties: Record<string, unknown> | null }>;
}

type ZoneLayerEventType = 'click' | 'mouseenter' | 'mouseleave';

/** Le minimum attendu d'une instance MapLibre — un stub suffit donc à tester ce hook. */
export interface SelectableMap {
  on(type: ZoneLayerEventType, layerId: string, listener: (e: ZoneLayerEvent) => void): unknown;
  off(type: ZoneLayerEventType, layerId: string, listener: (e: ZoneLayerEvent) => void): unknown;
  getCanvas(): { style: { cursor: string } };
}

/** `zone_id` de la cellule cliquée, ou `null` si l'événement n'en porte pas. */
export const zoneIdFromEvent = (event: ZoneLayerEvent): string | null => {
  const zoneId = event.features?.[0]?.properties?.zone_id;
  return typeof zoneId === 'string' && zoneId !== '' ? zoneId : null;
};

/**
 * Un clic sur une cellule envoie son `zone_id` au store de la carte. Le curseur passe
 * en main au survol, pour signaler que les cellules sont cliquables.
 */
export const useZoneSelection = (map: SelectableMap | null): void => {
  useEffect(() => {
    if (!map) return;

    const handleClick = (event: ZoneLayerEvent) => {
      const zoneId = zoneIdFromEvent(event);
      if (zoneId) useMapStore.getState().selectZone(zoneId);
    };
    const showPointer = () => {
      map.getCanvas().style.cursor = 'pointer';
    };
    const resetPointer = () => {
      map.getCanvas().style.cursor = '';
    };

    map.on('click', ZONES_FILL_LAYER_ID, handleClick);
    map.on('mouseenter', ZONES_FILL_LAYER_ID, showPointer);
    map.on('mouseleave', ZONES_FILL_LAYER_ID, resetPointer);

    return () => {
      map.off('click', ZONES_FILL_LAYER_ID, handleClick);
      map.off('mouseenter', ZONES_FILL_LAYER_ID, showPointer);
      map.off('mouseleave', ZONES_FILL_LAYER_ID, resetPointer);
    };
  }, [map]);
};
