import { useSignInToDashboard } from '../../auth/hooks/useSignInToDashboard';
import { ArrowRightIcon } from './icons';

function CtaSection() {
  const signInToDashboard = useSignInToDashboard();

  return (
    <section className="lp-section lp-cta" aria-labelledby="lp-cta-title">
      <div className="lp-container">
        <div className="lp-cta-panel">
          <p className="lp-cta-eyebrow">Rejoignez 140+ collectivites</p>
          <h2 id="lp-cta-title" className="lp-cta-title">
            Pret a proteger votre territoire ?
          </h2>
          <p className="lp-cta-lead">
            Deployez BioWatch en moins d'une semaine. Acces complet, sans engagement.
          </p>
          <div className="lp-cta-actions">
            <button type="button" className="btn btn-cta" onClick={signInToDashboard}>
              Demarrer maintenant
              <ArrowRightIcon className="btn-icon" />
            </button>
            <button type="button" className="btn btn-ghost-inverse" onClick={signInToDashboard}>
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
