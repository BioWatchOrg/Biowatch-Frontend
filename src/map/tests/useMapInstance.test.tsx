import { act, render } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { useMapInstance, type MapInstance } from '../hooks/useMapInstance';

/** Instance MapLibre factice : on déclenche à la main `error` et `load`. */
const { FakeMap } = vi.hoisted(() => {
  type Handler = () => void;

  class FakeMap {
    static last: FakeMap | null = null;
    handlers = new Map<string, Set<Handler>>();
    removed = false;

    constructor() {
      FakeMap.last = this;
    }

    on(event: string, handler: Handler) {
      if (!this.handlers.has(event)) this.handlers.set(event, new Set());
      this.handlers.get(event)?.add(handler);
    }

    off(event: string, handler: Handler) {
      this.handlers.get(event)?.delete(handler);
    }

    once(event: string, handler: Handler) {
      const wrapped = () => {
        this.off(event, wrapped);
        handler();
      };
      this.on(event, wrapped);
    }

    fire(event: string) {
      for (const handler of [...(this.handlers.get(event) ?? [])]) handler();
    }

    listenerCount(event: string) {
      return this.handlers.get(event)?.size ?? 0;
    }

    addControl() {}
    resize() {}
    remove() {
      this.removed = true;
    }
  }

  return { FakeMap };
});

vi.mock('maplibre-gl', () => ({
  Map: FakeMap,
  NavigationControl: class {},
  ScaleControl: class {},
  setWorkerUrl: () => {},
}));

let latest: MapInstance;

function Probe() {
  latest = useMapInstance();
  return <div ref={latest.containerRef} />;
}

describe('useMapInstance', () => {
  beforeAll(() => {
    // jsdom n'implémente pas ResizeObserver.
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    );
  });

  afterEach(() => {
    FakeMap.last = null;
  });

  it('expose la carte une fois chargee', () => {
    render(<Probe />);
    expect(latest.map).toBeNull();

    act(() => FakeMap.last?.fire('load'));

    expect(latest.map).toBe(FakeMap.last);
    expect(latest.styleError).toBeNull();
  });

  it('signale un fond de carte indisponible si le style ne se charge pas', () => {
    render(<Probe />);

    act(() => FakeMap.last?.fire('error'));

    expect(latest.styleError).toBe('Le fond de carte est indisponible.');
    expect(latest.map).toBeNull();
  });

  it('ignore une erreur de tuile apres le chargement', () => {
    render(<Probe />);
    act(() => FakeMap.last?.fire('load'));

    act(() => FakeMap.last?.fire('error'));

    expect(latest.styleError).toBeNull();
    // Plus aucun écouteur de notre part : MapLibre signale lui-même l'erreur en console.
    expect(FakeMap.last?.listenerCount('error')).toBe(0);
  });

  it('efface une erreur transitoire quand la carte finit par charger', () => {
    render(<Probe />);
    act(() => FakeMap.last?.fire('error'));

    act(() => FakeMap.last?.fire('load'));

    expect(latest.styleError).toBeNull();
    expect(latest.map).toBe(FakeMap.last);
  });

  it('detruit l instance au demontage', () => {
    const { unmount } = render(<Probe />);
    const instance = FakeMap.last;

    unmount();

    expect(instance?.removed).toBe(true);
  });
});
