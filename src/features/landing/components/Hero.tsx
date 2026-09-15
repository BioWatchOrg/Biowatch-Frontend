import { Link } from 'react-router-dom';
import { ArrowRightIcon, CheckCircleIcon, LeafIcon } from './icons';

const TRUST_BADGES: readonly string[] = [
  'Donnees ESA Sentinel',
  'Mise a jour toutes les 48h',
  'RGPD conforme',
];

function Hero() {
  return (
    <section className="lp-hero" aria-labelledby="lp-hero-title">
      <div className="lp-hero-blob lp-hero-blob-1" aria-hidden="true" />
      <div className="lp-hero-blob lp-hero-blob-2" aria-hidden="true" />
      <div className="lp-container lp-hero-inner">
        <p className="lp-eyebrow">
          <LeafIcon className="lp-eyebrow-icon" />
          <span>Analyse environnementale par satellite</span>
        </p>
        <h1 id="lp-hero-title" className="lp-hero-title">
          Surveillez vos <span className="lp-hero-accent">ecosystemes</span> en temps reel
        </h1>
        <p className="lp-hero-subtitle">
          BioWatch analyse les donnees satellitaires et l'IA pour detecter les tensions ecologiques
          sur votre territoire. Des decisions eclairees pour les collectivites locales.
        </p>
        <div className="lp-hero-actions">
          <Link to="/signup" className="lp-btn lp-btn-primary">
            Commencer gratuitement
            <ArrowRightIcon className="lp-btn-icon" />
          </Link>
          <Link to="/dashboard" className="lp-btn lp-btn-ghost">
            Voir la demo
          </Link>
        </div>
        <ul className="lp-trust" aria-label="Garanties">
          {TRUST_BADGES.map((badge) => (
            <li key={badge} className="lp-trust-item">
              <CheckCircleIcon className="lp-trust-icon" />
              <span>{badge}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Hero;
