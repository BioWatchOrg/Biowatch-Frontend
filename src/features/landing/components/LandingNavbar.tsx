import { Link } from 'react-router-dom';
import { LeafIcon } from './icons';

function LandingNavbar() {
  return (
    <header className="lp-header">
      <nav className="lp-nav" aria-label="Navigation principale">
        <Link to="/" className="lp-brand" aria-label="BioWatch, accueil">
          <span className="lp-brand-mark">
            <LeafIcon className="lp-brand-icon" />
          </span>
          <span className="lp-brand-name">BioWatch</span>
        </Link>
        <div className="lp-nav-actions">
          <a className="lp-nav-link" href="#features">
            Fonctionnalites
          </a>
          <Link className="lp-nav-cta" to="/login">
            Se connecter
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default LandingNavbar;
