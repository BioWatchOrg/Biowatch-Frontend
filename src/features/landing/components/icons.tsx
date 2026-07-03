import { type SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

/**
 * Decorative inline icons for the landing page.
 *
 * Inlined as SVG (rather than pulling a new icon dependency) because the project
 * ships no icon library yet. They inherit `currentColor` and are hidden from the
 * accessibility tree by default; pass `aria-hidden={false}` + a `title` if an icon
 * ever needs to be meaningful on its own.
 */

const BASE_PROPS: SVGProps<SVGSVGElement> = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export function LeafIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <path d="M11 20A7 7 0 0 1 4 13C4 8 8 4 18 4c0 10-4 14-9 14Z" />
      <path d="M4 20c2-4 6-7 11-9" />
    </svg>
  );
}

export function SatelliteIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <path d="m6 8 3-3 3 3-3 3z" />
      <path d="m12 14 3-3 3 3-3 3z" />
      <path d="m9 11 3 3" />
      <path d="M14 6a4 4 0 0 1 4 4" />
      <path d="M5 18a4 4 0 0 0 4-4" />
    </svg>
  );
}

export function MicroscopeIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" />
      <path d="M9 12a2 2 0 0 1-2-2V6h4v4a2 2 0 0 1-2 2Z" />
      <path d="M12 6h-1V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v3H6" />
    </svg>
  );
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <path d="M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <path d="M21.8 10A10 10 0 1 1 17 3.3" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}
