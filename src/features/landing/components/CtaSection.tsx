import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './icons';

function CtaSection() {
  return (
    <section className="lp-section lp-cta" aria-labelledby="lp-cta-title">
      <div className="lp-container">
        <div className="lp-cta-panel">
          <div className="lp-cta-glow" aria-hidden="true" />
          <p className="lp-cta-eyebrow">Rejoignez 140+ collectivites</p>
          <h2 id="lp-cta-title" className="lp-cta-title">
            Pret a proteger votre territoire ?
          </h2>
          <p className="lp-cta-lead">
            Deployez BioWatch en moins d'une semaine. Acces complet, sans engagement.
          </p>
          <div className="lp-cta-actions">
            <Link to="/signup" className="lp-btn lp-btn-primary">
              Demarrer maintenant
              <ArrowRightIcon className="lp-btn-icon" />
            </Link>
            <Link to="/login" className="lp-btn lp-btn-ghost">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
