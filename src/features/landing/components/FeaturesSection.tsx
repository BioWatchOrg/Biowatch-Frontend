import { type ComponentType, type SVGProps } from 'react';
import FeatureCard from './FeatureCard';
import { AlertTriangleIcon, MicroscopeIcon, SatelliteIcon } from './icons';

type Feature = {
  id: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  accent: string;
};

const FEATURES: readonly Feature[] = [
  {
    id: 'satellite',
    icon: SatelliteIcon,
    title: 'Donnees satellites',
    description:
      'Indices NDVI, humidite des sols et artificialisation issus des donnees Sentinel-2 et Sentinel-1, mis a jour toutes les 48 heures.',
    accent: '#a7f3d0',
  },
  {
    id: 'biodiversity',
    icon: MicroscopeIcon,
    title: 'Biodiversite',
    description:
      "Suivi des especes protegees et des habitats naturels a partir d'occurrences GBIF et de modeles de distribution d'especes.",
    accent: '#7dd3fc',
  },
  {
    id: 'anomaly',
    icon: AlertTriangleIcon,
    title: "Detection d'anomalies",
    description:
      "Algorithmes d'IA qui detectent automatiquement les deviations significatives : deforestation, secheresse, fragmentation.",
    accent: '#fca5a5',
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="lp-section lp-features" aria-labelledby="lp-features-title">
      <div className="lp-container">
        <div className="lp-section-head">
          <p className="lp-section-eyebrow">Fonctionnalites</p>
          <h2 id="lp-features-title" className="lp-section-title">
            Tout ce dont vous avez besoin
          </h2>
          <p className="lp-section-lead">
            Un tableau de bord unifie pour piloter la sante ecologique de vos zones naturelles.
          </p>
        </div>
        <div className="lp-grid lp-features-grid">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              accent={feature.accent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
